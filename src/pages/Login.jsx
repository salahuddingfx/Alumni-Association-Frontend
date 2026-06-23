import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { KeyRound, Mail, LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        identifier,
        password,
      });

      if (res.data.success) {
        localStorage.setItem('accessToken', res.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="py-20 px-6 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
        <div className="text-center mb-8">
          <img src="/alumni_logo.png" className="w-12 h-12 rounded-full border-2 border-secondary shadow-md mx-auto mb-3 object-cover animate-pulse" alt="Logo" />
          <h2 className="text-2xl font-extrabold text-primary font-bn">প্যানেলে প্রবেশ করুন</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Alumni Member Login</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email, Username, or Phone</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Email, username, or phone number"
                className="w-full bg-slate-50 border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-gray-300 pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-md transition flex items-center justify-center space-x-2 text-sm"
          >
            <LogIn size={16} />
            <span>Login to Platform</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Don't have an account? <Link to="/register" className="text-secondary font-bold hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
