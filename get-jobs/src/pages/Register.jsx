import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/authAPI';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      if (data.success) {
        login(data.data.token, data.data.user);
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'An error occurred during registration');
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

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;
    registerMutation.mutate(dataToSend);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#04060D' }}>
      <div className="w-full max-w-md p-8 rounded-lg" style={{ backgroundColor: '#D3D4D7' }}>
        <h1 className="text-3xl font-bold text-center mb-6" style={{ color: '#04060D' }}>
          Register
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border-2 focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: '#fff',
                borderColor: '#143AA2',
                color: '#04060D'
              }}
              placeholder="Enter your name"
              disabled={registerMutation.isPending}
            />
          </div>

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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border-2 focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: '#fff',
                borderColor: '#143AA2',
                color: '#04060D'
              }}
              placeholder="Confirm your password"
              disabled={registerMutation.isPending}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded font-semibold transition-colors hover:opacity-90"
            style={{
              backgroundColor: '#143AA2',
              color: '#D3D4D7'
            }}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p style={{ color: '#04060D' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: '#143AA2' }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
