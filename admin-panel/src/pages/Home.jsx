import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, BarChart2, Settings } from 'lucide-react';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-blue-600 text-3xl">ATS</span> Admin Panel
        </h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Sign Out
        </button>
      </nav>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-10">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Welcome back, {user?.name}!
          </h2>
          <div className="flex gap-4 text-gray-600 mb-6 font-medium">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
              {user?.email}
            </span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
              {user?.role || 'Admin'}
            </span>
          </div>
          <p className="text-gray-600 max-w-2xl">
            This is your dashboard where you can manage job postings, review applications, and configure system settings. Use the cards below to navigate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            onClick={() => navigate('/jobs')}
            className="p-8 rounded-xl cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <ClipboardList className="text-blue-600 group-hover:text-white transition-colors" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              Job Management
            </h3>
            <p className="text-gray-500">
              Create, edit, and manage job postings and view applicants per job.
            </p>
          </div>

          <div
            className="p-8 rounded-xl bg-white border border-gray-200 shadow-sm opacity-60 cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart2 className="text-gray-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              Analytics
            </h3>
            <p className="text-gray-500">
              View insights and recruitment metrics (Coming Soon)
            </p>
          </div>

          <div className="p-8 rounded-xl bg-white border border-gray-200 shadow-sm opacity-60 cursor-not-allowed">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="text-gray-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              Settings
            </h3>
            <p className="text-gray-500">
              Configure system preferences and admin accounts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
