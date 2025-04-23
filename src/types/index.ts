export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  minor?: string;
  startYear: number;
  hasTransferCredits: boolean;
  completedCourses: Course[];
  preferences: StudentPreferences;
  careerGoals?: string;
  interests?: string[];
}

export interface StudentPreferences {
  maxCreditsPerSemester: number;
  includeSummer: boolean;
  targetGraduationDate?: string;
  preferredDaysOfWeek?: string[];
  preferredTimeOfDay?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  prerequisites?: string[];
  corequisites?: string[];
  description?: string;
  termsOffered?: string[];
  category?: string;
  topics?: string[];
  careerRelevance?: string[];
}

export interface Semester {
  id: string;
  term: string;
  year: number;
  courses: Course[];
}

export interface AcademicPlan {
  id: string;
  name: string;
  student: string;
  major: string;
  minor?: string;
  semesters: Semester[];
  created: string;
  lastModified: string;
  notes?: string;
  isComplete: boolean;
  aiRecommendations?: {
    suggestedElectives: Course[];
    reasoning: string;
  };
}

export interface Major {
  id: string;
  name: string;
  college: string;
  department: string;
  requirements: {
    totalCredits: number;
    generalEducation: GeneralEducationRequirement[];
    majorRequirements: MajorRequirement[];
    requiredCourses: string[];
  };
}

export interface GeneralEducationRequirement {
  category: string;
  credits: number;
  options?: string[];
}

export interface MajorRequirement {
  category: string;
  credits: number;
  options?: string[];
  requiredCourses?: string[];
}

export interface CourseRecommendation {
  course: Course;
  relevanceScore: number;
  reasoning: string;
}