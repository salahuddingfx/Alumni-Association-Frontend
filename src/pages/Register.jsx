import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, Mail, UserPlus, User, Phone, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', {
        email,
        username,
        phone,
        password,
      });

      if (res.data.success) {
        setMessage('Registration successful! You can now log in.');
        setEmail('');
        setUsername('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="py-20 px-6 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg mx-auto mb-3">
            প
          </div>
          <h2 className="text-2xl font-extrabold text-primary font-bn">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Register Alumni Member Account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200">
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username (Optional)</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="username"
                className="w-full bg-slate-50 border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="017xxxxxxxx"
                className="w-full bg-slate-50 border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-gray-300 pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-md transition flex items-center justify-center space-x-2 text-sm"
          >
            <UserPlus size={16} />
            <span>Create Account</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Already have an account? <Link to="/login" className="text-secondary font-bold hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
