import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronLeft, ChevronRight, Upload, User, BookOpen, Calendar, Briefcase, Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Major, StudentPreferences, Student } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { generateCourseRecommendations } from '../services/openai';
import { courses } from '../data/courses';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setStudent, availableMajors } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    email: '',
    major: '',
    startYear: new Date().getFullYear(),
    hasTransferCredits: false,
    completedCourses: [],
    preferences: {
      maxCreditsPerSemester: 15,
      includeSummer: false,
    },
    careerGoals: '',
    interests: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [interestInput, setInterestInput] = useState('');

  const totalSteps = 5;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: checked,
          },
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value,
          },
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && formData.interests) {
      setFormData(prev => ({
        ...prev,
        interests: [...(prev.interests || []), interestInput.trim()],
      }));
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.filter(i => i !== interest),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const newStudent: Student = {
        id: uuidv4(),
        name: formData.name || 'Student',
        email: formData.email || '',
        major: formData.major || '',
        startYear: formData.startYear || new Date().getFullYear(),
        hasTransferCredits: formData.hasTransferCredits || false,
        completedCourses: formData.completedCourses || [],
        preferences: formData.preferences as StudentPreferences,
        careerGoals: formData.careerGoals,
        interests: formData.interests || [],
      };

      if (formData.minor) {
        newStudent.minor = formData.minor;
      }

      // Get AI course recommendations
      const recommendations = await generateCourseRecommendations(
        newStudent,
        courses.filter(course => !course.code.startsWith('REL'))
      );

      // Add recommendations to student data
      newStudent.aiRecommendations = {
        suggestedElectives: recommendations.map(rec => rec.course),
        reasoning: recommendations.map(rec => rec.reasoning).join('\n'),
      };

      setStudent(newStudent);
      navigate('/planner');
    } catch (error) {
      console.error('Error during plan generation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <p className="text-gray-600">
              Let's start with some basic information to personalize your academic plan.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 mb-1">
                  When did you start (or plan to start) at BYU?
                </label>
                <select
                  id="startYear"
                  name="startYear"
                  value={formData.startYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Academic Background</h2>
            <p className="text-gray-600">
              Tell us about your major and any previous academic experience.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Your Major
                </label>
                <select
                  id="major"
                  name="major"
                  value={formData.major || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select a major
                  </option>
                  {availableMajors.map(major => (
                    <option key={major.id} value={major.id}>
                      {major.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="minor" className="block text-sm font-medium text-gray-700 mb-1">
                  Minor (Optional)
                </label>
                <select
                  id="minor"
                  name="minor"
                  value={formData.minor || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No Minor</option>
                  {availableMajors.map(major => (
                    <option key={major.id} value={major.id}>
                      {major.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasTransferCredits"
                  name="hasTransferCredits"
                  checked={formData.hasTransferCredits || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hasTransferCredits" className="ml-2 block text-sm text-gray-700">
                  I have transfer credits or previous college experience
                </label>
              </div>
              
              {formData.hasTransferCredits && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Upload Your Transcript</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your unofficial transcript so we can accurately account for completed courses.
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag and drop your transcript file here, or
                      <button className="text-blue-600 hover:text-blue-500 font-medium ml-1">
                        browse
                      </button>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Supported formats: PDF, JPG, PNG (Max: 10MB)
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Note: This is a demo app. File upload functionality is simulated.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Preferences & Goals</h2>
            <p className="text-gray-600">
              Let us know your preferences to customize your academic plan.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="preferences.maxCreditsPerSemester" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Credits per Semester
                </label>
                <select
                  id="preferences.maxCreditsPerSemester"
                  name="preferences.maxCreditsPerSemester"
                  value={formData.preferences?.maxCreditsPerSemester || 15}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 8 }, (_, i) => 12 + i).map(credits => (
                    <option key={credits} value={credits}>
                      {credits} credits
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  The typical full-time load is 12-18 credits per semester.
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preferences.includeSummer"
                  name="preferences.includeSummer"
                  checked={formData.preferences?.includeSummer || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="preferences.includeSummer" className="ml-2 block text-sm text-gray-700">
                  Include summer terms in my academic plan
                </label>
              </div>
              
              <div>
                <label htmlFor="preferences.targetGraduationDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Graduation Date (Optional)
                </label>
                <select
                  id="preferences.targetGraduationDate"
                  name="preferences.targetGraduationDate"
                  value={formData.preferences?.targetGraduationDate || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No specific date</option>
                  {['Winter', 'Spring', 'Summer', 'Fall'].map(term => (
                    Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={`${term}-${year}`} value={`${term} ${year}`}>
                        {term} {year}
                      </option>
                    ))
                  )).flat()}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Days of Week (Optional)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        name={`preferences.preferredDaysOfWeek`}
                        value={day}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-700">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="preferences.preferredTimeOfDay" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time of Day (Optional)
                </label>
                <select
                  id="preferences.preferredTimeOfDay"
                  name="preferences.preferredTimeOfDay"
                  value={formData.preferences?.preferredTimeOfDay || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No preference</option>
                  <option value="morning">Morning (8am-12pm)</option>
                  <option value="afternoon">Afternoon (12pm-4pm)</option>
                  <option value="evening">Evening (4pm-8pm)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Career Goals & Interests</h2>
            <p className="text-gray-600">
              Tell us about your career aspirations and interests to help us recommend relevant courses.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-700 mb-1">
                  Career Goals
                </label>
                <textarea
                  id="careerGoals"
                  name="careerGoals"
                  value={formData.careerGoals || ''}
                  onChange={handleChange}
                  placeholder="Describe your career goals and aspirations..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests & Focus Areas
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder="Add an interest..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests?.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Your Information</h2>
            <p className="text-gray-600">
              Please review all the information you've provided before we generate your personalized academic plan.
            </p>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Personal Information</h3>
                </div>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.name || 'Not provided'}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.email || 'Not provided'}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Start Year</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.startYear}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Academic Background</h3>
                </div>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Major</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {availableMajors.find(m => m.id === formData.major)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Minor</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.minor ? availableMajors.find(m => m.id === formData.minor)?.name : 'None'}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Transfer Credits</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.hasTransferCredits ? 'Yes' : 'No'}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Preferences & Goals</h3>
                </div>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Credits per Semester</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.preferences?.maxCreditsPerSemester || 15} credits
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Include Summer Terms</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.preferences?.includeSummer ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Target Graduation</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.preferences?.targetGraduationDate || 'No specific date'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Preferred Time of Day</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.preferences?.preferredTimeOfDay ? 
                        formData.preferences.preferredTimeOfDay.charAt(0).toUpperCase() + 
                        formData.preferences.preferredTimeOfDay.slice(1) : 
                        'No preference'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Career Goals & Interests</h3>
                </div>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Career Goals</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.careerGoals || 'Not specified'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Interests</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.interests?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        'No interests specified'
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Progress bar */}
          <div className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold text-gray-800">Create Your Academic Plan</h1>
              <span className="text-sm text-gray-600">
                Step {step} of {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step content */}
          <div className="p-6">{renderStep()}</div>

          {/* Navigation buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`px-4 py-2 rounded-md flex items-center ${
                step === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="px-4 py-2 bg-[#002E5D] text-white rounded-md hover:bg-blue-800 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Generating Plan...</span>
              ) : step === totalSteps ? (
                <>
                  <span>Create Plan</span>
                  <CheckCircle className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;