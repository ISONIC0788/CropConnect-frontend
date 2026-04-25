import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Role } from './types/enums';

// --- LANDING PAGE COMPONENTS ---
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Mission from './components/Mission'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import LogoutConfirmationModal from './components/LogoutConfirmationModal'

// --- AUTH COMPONENTS ---
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ProtectedRoute from './components/ProtectedRoute'

// --- ADMIN COMPONENTS ---
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard1 from './pages/admin/admindashboard1'
import UserManagement from './pages/admin/UserManagement'
import DisputeArbitration from './pages/admin/DisputeArbitration'
import SystemHealth from './pages/admin/SystemHealth'
import Settings from './pages/admin/Settings'
import AuditLogPage from './pages/admin/AuditLogPage'

// --- BUYER COMPONENTS ---
import BuyerLayout from './layouts/BuyerLayout'
import SourcingMap from './pages/buyer/SourcingMap'
import Watchlist from './pages/buyer/Watchlist'
import ActiveOrders from './pages/buyer/ActiveOrders'
import EscrowWallet from './pages/buyer/EscrowWallet'
import Profile from './pages/buyer/Profile'

// --- AGENT COMPONENTS ---
import AgentLayout from './layouts/AgentLayout'
import AgentDashboard from './pages/agent/AgentDashboard'
import OnboardFarmer from './pages/agent/OnboardFarmer'
import VerifyProduce from './pages/agent/VerifyProduce'
import MediateDispute from './pages/agent/MediateDispute'
import AgentProfile from './pages/agent/Profile'

// --- FARMER COMPONENTS ---
import FarmerLayout from './layouts/FarmerLayout'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import SalesHistory from './pages/farmer/SalesHistory'
import Payments from './pages/farmer/Payments'
import FarmerProfile from './pages/farmer/Profile'

const LandingPage = () => (
  <main>
    <Navbar />
    <Hero />
    <Mission />
    <HowItWorks />
    <Testimonials />
    <FAQ />
    <Contact />
    <Footer />
  </main>
);

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" closeButton duration={4000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={[Role.ADMIN, `ROLE_${Role.ADMIN}`]}><AdminLayout><AdminDashboard1 /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={[Role.ADMIN, `ROLE_${Role.ADMIN}`]}><AdminLayout><UserManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/disputes" element={<ProtectedRoute allowedRoles={[Role.ADMIN, `ROLE_${Role.ADMIN}`]}><AdminLayout><DisputeArbitration /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/health" element={<ProtectedRoute allowedRoles={[Role.ADMIN, `ROLE_${Role.ADMIN}`]}><AdminLayout><SystemHealth /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={[Role.ADMIN, `ROLE_${Role.ADMIN}`]}><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={[Role.ADMIN, `ROLE_${Role.ADMIN}`]}><AdminLayout><AuditLogPage /></AdminLayout></ProtectedRoute>} />

        {/* Buyer Routes - Protected */}
        <Route path="/buyer" element={<ProtectedRoute allowedRoles={[Role.BUYER, `ROLE_${Role.BUYER}`]}><BuyerLayout><SourcingMap /></BuyerLayout></ProtectedRoute>} />
        <Route path="/buyer/watchlist" element={<ProtectedRoute allowedRoles={[Role.BUYER, `ROLE_${Role.BUYER}`]}><BuyerLayout><Watchlist /></BuyerLayout></ProtectedRoute>} />
        <Route path="/buyer/orders" element={<ProtectedRoute allowedRoles={[Role.BUYER, `ROLE_${Role.BUYER}`]}><BuyerLayout><ActiveOrders /></BuyerLayout></ProtectedRoute>} />
        <Route path="/buyer/wallet" element={<ProtectedRoute allowedRoles={[Role.BUYER, `ROLE_${Role.BUYER}`]}><BuyerLayout><EscrowWallet /></BuyerLayout></ProtectedRoute>} />
        <Route path="/buyer/profile" element={<ProtectedRoute allowedRoles={[Role.BUYER, `ROLE_${Role.BUYER}`]}><BuyerLayout><Profile /></BuyerLayout></ProtectedRoute>} />

        {/* Agent Routes - Protected */}
        <Route path="/agent" element={<ProtectedRoute allowedRoles={[Role.AGENT, `ROLE_${Role.AGENT}`]}><AgentLayout><AgentDashboard /></AgentLayout></ProtectedRoute>} />
        <Route path="/agent/verify" element={<ProtectedRoute allowedRoles={[Role.AGENT, `ROLE_${Role.AGENT}`]}><AgentLayout><VerifyProduce /></AgentLayout></ProtectedRoute>} />
        <Route path="/agent/onboard" element={<ProtectedRoute allowedRoles={[Role.AGENT, `ROLE_${Role.AGENT}`]}><AgentLayout><OnboardFarmer /></AgentLayout></ProtectedRoute>} />
        <Route path="/agent/mediate" element={<ProtectedRoute allowedRoles={[Role.AGENT, `ROLE_${Role.AGENT}`]}><AgentLayout><MediateDispute /></AgentLayout></ProtectedRoute>} />
        <Route path="/agent/profile" element={<ProtectedRoute allowedRoles={[Role.AGENT, `ROLE_${Role.AGENT}`]}><AgentLayout><AgentProfile /></AgentLayout></ProtectedRoute>} />

        {/* Farmer Routes - Protected */}
        <Route path="/farmer" element={
          <ProtectedRoute allowedRoles={[Role.FARMER, `ROLE_${Role.FARMER}`]}>
            <FarmerLayout>
              <FarmerDashboard />
            </FarmerLayout>
          </ProtectedRoute>
        } />
        {/* NEW ROUTES FOR FARMER HISTORY AND PAYMENTS */}
        <Route path="/farmer/history" element={
          <ProtectedRoute allowedRoles={[Role.FARMER, `ROLE_${Role.FARMER}`]}>
            <FarmerLayout>
              <SalesHistory />
            </FarmerLayout>
          </ProtectedRoute>
        } />
        <Route path="/farmer/payments" element={
          <ProtectedRoute allowedRoles={[Role.FARMER, `ROLE_${Role.FARMER}`]}>
            <FarmerLayout>
              <Payments />
            </FarmerLayout>
          </ProtectedRoute>
        } />
        <Route path="/farmer/profile" element={
          <ProtectedRoute allowedRoles={[Role.FARMER, `ROLE_${Role.FARMER}`]}>
            <FarmerLayout>
              <FarmerProfile />
            </FarmerLayout>
          </ProtectedRoute>
        } />

        {/* Logout Route - Redirects to Login */}
        <Route path="/logout" element={<LogoutConfirmationModal />} />
      </Routes>
    </Router>
  )
}

export default App