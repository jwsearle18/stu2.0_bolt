import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, PlusCircle, Trash2, Clock, AlertTriangle, Download, Share2, Edit } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AcademicPlan, Semester, Course } from '../types';
import { courses } from '../data/courses';
import { v4 as uuidv4 } from 'uuid';

const PlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { student, currentPlan, setCurrentPlan, savePlan, validatePlan, getRequirements } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string>('');
  const [validation, setValidation] = useState<{ valid: boolean; issues: string[] }>({
    valid: true,
    issues: [],
  });

  // Redirect if no student info
  useEffect(() => {
    if (!student) {
      navigate('/onboarding');
    } else if (!currentPlan) {
      // Generate initial plan if none exists
      generateNewPlan();
    } else {
      setPlanName(currentPlan.name);
      validateCurrentPlan();
    }
  }, [student, currentPlan]);

  const validateCurrentPlan = () => {
    if (currentPlan) {
      const result = validatePlan(currentPlan);
      setValidation(result);
    }
  };

  const generateNewPlan = () => {
    if (!student) return;

    const startYear = student.startYear;
    const includeSummer = student.preferences.includeSummer;
    const maxCreditsPerSemester = student.preferences.maxCreditsPerSemester;
    
    const semesters: Semester[] = [];
    
    // Generate 4 years of semesters (Fall and Winter, optionally Summer)
    for (let year = 0; year < 4; year++) {
      semesters.push({
        id: uuidv4(),
        term: 'Fall',
        year: startYear + year,
        courses: [],
      });
      
      semesters.push({
        id: uuidv4(),
        term: 'Winter',
        year: startYear + year + 1,
        courses: [],
      });
      
      if (includeSummer) {
        semesters.push({
          id: uuidv4(),
          term: 'Spring/Summer',
          year: startYear + year + 1,
          courses: [],
        });
      }
    }
    
    // Create a basic plan
    const newPlan: AcademicPlan = {
      id: uuidv4(),
      name: 'My Academic Plan',
      student: student.id,
      major: student.major,
      minor: student.minor,
      semesters,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isComplete: false,
    };
    
    // Auto-populate with required courses if a major is selected
    if (student.major) {
      const majorRequirements = getRequirements(student.major);
      
      if (majorRequirements && majorRequirements.requiredCourses) {
        let currentSemesterIndex = 0;
        let currentSemesterCredits = 0;
        
        // Get all required courses
        const requiredCourses = majorRequirements.requiredCourses
          .map(courseCode => courses.find(c => c.code === courseCode))
          .filter(course => course) as Course[];
          
        // Sort by prerequisites to ensure proper sequencing
        const sortedCourses = sortCoursesByPrerequisites(requiredCourses);
        
        // Distribute courses across semesters
        for (const course of sortedCourses) {
          if (currentSemesterCredits + course.credits > maxCreditsPerSemester) {
            currentSemesterIndex++;
            currentSemesterCredits = 0;
            
            // Skip summer if not including it
            if (!includeSummer && semesters[currentSemesterIndex]?.term === 'Spring/Summer') {
              currentSemesterIndex++;
            }
            
            // If we've run out of semesters, add more
            if (currentSemesterIndex >= semesters.length) {
              break;
            }
          }
          
          semesters[currentSemesterIndex].courses.push(course);
          currentSemesterCredits += course.credits;
        }
      }
    }
    
    // Set as current plan
    setCurrentPlan(newPlan);
    setPlanName(newPlan.name);
  };

  const sortCoursesByPrerequisites = (courseList: Course[]): Course[] => {
    const result: Course[] = [];
    const added = new Set<string>();
    const dependencies = new Map<string, string[]>();
    
    // Build dependency map
    for (const course of courseList) {
      dependencies.set(course.code, course.prerequisites || []);
    }
    
    // Helper function to add a course and its prerequisites
    const addCourse = (courseCode: string) => {
      // Find actual course object
      const course = courseList.find(c => c.code === courseCode);
      if (!course || added.has(courseCode)) return;
      
      // Add prerequisites first
      const prereqs = dependencies.get(courseCode) || [];
      for (const prereq of prereqs) {
        addCourse(prereq);
      }
      
      // Add this course
      result.push(course);
      added.add(courseCode);
    };
    
    // Add all courses with proper prerequisite ordering
    for (const course of courseList) {
      addCourse(course.code);
    }
    
    return result;
  };

  const handleAddCourse = (semesterId: string) => {
    setSelectedSemester(semesterId);
    setShowCourseSelector(true);
  };

  const handleRemoveCourse = (semesterId: string, courseId: string) => {
    if (!currentPlan) return;
    
    const updatedSemesters = currentPlan.semesters.map(semester => {
      if (semester.id === semesterId) {
        return {
          ...semester,
          courses: semester.courses.filter(course => course.id !== courseId),
        };
      }
      return semester;
    });
    
    const updatedPlan = {
      ...currentPlan,
      semesters: updatedSemesters,
      lastModified: new Date().toISOString(),
    };
    
    setCurrentPlan(updatedPlan);
    validatePlan(updatedPlan);
  };

  const handleSelectCourse = (course: Course) => {
    if (!currentPlan || !selectedSemester) return;
    
    const updatedSemesters = currentPlan.semesters.map(semester => {
      if (semester.id === selectedSemester) {
        // Check if course already exists in this semester
        if (semester.courses.some(c => c.id === course.id)) {
          return semester;
        }
        
        return {
          ...semester,
          courses: [...semester.courses, course],
        };
      }
      return semester;
    });
    
    const updatedPlan = {
      ...currentPlan,
      semesters: updatedSemesters,
      lastModified: new Date().toISOString(),
    };
    
    setCurrentPlan(updatedPlan);
    setShowCourseSelector(false);
    validatePlan(updatedPlan);
  };

  const handleSavePlan = () => {
    if (!currentPlan) return;
    
    const planToSave = {
      ...currentPlan,
      name: planName,
      lastModified: new Date().toISOString(),
    };
    
    savePlan(planToSave);
    setIsEditing(false);
  };

  const calculateTotalCredits = (semester: Semester) => {
    return semester.courses.reduce((total, course) => total + course.credits, 0);
  };

  const totalCredits = currentPlan?.semesters.reduce(
    (total, semester) => total + calculateTotalCredits(semester),
    0
  ) || 0;

  const totalSemesters = currentPlan?.semesters.length || 0;

  if (!student || !currentPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading your academic plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Plan Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={planName}
                onChange={e => setPlanName(e.target.value)}
                className="text-2xl font-bold w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                placeholder="Enter plan name"
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold">{currentPlan.name}</h1>
            )}
            <p className="text-gray-600">
              {currentPlan.major && student.major
                ? `${currentPlan.semesters[0]?.year || student.startYear} - ${
                    currentPlan.semesters[currentPlan.semesters.length - 1]?.year ||
                    student.startYear + 4
                  }`
                : 'No major selected'}
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            {isEditing ? (
              <button
                onClick={handleSavePlan}
                className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Details</span>
              </button>
            )}
            <button className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Plan Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Total Credits</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                {totalCredits} credits
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{
                  width: `${
                    Math.min(
                      (totalCredits / (getRequirements(student.major)?.totalCredits || 120)) * 100,
                      100
                    )
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Goal: {getRequirements(student.major)?.totalCredits || 120} credits
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Semesters</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                {totalSemesters} semesters
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">
                Estimated graduation:{' '}
                {currentPlan.semesters[currentPlan.semesters.length - 1]?.term || 'Winter'}{' '}
                {currentPlan.semesters[currentPlan.semesters.length - 1]?.year ||
                  student.startYear + 4}
              </span>
            </div>
          </div>

          <div
            className={`rounded-lg p-4 border ${
              validation.valid
                ? 'bg-green-50 border-green-100'
                : 'bg-orange-50 border-orange-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Requirements</h3>
              <span
                className={`px-2 py-1 rounded-md text-sm font-medium ${
                  validation.valid
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {validation.valid ? 'Complete' : 'Incomplete'}
              </span>
            </div>
            {!validation.valid && (
              <div className="mt-2">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-800">
                    {validation.issues.map((issue, index) => (
                      <p key={index}>{issue}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Plan */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Your Academic Plan</h2>
        <div className="space-y-6">
          {currentPlan.semesters.map((semester, semesterIndex) => (
            <div key={semester.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">
                  {semester.term} {semester.year} ({calculateTotalCredits(semester)} credits)
                </h3>
                <button
                  onClick={() => handleAddCourse(semester.id)}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Course
                </button>
              </div>
              
              <div className="p-4">
                {semester.courses.length === 0 ? (
                  <div className="py-4 text-center text-gray-500 italic">
                    No courses added yet. Click "Add Course" to get started.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                          <th className="py-2 pr-4 w-24">Code</th>
                          <th className="py-2 pr-4">Course Name</th>
                          <th className="py-2 pr-4 w-20 text-center">Credits</th>
                          <th className="py-2 w-16"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {semester.courses.map(course => (
                          <tr key={course.id} className="hover:bg-gray-50">
                            <td className="py-3 pr-4 font-medium">{course.code}</td>
                            <td className="py-3 pr-4">{course.name}</td>
                            <td className="py-3 pr-4 text-center">{course.credits}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleRemoveCourse(semester.id, course.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Remove course"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Selector Modal */}
      {showCourseSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Add Course</h2>
              <p className="text-gray-600">
                Select a course to add to{' '}
                {currentPlan.semesters.find(s => s.id === selectedSemester)?.term}{' '}
                {currentPlan.semesters.find(s => s.id === selectedSemester)?.year}
              </p>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-4">
                {/* Course categories */}
                <div>
                  <h3 className="font-medium mb-2">Required Courses</h3>
                  <div className="bg-blue-50 p-2 rounded-md">
                    <ul className="divide-y divide-blue-100">
                      {courses
                        .filter(course => 
                          getRequirements(student.major)?.requiredCourses?.includes(course.code)
                        )
                        .map(course => (
                          <li key={course.id} className="py-2">
                            <button
                              onClick={() => handleSelectCourse(course)}
                              className="w-full text-left flex items-center justify-between hover:bg-blue-100 p-2 rounded"
                            >
                              <div>
                                <div className="font-medium">{course.code}: {course.name}</div>
                                <div className="text-sm text-gray-600">{course.credits} credits</div>
                              </div>
                              <PlusCircle className="h-5 w-5 text-blue-600" />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">General Education</h3>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <ul className="divide-y divide-gray-100">
                      {courses
                        .filter(course => 
                          ['Arts', 'Letters', 'American Heritage', 'First-Year Writing', 'Religion'].includes(course.category || '')
                        )
                        .map(course => (
                          <li key={course.id} className="py-2">
                            <button
                              onClick={() => handleSelectCourse(course)}
                              className="w-full text-left flex items-center justify-between hover:bg-gray-100 p-2 rounded"
                            >
                              <div>
                                <div className="font-medium">{course.code}: {course.name}</div>
                                <div className="text-sm text-gray-600">
                                  {course.credits} credits | {course.category}
                                </div>
                              </div>
                              <PlusCircle className="h-5 w-5 text-blue-600" />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Electives</h3>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <ul className="divide-y divide-gray-100">
                      {courses
                        .filter(course => 
                          !getRequirements(student.major)?.requiredCourses?.includes(course.code) &&
                          !['Arts', 'Letters', 'American Heritage', 'First-Year Writing', 'Religion'].includes(course.category || '')
                        )
                        .slice(0, 5) // Just showing a few for demo
                        .map(course => (
                          <li key={course.id} className="py-2">
                            <button
                              onClick={() => handleSelectCourse(course)}
                              className="w-full text-left flex items-center justify-between hover:bg-gray-100 p-2 rounded"
                            >
                              <div>
                                <div className="font-medium">{course.code}: {course.name}</div>
                                <div className="text-sm text-gray-600">
                                  {course.credits} credits | {course.category}
                                </div>
                              </div>
                              <PlusCircle className="h-5 w-5 text-blue-600" />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowCourseSelector(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerPage;