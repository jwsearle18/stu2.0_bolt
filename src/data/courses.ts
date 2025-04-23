import { Course } from '../types';

export const courses: Course[] = [
  // Computer Science courses
  {
    id: 'cs142',
    code: 'CS 142',
    name: 'Introduction to Computer Programming',
    credits: 3,
    description: 'Basic concepts of computer programming using Java.',
    termsOffered: ['Fall', 'Winter', 'Spring'],
    category: 'Computer Science'
  },
  {
    id: 'cs235',
    code: 'CS 235',
    name: 'Data Structures',
    credits: 3,
    prerequisites: ['CS 142'],
    description: 'Abstract data structures, algorithm analysis, and big-O notation.',
    termsOffered: ['Fall', 'Winter'],
    category: 'Computer Science'
  },
  {
    id: 'cs224',
    code: 'CS 224',
    name: 'Computer Systems',
    credits: 3,
    prerequisites: ['CS 142'],
    description: 'Computer organization, hardware-software interface, memory architecture.',
    termsOffered: ['Fall', 'Winter'],
    category: 'Computer Science'
  },
  {
    id: 'cs240',
    code: 'CS 240',
    name: 'Advanced Programming Concepts',
    credits: 4,
    prerequisites: ['CS 235'],
    description: 'Advanced programming concepts using C++.',
    termsOffered: ['Fall', 'Winter'],
    category: 'Computer Science'
  },
  {
    id: 'cs252',
    code: 'CS 252',
    name: 'Introduction to Computational Theory',
    credits: 3,
    prerequisites: ['CS 235'],
    description: 'Grammars, finite automata, Turing machines, complexity.',
    termsOffered: ['Fall', 'Winter'],
    category: 'Computer Science'
  },
  
  // Math courses
  {
    id: 'math112',
    code: 'MATH 112',
    name: 'Calculus 1',
    credits: 4,
    description: 'Differential and integral calculus, applications.',
    termsOffered: ['Fall', 'Winter', 'Spring', 'Summer'],
    category: 'Mathematics'
  },
  {
    id: 'math113',
    code: 'MATH 113',
    name: 'Calculus 2',
    credits: 4,
    prerequisites: ['MATH 112'],
    description: 'Techniques and applications of integration, sequences and series.',
    termsOffered: ['Fall', 'Winter', 'Spring', 'Summer'],
    category: 'Mathematics'
  },
  {
    id: 'math290',
    code: 'MATH 290',
    name: 'Fundamentals of Mathematics',
    credits: 3,
    prerequisites: ['MATH 113'],
    description: 'Logic, proof techniques, set theory, functions, relations.',
    termsOffered: ['Fall', 'Winter'],
    category: 'Mathematics'
  },
  {
    id: 'stat121',
    code: 'STAT 121',
    name: 'Principles of Statistics',
    credits: 3,
    description: 'Data collection, graphical methods, descriptive statistics, probability.',
    termsOffered: ['Fall', 'Winter', 'Spring', 'Summer'],
    category: 'Statistics'
  },
  
  // General Education courses
  {
    id: 'wrtg150',
    code: 'WRTG 150',
    name: 'Writing and Rhetoric',
    credits: 3,
    description: 'First-year writing course focused on academic writing skills.',
    termsOffered: ['Fall', 'Winter', 'Spring', 'Summer'],
    category: 'First-Year Writing'
  },
  {
    id: 'rel121',
    code: 'REL A 121',
    name: 'The Book of Mormon',
    credits: 2,
    description: 'Study of the Book of Mormon text and its teachings.',
    termsOffered: ['Fall', 'Winter', 'Spring', 'Summer'],
    category: 'Religion'
  },
  {
    id: 'rel122',
    code: 'REL A 122',
    name: 'The Book of Mormon',
    credits: 2,
    description: 'Continued study of the Book of Mormon.',
    termsOffered: ['Fall', 'Winter', 'Spring', 'Summer'],
    category: 'Religion'
  },
  {
    id: 'amhrt100',
    code: 'HIST 100',
    name: 'American Heritage',
    credits: 3,
    description: 'The founding and development of the American nation.',
    termsOffered: ['Fall', 'Winter', 'Spring'],
    category: 'American Heritage'
  },
  {
    id: 'arts101',
    code: 'ARTS 101',
    name: 'Introduction to Visual Arts',
    credits: 3,
    description: 'Overview of visual arts traditions and contemporary practices.',
    termsOffered: ['Fall', 'Winter', 'Spring'],
    category: 'Arts'
  },
  
  // Business courses
  {
    id: 'acc200',
    code: 'ACC 200',
    name: 'Principles of Accounting',
    credits: 3,
    description: 'Introduction to accounting concepts and principles.',
    termsOffered: ['Fall', 'Winter', 'Spring'],
    category: 'Business'
  },
  {
    id: 'busm201',
    code: 'BUS M 201',
    name: 'Financial Management',
    credits: 3,
    description: 'Time value of money, capital budgeting, and financial decisions.',
    termsOffered: ['Fall', 'Winter'],
    category: 'Business'
  },
  {
    id: 'econ110',
    code: 'ECON 110',
    name: 'Economic Principles and Problems',
    credits: 3,
    description: 'Introduction to microeconomics and macroeconomics.',
    termsOffered: ['Fall', 'Winter', 'Spring', 'Summer'],
    category: 'Economics'
  }
];

// Helper function to get courses by category
export const getCoursesByCategory = (category: string): Course[] => {
  return courses.filter(course => course.category === category);
};

// Helper function to get courses by major requirement
export const getCoursesByMajorRequirement = (majorId: string, requirementCategory: string): Course[] => {
  // Implementation would depend on how requirements are structured
  return courses.filter(course => {
    // This is a simplified implementation
    if (majorId === 'cs' && requirementCategory === 'Core Computer Science') {
      return course.code.startsWith('CS');
    }
    if (majorId === 'cs' && requirementCategory === 'Core Mathematics') {
      return course.code.startsWith('MATH') || course.code.startsWith('STAT');
    }
    return false;
  });
};