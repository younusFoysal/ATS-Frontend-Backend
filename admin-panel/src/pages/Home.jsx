import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#04060D' }}>
      <nav className="p-4 flex justify-between items-center border-b-2" style={{ borderColor: '#143AA2' }}>
        <h1 className="text-2xl font-bold" style={{ color: '#D3D4D7' }}>
          ATS Admin Panel
        </h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 rounded font-semibold transition-colors hover:opacity-90"
          style={{
            backgroundColor: '#143AA2',
            color: '#D3D4D7'
          }}
        >
          Logout
        </button>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="p-8 rounded-lg" style={{ backgroundColor: '#D3D4D7' }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#04060D' }}>
            Welcome, {user?.name}!
          </h2>
          <p className="text-lg mb-2" style={{ color: '#143AA2' }}>
            Email: {user?.email}
          </p>
          <p className="text-lg mb-2" style={{ color: '#143AA2' }}>
            Role: {user?.role || 'Admin'}
          </p>
          <p className="mt-6" style={{ color: '#04060D' }}>
            Manage your job postings and applications from the admin panel.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate('/jobs')}
            className="p-6 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#143AA2' }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: '#D3D4D7' }}>
              📋 Job Management
            </h3>
            <p style={{ color: '#D3D4D7' }}>
              Create, edit, and manage job postings
            </p>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: '#3E8DE3' }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#04060D' }}>
              📄 Applications
            </h3>
            <p style={{ color: '#04060D' }}>
              Review and manage job applications
            </p>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: '#143AA2' }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#D3D4D7' }}>
              ⚙️ Settings
            </h3>
            <p style={{ color: '#D3D4D7' }}>
              Configure system preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
