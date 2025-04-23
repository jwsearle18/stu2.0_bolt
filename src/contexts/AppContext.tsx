import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, AcademicPlan, Course, Major } from '../types';
import { majors } from '../data/majors';

interface AppContextType {
  student: Student | null;
  setStudent: (student: Student) => void;
  currentPlan: AcademicPlan | null;
  setCurrentPlan: (plan: AcademicPlan | null) => void;
  savedPlans: AcademicPlan[];
  savePlan: (plan: AcademicPlan) => void;
  deletePlan: (planId: string) => void;
  availableMajors: Major[];
  getRequirements: (majorId: string) => any;
  validatePlan: (plan: AcademicPlan) => { valid: boolean; issues: string[] };
}

const defaultContext: AppContextType = {
  student: null,
  setStudent: () => {},
  currentPlan: null,
  setCurrentPlan: () => {},
  savedPlans: [],
  savePlan: () => {},
  deletePlan: () => {},
  availableMajors: majors,
  getRequirements: () => ({}),
  validatePlan: () => ({ valid: false, issues: [] }),
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [currentPlan, setCurrentPlan] = useState<AcademicPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<AcademicPlan[]>([]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedStudentData = localStorage.getItem('student');
    if (savedStudentData) {
      setStudent(JSON.parse(savedStudentData));
    }

    const savedPlansData = localStorage.getItem('savedPlans');
    if (savedPlansData) {
      setSavedPlans(JSON.parse(savedPlansData));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (student) {
      localStorage.setItem('student', JSON.stringify(student));
    }
  }, [student]);

  useEffect(() => {
    localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  const savePlan = (plan: AcademicPlan) => {
    const planToSave = { ...plan, lastModified: new Date().toISOString() };
    
    setSavedPlans(prev => {
      // Check if plan already exists (update) or is new (add)
      const existingPlanIndex = prev.findIndex(p => p.id === plan.id);
      
      if (existingPlanIndex >= 0) {
        const updatedPlans = [...prev];
        updatedPlans[existingPlanIndex] = planToSave;
        return updatedPlans;
      } else {
        return [...prev, planToSave];
      }
    });
    
    setCurrentPlan(planToSave);
  };

  const deletePlan = (planId: string) => {
    setSavedPlans(prev => prev.filter(p => p.id !== planId));
    
    if (currentPlan?.id === planId) {
      setCurrentPlan(null);
    }
  };

  const getRequirements = (majorId: string) => {
    const major = majors.find(m => m.id === majorId);
    return major?.requirements || {};
  };

  const validatePlan = (plan: AcademicPlan) => {
    const issues: string[] = [];
    
    if (!plan.major) {
      issues.push('No major selected');
      return { valid: false, issues };
    }
    
    const requirements = getRequirements(plan.major);
    // Basic validation - real implementation would be more complex
    const totalCredits = plan.semesters.reduce((total, semester) => {
      return total + semester.courses.reduce((sem, course) => sem + course.credits, 0);
    }, 0);

    if (totalCredits < requirements.totalCredits) {
      issues.push(`Plan has ${totalCredits} credits but requires ${requirements.totalCredits}`);
    }
    
    // Check for required courses
    const allCourses = plan.semesters.flatMap(s => s.courses);
    const requiredCoursesMissing = requirements.requiredCourses?.filter(
      reqCourse => !allCourses.some(c => c.code === reqCourse)
    );
    
    if (requiredCoursesMissing?.length > 0) {
      issues.push(`Missing required courses: ${requiredCoursesMissing.join(', ')}`);
    }
    
    return { 
      valid: issues.length === 0,
      issues 
    };
  };

  const value = {
    student,
    setStudent,
    currentPlan,
    setCurrentPlan,
    savedPlans,
    savePlan,
    deletePlan,
    availableMajors: majors,
    getRequirements,
    validatePlan,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};