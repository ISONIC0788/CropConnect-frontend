import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- LANDING PAGE COMPONENTS ---
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Mission from './components/Mission'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

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

// --- FARMER COMPONENTS ---
import FarmerLayout from './layouts/FarmerLayout' 
import FarmerDashboard from './pages/farmer/FarmerDashboard' 
import SalesHistory from './pages/farmer/SalesHistory' // <-- NEW IMPORT
import Payments from './pages/farmer/Payments'         // <-- NEW IMPORT

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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN', 'ROLE_ADMIN']}><AdminLayout><AdminDashboard1 /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN', 'ROLE_ADMIN']}><AdminLayout><UserManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/disputes" element={<ProtectedRoute allowedRoles={['ADMIN', 'ROLE_ADMIN']}><AdminLayout><DisputeArbitration /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/health" element={<ProtectedRoute allowedRoles={['ADMIN', 'ROLE_ADMIN']}><AdminLayout><SystemHealth /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN', 'ROLE_ADMIN']}><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />

        {/* Buyer Routes - Protected */}
        <Route path="/buyer" element={<ProtectedRoute allowedRoles={['BUYER', 'ROLE_BUYER']}><BuyerLayout><SourcingMap /></BuyerLayout></ProtectedRoute>} />
        <Route path="/buyer/watchlist" element={<ProtectedRoute allowedRoles={['BUYER', 'ROLE_BUYER']}><BuyerLayout><Watchlist /></BuyerLayout></ProtectedRoute>} /> 
        <Route path="/buyer/orders" element={<ProtectedRoute allowedRoles={['BUYER', 'ROLE_BUYER']}><BuyerLayout><ActiveOrders /></BuyerLayout></ProtectedRoute>} /> 
        <Route path="/buyer/wallet" element={<ProtectedRoute allowedRoles={['BUYER', 'ROLE_BUYER']}><BuyerLayout><EscrowWallet /></BuyerLayout></ProtectedRoute>} />
        <Route path="/buyer/profile" element={<ProtectedRoute allowedRoles={['BUYER', 'ROLE_BUYER']}><BuyerLayout><Profile /></BuyerLayout></ProtectedRoute>} />
        
        {/* Agent Routes - Protected */}
        <Route path="/agent" element={<ProtectedRoute allowedRoles={['AGENT', 'ROLE_AGENT']}><AgentLayout><AgentDashboard /></AgentLayout></ProtectedRoute>} />
        <Route path="/agent/verify" element={<ProtectedRoute allowedRoles={['AGENT', 'ROLE_AGENT']}><AgentLayout><VerifyProduce /></AgentLayout></ProtectedRoute>} />
        <Route path="/agent/onboard" element={<ProtectedRoute allowedRoles={['AGENT', 'ROLE_AGENT']}><AgentLayout><OnboardFarmer /></AgentLayout></ProtectedRoute>} />
        <Route path="/agent/mediate" element={<ProtectedRoute allowedRoles={['AGENT', 'ROLE_AGENT']}><AgentLayout><MediateDispute /></AgentLayout></ProtectedRoute>} />

        {/* Farmer Routes - Protected */}
        <Route path="/farmer" element={
          <ProtectedRoute allowedRoles={['FARMER', 'ROLE_FARMER']}>
            <FarmerLayout>
              <FarmerDashboard />
            </FarmerLayout>
          </ProtectedRoute>
        } />
        {/* NEW ROUTES FOR FARMER HISTORY AND PAYMENTS */}
        <Route path="/farmer/history" element={
          <ProtectedRoute allowedRoles={['FARMER', 'ROLE_FARMER']}>
            <FarmerLayout>
              <SalesHistory />
            </FarmerLayout>
          </ProtectedRoute>
        } />
        <Route path="/farmer/payments" element={
          <ProtectedRoute allowedRoles={['FARMER', 'ROLE_FARMER']}>
            <FarmerLayout>
              <Payments />
            </FarmerLayout>
          </ProtectedRoute>
        } />

        {/* Logout Route - Redirects to Login */}
        <Route path="/logout" element={
          <div onClick={() => {
            localStorage.removeItem('jwt_token');
            window.location.href = '/login';
          }}>
            <Navigate to="/login" replace />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App