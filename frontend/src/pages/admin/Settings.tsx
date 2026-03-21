import { useState } from 'react';
import { Globe, Bell, Shield, Database } from 'lucide-react';

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
const InputRow = ({ label, type = "text", value }: { label: string, type?: string, value: string }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-50 last:border-0 gap-4">
    <label className="text-sm font-medium text-gray-600 w-full md:w-1/3">{label}</label>
    <div className="w-full md:w-2/3 max-w-md">
      <input
        type={type}
        defaultValue={value}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 bg-white"
      />
    </div>
  </div>
);

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
  // State for Notification Toggles
  const [latencyAlerts, setLatencyAlerts] = useState(true);
  const [disputeEmails, setDisputeEmails] = useState(true);
  const [kycAlerts, setKycAlerts] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  // State for Security Toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
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
  );
};

export default Settings;