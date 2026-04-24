import { useState, useEffect } from 'react';
import { Globe, Bell, Shield, Database, User as UserIcon, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import axiosClient from '../../api/axiosClient';

// --- REUSABLE UI COMPONENTS ---

// 1. Custom Toggle Switch Component
const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
  <button
    type="button"
    className={`${
      enabled ? 'bg-primary' : 'bg-gray-200'
    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    onClick={onChange}
  >
    <span 
      className={`${
        enabled ? 'translate-x-5' : 'translate-x-0'
      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} 
    />
  </button>
);

// 2. Form Input Row
const InputRow = ({ label, type = "text", value, onChange, readOnly = false }: { label: string, type?: string, value: string, onChange?: (val: string) => void, readOnly?: boolean }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (readOnly ? 'password' : (showPassword ? 'text' : 'password')) : type;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-50 last:border-0 gap-4">
      <label className="text-sm font-medium text-gray-600 w-full md:w-1/3">{label}</label>
      <div className="w-full md:w-2/3 max-w-md relative">
        {onChange ? (
          <input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            className={`w-full px-4 py-2.5 ${!readOnly && type === 'password' ? 'pr-10' : ''} rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 ${readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed cursor-default focus:ring-0 focus:border-gray-200' : 'bg-white'}`}
          />
        ) : (
          <input
            type={inputType}
            defaultValue={value}
            key={value}
            readOnly={readOnly || true}
            className={`w-full px-4 py-2.5 ${!readOnly && type === 'password' ? 'pr-10' : ''} rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 bg-gray-50 text-gray-400 cursor-not-allowed cursor-default focus:ring-0 focus:border-gray-200`}
          />
        )}
        {type === 'password' && !readOnly && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

// 3. Toggle Action Row
const ToggleRow = ({ label, enabled, onChange }: { label: string, enabled: boolean, onChange: () => void }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <Toggle enabled={enabled} onChange={onChange} />
  </div>
);

// 4. Section Card Wrapper
const SectionCard = ({ icon, title, subtitle, children }: { icon: React.ReactNode, title: string, subtitle: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-brown">{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5 tracking-wide">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  </div>
);


// --- MAIN PAGE COMPONENT ---
const Settings = () => {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          const decoded: any = jwtDecode(token);
          const response = await axiosClient.get(`/users/${decoded.userId}`);
          setAdminUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin profile", error);
      }
    };
    fetchAdmin();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setAdminUser((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);
      const decoded: any = jwtDecode(localStorage.getItem('jwt_token') || '');
      await axiosClient.put(`/users/${decoded.userId}`, {
        phoneNumber: adminUser.phoneNumber,
        fullName: adminUser.fullName,
        email: adminUser.email,
      });
      toast.success('Admin profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error updating profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsChangingPassword(true);
      const decoded: any = jwtDecode(localStorage.getItem('jwt_token') || '');
      await axiosClient.put(`/users/${decoded.userId}/password`, {
        newPassword
      });
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setNewPassword('');
    } catch (err) {
      console.error(err);
      toast.error('Error changing password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // State for Notification Toggles
  const [latencyAlerts, setLatencyAlerts] = useState(true);
  const [disputeEmails, setDisputeEmails] = useState(true);
  const [kycAlerts, setKycAlerts] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  // State for Security Toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);

  if (!adminUser) {
    return <div className="p-8 text-center text-gray-500 font-medium tracking-wide">Loading settings...</div>;
  }

  return (
    <>
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* SECTION 0: Admin Profile Information */}
      <SectionCard 
        icon={<UserIcon className="w-6 h-6" />}
        title="Admin Profile"
        subtitle="Manage your personal administrator account details"
      >
        <InputRow label="Username / Phone" value={adminUser.phoneNumber || ''} onChange={(v) => handleProfileChange('phoneNumber', v)} />
        <InputRow label="Full Name" value={adminUser.fullName || ''} onChange={(v) => handleProfileChange('fullName', v)} />
        <InputRow label="Email Address" value={adminUser.email || ''} onChange={(v) => handleProfileChange('email', v)} />
        
        {/* Password Row with Change Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-50 last:border-0 gap-4">
          <label className="text-sm font-medium text-gray-600 w-full md:w-1/3">Password</label>
          <div className="w-full md:w-2/3 max-w-md flex items-center gap-3">
             <input type="password" value="••••••••••••••••" readOnly className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none text-gray-800 bg-gray-50 text-gray-400 cursor-not-allowed" />
             <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-700 rounded-lg transition-colors whitespace-nowrap">Change</button>
          </div>
        </div>

        <InputRow label="Role / Permissions" value={adminUser.role || "ADMIN"} readOnly={true} />
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            className="flex items-center gap-2 bg-[#2E7D32] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Details
          </button>
        </div>
      </SectionCard>
      
      {/* SECTION 1: SMS Gateway Configuration */}
      <SectionCard 
        icon={<Globe className="w-6 h-6" />}
        title="SMS Gateway Configuration"
        subtitle="Africa's Talking API credentials and routing"
      >
        <InputRow label="API Key" type="password" value="******************" />
        <InputRow label="Sender ID" value="CropConnect" />
        <InputRow label="USSD Code" value="*384*22#" />
      </SectionCard>

      {/* SECTION 2: Notification Preferences */}
      <SectionCard 
        icon={<Bell className="w-6 h-6" />}
        title="Notification Preferences"
        subtitle="System alerts and escalation thresholds"
      >
        <ToggleRow label="SMS latency alerts (>300ms)" enabled={latencyAlerts} onChange={() => setLatencyAlerts(!latencyAlerts)} />
        <ToggleRow label="Dispute escalation emails" enabled={disputeEmails} onChange={() => setDisputeEmails(!disputeEmails)} />
        <ToggleRow label="New KYC submission alerts" enabled={kycAlerts} onChange={() => setKycAlerts(!kycAlerts)} />
        <ToggleRow label="Daily digest report" enabled={dailyDigest} onChange={() => setDailyDigest(!dailyDigest)} />
      </SectionCard>

      {/* SECTION 3: Security & Access */}
      <SectionCard 
        icon={<Shield className="w-6 h-6" />}
        title="Security & Access"
        subtitle="Authentication and session management"
      >
        <InputRow label="Session Timeout" value="30 minutes" />
        <InputRow label="Max Login Attempts" value="5" />
        <ToggleRow label="Two-factor authentication" enabled={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
        <ToggleRow label="IP whitelisting" enabled={ipWhitelist} onChange={() => setIpWhitelist(!ipWhitelist)} />
      </SectionCard>

      {/* SECTION 4: Database Status Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-primary flex-shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-brown">Database</h2>
            <p className="text-xs text-gray-500 mt-0.5 tracking-wide">PostgreSQL 15.2 · 2.4 GB used</p>
          </div>
        </div>
        <span className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold tracking-wide">
          Connected
        </span>
      </div>

    </div>
      
      {/* PASSWORD CHANGE MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-[#3E2723]/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[#3E2723] text-lg">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <InputRow 
                label="New Password" 
                type="password" 
                value={newPassword} 
                onChange={setNewPassword} 
              />
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isChangingPassword || !newPassword}
                  className="flex-1 px-4 py-2.5 bg-[#2E7D32] text-white rounded-lg font-bold hover:bg-green-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;