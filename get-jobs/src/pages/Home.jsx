import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, FileText, User, LogOut, Briefcase } from 'lucide-react';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10 w-full">
        <div className="flex items-center gap-2">
          <Briefcase className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Get<span className="text-blue-600">Jobs</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600 hidden sm:block">
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 mb-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h2>
            <p className="text-blue-100 max-w-xl text-lg">
              Ready to take the next step in your career? Browse the latest opportunities or check your application status.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 transform skew-x-12"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            onClick={() => navigate('/jobs')}
            className="group bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Search size={100} className="text-blue-600" />
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Browse Jobs
            </h3>
            <p className="text-gray-500 group-hover:text-gray-600 transition-colors">
              Explore thousands of job openings and find your perfect match.
            </p>
          </div>

          <div
            onClick={() => navigate('/applications')}
            className="group bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText size={100} className="text-purple-600" />
            </div>
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileText size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              My Applications
            </h3>
            <p className="text-gray-500 group-hover:text-gray-600 transition-colors">
              Track the status of your applications and interview schedules.
            </p>
          </div>

          <div
            className="group bg-white p-8 rounded-xl shadow-sm border border-gray-200 opacity-60 cursor-not-allowed relative overflow-hidden"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 text-gray-500">
              <User size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              My Profile
            </h3>
            <p className="text-gray-500">
              Update your resume and personal details. (Coming Soon)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
