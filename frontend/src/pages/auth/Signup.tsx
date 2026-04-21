import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User as UserIcon, Check, Shield, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../api/authService';

const Signup = () => {
  // UI State
  const [role, setRole] = useState<'buyer' | 'agent' | 'admin'>('buyer');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Fields present in UI but missing in DB currently (we just hold them in state)
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  // API State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Calculate simple password strength (0-3)
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length > 7) score += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };
  const strength = getPasswordStrength();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Prepare data to match your Spring Boot User.java exactly
      const userData = {
        fullName: fullName,
        phoneNumber: phoneNumber,
        passwordHash: password, // Using raw password here; ensure backend hashes it!
        role: role === 'buyer' ? 'BUYER' : role === 'agent' ? 'AGENT' : 'ADMIN' // Use standard uppercase roles
      };

      // 2. Call the register API
      await authService.register(userData);

      // 3. If successful, redirect them to login so they can authenticate
      alert('Account created successfully! Please log in.');
      navigate('/login');

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create account. Phone number might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3E2723] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Create an Account
        </h2>
        <p className="text-sm text-gray-500">Start sourcing directly from verified farmers.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      {/* ROLE SELECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <button
          type="button"
          onClick={() => setRole('buyer')}
          className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
            role === 'buyer' ? 'border-[#2E7D32] bg-green-50/50' : 'border-gray-200 hover:border-green-200'
          }`}
        >
          <Building2 className={`w-5 h-5 mb-2 ${role === 'buyer' ? 'text-[#2E7D32]' : 'text-gray-400'}`} />
          <p className={`text-sm font-bold ${role === 'buyer' ? 'text-[#3E2723]' : 'text-gray-500'}`}>Wholesale Buyer</p>
          {role === 'buyer' && <div className="absolute top-3 right-3 w-4 h-4 bg-[#2E7D32] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
        </button>

        <button
          type="button"
          onClick={() => setRole('agent')}
          className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
            role === 'agent' ? 'border-[#FBC02D] bg-yellow-50/50' : 'border-gray-200 hover:border-yellow-200'
          }`}
        >
          <UserIcon className={`w-5 h-5 mb-2 ${role === 'agent' ? 'text-[#D97706]' : 'text-gray-400'}`} />
          <p className={`text-sm font-bold ${role === 'agent' ? 'text-[#3E2723]' : 'text-gray-500'}`}>Field Agent</p>
          {role === 'agent' && <div className="absolute top-3 right-3 w-4 h-4 bg-[#FBC02D] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
        </button>

        <button
          type="button"
          onClick={() => setRole('admin')}
          className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
            role === 'admin' ? 'border-purple-600 bg-purple-50/50' : 'border-gray-200 hover:border-purple-200'
          }`}
        >
          <Shield className={`w-5 h-5 mb-2 ${role === 'admin' ? 'text-purple-600' : 'text-gray-400'}`} />
          <p className={`text-sm font-bold ${role === 'admin' ? 'text-[#3E2723]' : 'text-gray-500'}`}>System Admin</p>
          {role === 'admin' && <div className="absolute top-3 right-3 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
        </button>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        
        {/* INPUT FIELDS */}
        <div className="relative">
          <input 
            type="text" 
            id="fullname" 
            required 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-sm text-[#3E2723] placeholder-transparent focus:border-[#2E7D32] focus:ring-0 focus:outline-none transition-colors bg-white" 
            placeholder="Full Name" 
          />
          <label htmlFor="fullname" className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-[#2E7D32]">Full Name</label>
        </div>

        {role === 'buyer' && (
          <div className="relative">
            <input 
              type="text" 
              id="company" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-sm text-[#3E2723] placeholder-transparent focus:border-[#2E7D32] focus:ring-0 focus:outline-none transition-colors bg-white" 
              placeholder="Company/Business Name" 
            />
            <label htmlFor="company" className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-[#2E7D32]">Company/Business Name</label>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <input 
              type="email" 
              id="signup-email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-sm text-[#3E2723] placeholder-transparent focus:border-[#2E7D32] focus:ring-0 focus:outline-none transition-colors bg-white" 
              placeholder="Email Address" 
            />
            <label htmlFor="signup-email" className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-[#2E7D32]">Email Address</label>
          </div>
          <div className="relative">
            <input 
              type="tel" 
              id="signup-phone" 
              required 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-sm text-[#3E2723] placeholder-transparent focus:border-[#2E7D32] focus:ring-0 focus:outline-none transition-colors bg-white" 
              placeholder="Phone Number" 
            />
            <label htmlFor="signup-phone" className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-[#2E7D32]">Phone Number</label>
          </div>
        </div>

        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            id="signup-password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            className="peer w-full px-4 pt-6 pb-2 pr-12 border-2 border-gray-200 rounded-xl text-sm text-[#3E2723] placeholder-transparent focus:border-[#2E7D32] focus:ring-0 focus:outline-none transition-colors bg-white" 
            placeholder="Password" 
          />
          <label htmlFor="signup-password" className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-[#2E7D32]">Create Password</label>
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[25px] -translate-y-1/2 text-gray-400 hover:text-[#2E7D32] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          {/* PASSWORD STRENGTH INDICATOR */}
          <div className="flex gap-1 mt-2 px-1">
            <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 1 ? (strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-yellow-400' : 'bg-green-500') : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 2 ? (strength === 2 ? 'bg-yellow-400' : 'bg-green-500') : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        {/* TERMS */}
        <label className="flex items-start gap-3 mt-6 cursor-pointer group">
          <div className="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-[#2E7D32] transition-colors bg-white">
            <input type="checkbox" required className="opacity-0 absolute w-0 h-0 peer" />
            <Check className="w-3.5 h-3.5 text-white peer-checked:text-[#2E7D32] opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs font-medium text-gray-600 leading-snug">
            I agree to CropConnect's <a href="#" className="text-[#2E7D32] font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-[#2E7D32] font-bold hover:underline">Privacy Policy</a>.
          </span>
        </label>

        {/* PRIMARY ACTION */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 mt-2 rounded-xl text-white font-bold text-base shadow-md transition-all ${
            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-[#2E7D32] hover:bg-green-800 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {loading ? <span className="animate-pulse">Creating Account...</span> : 'Create Account'}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-sm font-medium text-gray-500 mt-8">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-[#2E7D32] hover:underline">
          Log in
        </Link>
      </p>

    </div>
  );
};

export default Signup;