import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, LogOut, FileText, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { student, setStudent, savedPlans, setCurrentPlan, deletePlan, availableMajors } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  if (!student) {
    navigate('/onboarding');
    return null;
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      if (editedStudent) {
        setStudent(editedStudent);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (!editedStudent) return;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setEditedStudent({
          ...editedStudent,
          [parent]: {
            ...editedStudent[parent as keyof typeof editedStudent],
            [child]: checked,
          },
        });
      } else {
        setEditedStudent({
          ...editedStudent,
          [name]: checked,
        });
      }
    } else {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setEditedStudent({
          ...editedStudent,
          [parent]: {
            ...editedStudent[parent as keyof typeof editedStudent],
            [child]: value,
          },
        });
      } else {
        setEditedStudent({
          ...editedStudent,
          [name]: value,
        });
      }
    }
  };

  const handleLogout = () => {
    // In a real app, this would clear authentication
    localStorage.removeItem('student');
    localStorage.removeItem('savedPlans');
    setStudent(null);
    setCurrentPlan(null);
    navigate('/');
  };

  const confirmDeletePlan = (planId: string) => {
    setPlanToDelete(planId);
    setShowDeleteConfirm(true);
  };

  const handleDeletePlan = () => {
    if (planToDelete) {
      deletePlan(planToDelete);
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
    }
  };

  const handleOpenPlan = (planId: string) => {
    const plan = savedPlans.find(p => p.id === planId);
    if (plan) {
      setCurrentPlan(plan);
      navigate('/planner');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#002E5D] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-medium text-white">Profile Information</h2>
                <User className="h-5 w-5 text-white" />
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editedStudent?.name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                        value={editedStudent?.email || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                        Major
                      </label>
                      <select
                        id="major"
                        name="major"
                        value={editedStudent?.major || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        {availableMajors.map(major => (
                          <option key={major.id} value={major.id}>
                            {major.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Year
                      </label>
                      <select
                        id="startYear"
                        name="startYear"
                        value={editedStudent?.startYear || new Date().getFullYear()}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i).map(
                          year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Preferences</h3>
                      
                      <div className="pl-2 space-y-3">
                        <div>
                          <label htmlFor="preferences.maxCreditsPerSemester" className="block text-sm text-gray-700 mb-1">
                            Max Credits Per Semester
                          </label>
                          <select
                            id="preferences.maxCreditsPerSemester"
                            name="preferences.maxCreditsPerSemester"
                            value={editedStudent?.preferences?.maxCreditsPerSemester || 15}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            {Array.from({ length: 8 }, (_, i) => 12 + i).map(credits => (
                              <option key={credits} value={credits}>
                                {credits} credits
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="preferences.includeSummer"
                            name="preferences.includeSummer"
                            checked={editedStudent?.preferences?.includeSummer || false}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="preferences.includeSummer" className="ml-2 block text-sm text-gray-700">
                            Include summer terms
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Name</h3>
                      <p className="mt-1">{student.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1">{student.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Major</h3>
                      <p className="mt-1">
                        {availableMajors.find(m => m.id === student.major)?.name || 'Not selected'}
                      </p>
                    </div>
                    
                    {student.minor && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Minor</h3>
                        <p className="mt-1">
                          {availableMajors.find(m => m.id === student.minor)?.name || 'None'}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Started at BYU</h3>
                      <p className="mt-1">{student.startYear}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Preferences</h3>
                      <ul className="mt-1 space-y-1 text-sm">
                        <li>
                          Max {student.preferences.maxCreditsPerSemester} credits per semester
                        </li>
                        <li>
                          {student.preferences.includeSummer
                            ? 'Including summer terms'
                            : 'Excluding summer terms'}
                        </li>
                        {student.preferences.targetGraduationDate && (
                          <li>Target graduation: {student.preferences.targetGraduationDate}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handleEditToggle}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md ${
                      isEditing
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    ) : (
                      <>
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Saved Plans */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#002E5D] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-medium text-white">My Academic Plans</h2>
                <FileText className="h-5 w-5 text-white" />
              </div>
              
              <div className="p-6">
                {savedPlans.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You don't have any saved plans yet.</p>
                    <button
                      onClick={() => navigate('/onboarding')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create Your First Plan
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedPlans.map(plan => (
                      <div
                        key={plan.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <div className="mb-3 sm:mb-0">
                          <h3 className="font-medium">{plan.name}</h3>
                          <p className="text-sm text-gray-500">
                            Last modified: {formatDate(plan.lastModified)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenPlan(plan.id)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => confirmDeletePlan(plan.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Delete Academic Plan</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this academic plan? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlan}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;