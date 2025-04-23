import { Major } from '../types';

export const majors: Major[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    college: 'Physical and Mathematical Sciences',
    department: 'Computer Science',
    requirements: {
      totalCredits: 120,
      generalEducation: [
        { category: 'First-Year Writing', credits: 3 },
        { category: 'Advanced Written and Oral Communication', credits: 3 },
        { category: 'Citizenship', credits: 3 },
        { category: 'Arts', credits: 3 },
        { category: 'Letters', credits: 3 },
        { category: 'American Heritage', credits: 3 },
        { category: 'Global and Cultural Awareness', credits: 3 },
        { category: 'Religion', credits: 14 }
      ],
      majorRequirements: [
        { 
          category: 'Core Computer Science', 
          credits: 47,
          requiredCourses: [
            'CS 142', 'CS 235', 'CS 224', 'CS 240', 'CS 252', 
            'CS 312', 'CS 324', 'CS 340', 'CS 404', 'CS 452'
          ] 
        },
        { 
          category: 'Core Mathematics', 
          credits: 18,
          requiredCourses: [
            'MATH 112', 'MATH 113', 'MATH 290', 'STAT 121'
          ] 
        },
        { 
          category: 'Technical Electives', 
          credits: 15,
          options: [
            'CS 356', 'CS 401R', 'CS 412', 'CS 428', 'CS 431', 
            'CS 432', 'CS 450', 'CS 455', 'CS 456', 'CS 460', 
            'CS 462', 'CS 465', 'CS 470', 'CS 478', 'CS 486', 
            'CS 493R'
          ] 
        }
      ],
      requiredCourses: [
        'CS 142', 'CS 235', 'CS 224', 'CS 240', 'CS 252', 
        'CS 312', 'CS 324', 'CS 340', 'CS 404', 'CS 452',
        'MATH 112', 'MATH 113', 'MATH 290', 'STAT 121'
      ]
    }
  },
  {
    id: 'business-mgmt',
    name: 'Business Management',
    college: 'Marriott School of Business',
    department: 'Management',
    requirements: {
      totalCredits: 120,
      generalEducation: [
        { category: 'First-Year Writing', credits: 3 },
        { category: 'Advanced Written and Oral Communication', credits: 3 },
        { category: 'Citizenship', credits: 3 },
        { category: 'Arts', credits: 3 },
        { category: 'Letters', credits: 3 },
        { category: 'American Heritage', credits: 3 },
        { category: 'Global and Cultural Awareness', credits: 3 },
        { category: 'Religion', credits: 14 }
      ],
      majorRequirements: [
        { 
          category: 'Business Core', 
          credits: 37,
          requiredCourses: [
            'ACC 200', 'FIN 201', 'MKTG 201', 'IS 201', 
            'MSB 180', 'MSB 390', 'MSB 430', 'ECON 110' 
          ] 
        },
        { 
          category: 'Management Core', 
          credits: 24,
          requiredCourses: [
            'BUS M 201', 'BUS M 241', 'BUS M 361', 'BUS M 390'
          ] 
        },
        { 
          category: 'Management Electives', 
          credits: 15,
          options: [
            'BUS M 411', 'BUS M 430', 'BUS M 450', 'BUS M 454', 
            'BUS M 462', 'BUS M 489'
          ] 
        }
      ],
      requiredCourses: [
        'ACC 200', 'FIN 201', 'MKTG 201', 'IS 201', 
        'MSB 180', 'MSB 390', 'MSB 430', 'ECON 110',
        'BUS M 201', 'BUS M 241', 'BUS M 361', 'BUS M 390'
      ]
    }
  },
  {
    id: 'biology',
    name: 'Biology',
    college: 'Life Sciences',
    department: 'Biology',
    requirements: {
      totalCredits: 120,
      generalEducation: [
        { category: 'First-Year Writing', credits: 3 },
        { category: 'Advanced Written and Oral Communication', credits: 3 },
        { category: 'Citizenship', credits: 3 },
        { category: 'Arts', credits: 3 },
        { category: 'Letters', credits: 3 },
        { category: 'American Heritage', credits: 3 },
        { category: 'Global and Cultural Awareness', credits: 3 },
        { category: 'Religion', credits: 14 }
      ],
      majorRequirements: [
        { 
          category: 'Biology Core', 
          credits: 29,
          requiredCourses: [
            'BIO 130', 'BIO 230', 'BIO 350', 'BIO 420', 'BIO 460'
          ] 
        },
        { 
          category: 'Chemistry & Physics', 
          credits: 20,
          requiredCourses: [
            'CHEM 105', 'CHEM 106', 'CHEM 351', 'CHEM 352', 'PHYS 105'
          ] 
        },
        { 
          category: 'Biology Electives', 
          credits: 18,
          options: [
            'BIO 339', 'BIO 365', 'BIO 441', 'BIO 463', 'BIO 465', 
            'BIO 470', 'BIO 475', 'BIO 494R'
          ] 
        }
      ],
      requiredCourses: [
        'BIO 130', 'BIO 230', 'BIO 350', 'BIO 420', 'BIO 460',
        'CHEM 105', 'CHEM 106', 'CHEM 351', 'CHEM 352', 'PHYS 105'
      ]
    }
  }
];