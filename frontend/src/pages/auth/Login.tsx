import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login routing based on role later, default to buyer dashboard
    navigate('/buyer');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3E2723] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Welcome back
        </h2>
        <p className="text-sm text-gray-500">Please enter your details to sign in.</p>
      </div>

      {/* AUTH TABS */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
        <button
          onClick={() => setActiveTab('email')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'email' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mail className="w-4 h-4" /> Email
        </button>
        <button
          onClick={() => { setActiveTab('phone'); setOtpSent(false); }}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'phone' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Phone className="w-4 h-4" /> Phone
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        
        {/* EMAIL TAB INPUTS */}
        {activeTab === 'email' && (
          <>
            <div className="relative">
              <input 
                type="email" 
                id="email" 
                required
                className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-sm text-[#3E2723] placeholder-transparent focus:border-[#2E7D32] focus:ring-0 focus:outline-none transition-colors bg-white" 
                placeholder="Email Address" 
              />
              <label 
                htmlFor="email" 
                className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-[#2E7D32]"
              >
                Email Address
              </label>
            </div>

            <div className="relative">
              <input 
                type="password" 
                id="password" 
                required
                className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-sm text-[#3E2723] placeholder-transparent focus:border-[#2E7D32] focus:ring-0 focus:outline-none transition-colors bg-white" 
                placeholder="Password" 
              />
              <label 
                htmlFor="password" 
                className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-[#2E7D32]"
              >
                Password
              </label>
            </div>
          </>
        )}

        {/* PHONE TAB INPUTS */}
        {activeTab === 'phone' && (
          <>
            <div className="flex gap-3">
              <div className="w-24 px-3 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm font-bold text-[#3E2723] flex items-center justify-center">
                +250
              </div>
              <div className="relative flex-1">
                <input 
                  type="tel" 
                  id="phone" 
                  required
                  disabled={otpSent}
                  className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-sm text-[#3E2723] placeholder-transparent focus:border-[#2E7D32] focus:ring-0 focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-400" 
                  placeholder="Phone Number" 
                />
                <label 
                  htmlFor="phone" 
                  className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-[#2E7D32]"
                >
                  Phone Number
                </label>
              </div>
            </div>

            {!otpSent ? (
              <button 
                type="button" 
                onClick={() => setOtpSent(true)}
                className="w-full py-4 rounded-xl text-sm font-bold text-[#2E7D32] bg-green-50 border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
              >
                Send OTP Code <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="relative animate-in slide-in-from-top-2">
                <input 
                  type="text" 
                  id="otp" 
                  required
                  maxLength={6}
                  className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-center tracking-[0.5em] text-lg font-bold text-[#3E2723] placeholder-transparent focus:border-[#FBC02D] focus:ring-0 focus:outline-none transition-colors bg-white" 
                  placeholder="000000" 
                />
                <label 
                  htmlFor="otp" 
                  className="absolute left-4 top-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:font-bold peer-focus:text-[#FBC02D]"
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
            <div className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center group-hover:border-[#2E7D32] transition-colors">
              <input type="checkbox" className="opacity-0 absolute w-0 h-0 peer" />
              <svg className="w-3 h-3 text-white peer-checked:text-[#2E7D32] opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm font-bold text-[#2E7D32] hover:text-green-800 transition-colors">
            Forgot password?
          </a>
        </div>

        {/* PRIMARY ACTION */}
        <button 
          type="submit" 
          className="w-full py-4 mt-4 rounded-xl text-white font-bold text-base bg-[#2E7D32] hover:bg-green-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          {activeTab === 'email' ? <Lock className="w-4 h-4" /> : null} Log In
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-sm font-medium text-gray-500 mt-8">
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold text-[#2E7D32] hover:underline">
          Sign up
        </Link>
      </p>

    </div>
  );
};

export default Login;