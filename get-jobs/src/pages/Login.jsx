import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/authAPI';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      if (data.success) {
        login(data.data.token, data.data.user);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'An error occurred during login');
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-lg border-2" style={{ backgroundColor: '#D3D4D7', borderColor: '#143AA2' }}>
        <h1 className="text-3xl font-bold text-center mb-6" style={{ color: '#04060D' }}>
          Login
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border-2 focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: '#fff',
                borderColor: '#143AA2',
                color: '#04060D'
              }}
              placeholder="Enter your email"
              disabled={loginMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border-2 focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: '#fff',
                borderColor: '#143AA2',
                color: '#04060D'
              }}
              placeholder="Enter your password"
              disabled={loginMutation.isPending}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded font-semibold transition-colors hover:opacity-90"
            style={{
              backgroundColor: '#143AA2',
              color: '#D3D4D7'
            }}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p style={{ color: '#04060D' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold hover:underline"
              style={{ color: '#143AA2' }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
