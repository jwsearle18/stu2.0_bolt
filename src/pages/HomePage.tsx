import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ClipboardCheck, GraduationCap, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const HomePage: React.FC = () => {
  const { student, savedPlans } = useApp();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#002E5D] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Chart Your Path to Graduation at BYU
            </h1>
            <p className="text-xl mb-8">
              Create a personalized 4-year academic plan that meets your major requirements and
              aligns with your career goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {student ? (
                <>
                  <Link
                    to="/planner"
                    className="bg-white text-[#002E5D] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>View My Plan</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/onboarding"
                    className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors duration-200"
                  >
                    Create New Plan
                  </Link>
                </>
              ) : (
                <Link
                  to="/onboarding"
                  className="bg-white text-[#002E5D] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Build Your BYU Academic Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="h-8 w-8 text-[#002E5D]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Major-Specific Requirements</h3>
              <p className="text-gray-600">
                Automatically includes all required courses for your specific BYU major.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-8 w-8 text-[#002E5D]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable Schedule</h3>
              <p className="text-gray-600">
                Drag and drop courses to create the perfect schedule based on your preferences.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <ClipboardCheck className="h-8 w-8 text-[#002E5D]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Validation</h3>
              <p className="text-gray-600">
                Instantly verify that your plan meets all graduation requirements.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <GraduationCap className="h-8 w-8 text-[#002E5D]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Academic Progress Tracking</h3>
              <p className="text-gray-600">
                Track your progress as you complete courses and move towards graduation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                    <p className="text-gray-600">
                      Tell us about your academic background, major, and preferences to get started.
                    </p>
                  </div>
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-[#002E5D] text-white rounded-full text-xl font-bold">
                    1
                  </div>
                  <div className="md:w-1/2 md:pl-12 md:text-left hidden md:block">
                    {/* Image/illustration could go here */}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right hidden md:block">
                    {/* Image/illustration could go here */}
                  </div>
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-[#002E5D] text-white rounded-full text-xl font-bold">
                    2
                  </div>
                  <div className="md:w-1/2 md:pl-12 md:text-left mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold mb-2">Generate Your Plan</h3>
                    <p className="text-gray-600">
                      Our system creates a personalized academic plan based on your major requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold mb-2">Customize Your Schedule</h3>
                    <p className="text-gray-600">
                      Adjust your plan to fit your preferences while ensuring you meet all requirements.
                    </p>
                  </div>
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-[#002E5D] text-white rounded-full text-xl font-bold">
                    3
                  </div>
                  <div className="md:w-1/2 md:pl-12 md:text-left hidden md:block">
                    {/* Image/illustration could go here */}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right hidden md:block">
                    {/* Image/illustration could go here */}
                  </div>
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-[#002E5D] text-white rounded-full text-xl font-bold">
                    4
                  </div>
                  <div className="md:w-1/2 md:pl-12 md:text-left">
                    <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                    <p className="text-gray-600">
                      Update your plan as you complete courses and stay on track to graduate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/onboarding"
              className="bg-[#002E5D] text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>Start Planning Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials/Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Students Love Our Planner</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <p className="text-gray-700 italic mb-4">
                "This planner helped me organize my entire college journey. I can see exactly what I need to take and when, which has reduced my stress about graduating on time."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#002E5D] rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Sarah J.</p>
                  <p className="text-sm text-gray-500">Computer Science Major</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <p className="text-gray-700 italic mb-4">
                "I was able to plan my entire degree with all my electives and general education courses. The validation feature ensures I'm on track to graduate."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#002E5D] rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Michael T.</p>
                  <p className="text-sm text-gray-500">Business Management Major</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <p className="text-gray-700 italic mb-4">
                "As a transfer student, I was worried about meeting all the requirements. This planner accounted for my previous credits and showed me exactly what I still needed."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#002E5D] rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Emma L.</p>
                  <p className="text-sm text-gray-500">Biology Major</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-[#002E5D] mb-2">98%</p>
              <p className="text-gray-600">Graduation Rate</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-[#002E5D] mb-2">56+</p>
              <p className="text-gray-600">Majors Supported</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-[#002E5D] mb-2">4500+</p>
              <p className="text-gray-600">Students Using Our Planner</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-[#002E5D] mb-2">3.2</p>
              <p className="text-gray-600">Semesters Saved on Average</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#002E5D] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Map Your Academic Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of BYU students who have streamlined their path to graduation with our academic planner.
          </p>
          <Link
            to="/onboarding"
            className="bg-white text-[#002E5D] px-8 py-4 rounded-md font-medium text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>Create Your Plan Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;