import React from 'react';
import { BookOpen, Facebook, Twitter, Instagram, Github as GitHub } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-700 pt-12 pb-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-[#002E5D]" />
              <span className="text-lg font-bold text-[#002E5D]">BYU Academic Planner</span>
            </div>
            <p className="text-sm">
              Create your personalized 4-year academic plan tailored to your BYU major requirements
              and preferences.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#002E5D] mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#002E5D] transition-colors duration-200">
                  Major Requirements
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#002E5D] transition-colors duration-200">
                  Course Catalog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#002E5D] transition-colors duration-200">
                  Academic Calendar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#002E5D] transition-colors duration-200">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#002E5D] mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#002E5D] transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#002E5D] transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#002E5D] transition-colors duration-200">
                  Feedback
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#002E5D] transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#002E5D] mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-[#002E5D] transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-[#002E5D] transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-[#002E5D] transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-[#002E5D] transition-colors duration-200"
                aria-label="GitHub"
              >
                <GitHub className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm">
              Sign up for our newsletter to get the latest updates about new features and resources.
            </p>
            <div className="mt-2">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-white text-gray-800 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002E5D] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-[#002E5D] text-white px-4 py-2 rounded-r-md hover:bg-blue-800 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-center">
          <p>© {currentYear} BYU Academic Planner. All rights reserved.</p>
          <p className="mt-1">This is a demonstration project and is not affiliated with Brigham Young University.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;