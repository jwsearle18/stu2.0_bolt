import OpenAI from 'openai';
import { Student, Course, CourseRecommendation } from '../types';
import { courses } from '../data/courses';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateCourseRecommendations(
  student: Student,
  availableCourses: Course[]
): Promise<CourseRecommendation[]> {
  try {
    const prompt = `
      As an academic advisor, recommend elective courses for a student with the following profile:
      - Major: ${student.major}
      - Career Goals: ${student.careerGoals}
      - Interests: ${student.interests?.join(', ')}

      Available courses:
      ${availableCourses.map(course => 
        `- ${course.code}: ${course.name}
         Description: ${course.description}
         Topics: ${course.topics?.join(', ')}
         Career Relevance: ${course.careerRelevance?.join(', ')}`
      ).join('\n')}

      Provide recommendations in the following format for each course:
      1. Course code
      2. Relevance score (1-100)
      3. Brief explanation of why this course aligns with the student's goals and interests
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    
    // Parse the response and convert it to CourseRecommendation objects
    const recommendations: CourseRecommendation[] = [];
    const lines = response.split('\n');
    let currentCourse: Partial<CourseRecommendation> = {};

    for (const line of lines) {
      if (line.match(/^[A-Z]{2,4}\s\d{3}/)) {
        // New course recommendation
        if (currentCourse.course) {
          recommendations.push(currentCourse as CourseRecommendation);
        }
        currentCourse = {
          course: courses.find(c => c.code === line.trim()),
          relevanceScore: 0,
          reasoning: ''
        };
      } else if (line.match(/^\d{1,3}$/)) {
        currentCourse.relevanceScore = parseInt(line);
      } else if (line.trim().length > 0) {
        currentCourse.reasoning = line.trim();
      }
    }

    // Add the last course
    if (currentCourse.course) {
      recommendations.push(currentCourse as CourseRecommendation);
    }

    return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
  } catch (error) {
    console.error('Error generating course recommendations:', error);
    return [];
  }
}

export async function analyzePlanFeasibility(
  student: Student,
  recommendedCourses: Course[]
): Promise<string> {
  try {
    const prompt = `
      Analyze the feasibility of this academic plan for a student with the following profile:
      - Major: ${student.major}
      - Career Goals: ${student.careerGoals}
      - Max Credits per Semester: ${student.preferences.maxCreditsPerSemester}
      - Including Summer Terms: ${student.preferences.includeSummer}

      Recommended Courses:
      ${recommendedCourses.map(course => 
        `- ${course.code}: ${course.name} (${course.credits} credits)
         Prerequisites: ${course.prerequisites?.join(', ') || 'None'}`
      ).join('\n')}

      Provide a brief analysis of:
      1. Course load balance
      2. Prerequisite sequence
      3. Alignment with career goals
      4. Potential challenges
      5. Suggestions for improvement
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error analyzing plan feasibility:', error);
    return 'Unable to analyze plan feasibility at this time.';
  }
}