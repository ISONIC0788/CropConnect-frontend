import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../api/authService';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  // UI Tabs State
  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  
  // Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, we only process the password flow since your backend supports it
    if (activeTab === 'otp') {
      setError('OTP login is not yet supported by the server.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Call backend
      const response = await authService.login({ phoneNumber, password });
      
      // 2. Read the correct token field and save it
      const actualToken = response.token;
      if (!actualToken) {
        throw new Error("No token received from server");
      }
      localStorage.setItem('jwt_token', actualToken);

      // 3. Decode token
      const decodedToken: any = jwtDecode(actualToken);
      const userRole = decodedToken.role || decodedToken.authorities || ''; 

      // 4. Force a guaranteed page transition based on role
      if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
        window.location.href = '/admin';
      } else if (userRole === 'AGENT' || userRole === 'ROLE_AGENT') {
        window.location.href = '/agent';
      } else if (userRole === 'FARMER' || userRole === 'ROLE_FARMER') {
        // THE FIX: Properly route the farmer to their dashboard!
        window.location.href = '/farmer'; 
      } else {
        window.location.href = '/buyer'; // Default routing
      }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-brown mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Welcome back
        </h2>
        <p className="text-sm text-gray-500">Please enter your details to sign in.</p>
      </div>

      {/* AUTH TABS */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'password' ? 'bg-white text-brown shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Lock className="w-4 h-4" /> Password
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('otp'); setOtpSent(false); }}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'otp' ? 'bg-white text-brown shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Phone className="w-4 h-4" /> OTP
        </button>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        
        {/* PASSWORD TAB INPUTS */}
        {activeTab === 'password' && (
          <>
            <div className="relative">
              <input 
                type="text" 
                id="phoneNumber" 
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-sm text-brown placeholder-transparent focus:border-primary focus:ring-0 focus:outline-none transition-colors bg-white" 
                placeholder="Phone Number" 
              />
              <label 
                htmlFor="phoneNumber" 
                className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-primary"
              >
                Phone Number
              </label>
            </div>

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 pr-12 border-2 border-gray-200 rounded-xl text-sm text-brown placeholder-transparent focus:border-primary focus:ring-0 focus:outline-none transition-colors bg-white" 
                placeholder="Password" 
              />
              <label 
                htmlFor="password" 
                className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-primary"
              >
                Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </>
        )}

        {/* OTP TAB INPUTS */}
        {activeTab === 'otp' && (
          <>
            <div className="flex gap-3">
              <div className="w-24 px-3 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm font-bold text-[#3E2723] flex items-center justify-center">
                +250
              </div>
              <div className="relative flex-1">
                <input 
                  type="tel" 
                  id="otpPhone" 
                  disabled={otpSent}
                  className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-sm text-brown placeholder-transparent focus:border-primary focus:ring-0 focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-400" 
                  placeholder="Phone Number" 
                />
                <label 
                  htmlFor="otpPhone" 
                  className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-primary"
                >
                  Phone Number
                </label>
              </div>
            </div>

            {!otpSent ? (
              <button 
                type="button" 
                onClick={() => setOtpSent(true)}
                className="w-full py-4 rounded-xl text-sm font-bold text-primary bg-green-50 border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
              >
                Send OTP Code <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="relative animate-in slide-in-from-top-2">
                <input 
                  type="text" 
                  id="otpCode" 
                  maxLength={6}
                  className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-center tracking-[0.5em] text-lg font-bold text-brown placeholder-transparent focus:border-accent focus:ring-0 focus:outline-none transition-colors bg-white" 
                  placeholder="000000" 
                />
                <label 
                  htmlFor="otpCode" 
                  className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-accent"
                >
                  6-Digit OTP Code
                </label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              </div>
            )}
          </>
        )}

        {/* UTILITIES */}
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center group-hover:border-primary transition-colors">
              <input type="checkbox" className="opacity-0 absolute w-0 h-0 peer" />
              <svg className="w-3 h-3 text-white peer-checked:text-primary opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm font-bold text-primary hover:text-green-800 transition-colors">
            Forgot password?
          </a>
        </div>

        {/* PRIMARY ACTION */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 mt-4 rounded-xl text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 ${
            loading 
              ? 'bg-green-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-green-800 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
             <span className="animate-pulse">Authenticating...</span>
          ) : (
            <>
              {activeTab === 'password' ? <Lock className="w-4 h-4" /> : null} Log In
            </>
          )}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-sm font-medium text-gray-500 mt-8">
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold text-primary hover:underline">
          Sign up
        </Link>
      </p>

    </div>
  );
};

export default Login;