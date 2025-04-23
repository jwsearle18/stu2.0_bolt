import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, User, LayoutGrid } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { student } = useApp();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#002E5D] text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">BYU Academic Planner</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors duration-200 hover:text-blue-200 ${
                location.pathname === '/' ? 'text-blue-200' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/planner"
              className={`transition-colors duration-200 hover:text-blue-200 ${
                location.pathname.includes('/planner') ? 'text-blue-200' : ''
              }`}
            >
              My Plan
            </Link>
            <div className="relative group">
              <button className="flex items-center space-x-1 transition-colors duration-200 hover:text-blue-200">
                <span>Resources</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">
                  Major Requirements
                </a>
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">
                  Course Catalog
                </a>
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">
                  Academic Calendar
                </a>
              </div>
            </div>
            {student ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
            ) : (
              <Link
                to="/onboarding"
                className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Get Started
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="px-4 py-2 hover:bg-blue-700 rounded-md"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/planner"
                className="px-4 py-2 hover:bg-blue-700 rounded-md"
                onClick={toggleMenu}
              >
                My Plan
              </Link>
              <div className="px-4 py-2">
                <button className="flex items-center justify-between w-full">
                  <span>Resources</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="pl-4 mt-2 space-y-2">
                  <a href="#" className="block py-1 hover:text-blue-200">
                    Major Requirements
                  </a>
                  <a href="#" className="block py-1 hover:text-blue-200">
                    Course Catalog
                  </a>
                  <a href="#" className="block py-1 hover:text-blue-200">
                    Academic Calendar
                  </a>
                </div>
              </div>
              {student ? (
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-700 rounded-md"
                  onClick={toggleMenu}
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              ) : (
                <Link
                  to="/onboarding"
                  className="px-4 py-2 bg-blue-700 rounded-md"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;