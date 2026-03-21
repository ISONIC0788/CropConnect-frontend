import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Landing Page Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Mission from './components/Mission'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Auth Components
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Admin Components
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard1 from './pages/admin/admindashboard1'
import UserManagement from './pages/admin/UserManagement'
import DisputeArbitration from './pages/admin/DisputeArbitration'
import SystemHealth from './pages/admin/SystemHealth'
import Settings from './pages/admin/Settings'

// Buyer Components
import BuyerLayout from './layouts/BuyerLayout'
import SourcingMap from './pages/buyer/SourcingMap'
import Watchlist from './pages/buyer/Watchlist' 
import ActiveOrders from './pages/buyer/ActiveOrders'
import EscrowWallet from './pages/buyer/EscrowWallet'
import Profile from './pages/buyer/Profile'

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
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard1 /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
        <Route path="/admin/disputes" element={<AdminLayout><DisputeArbitration /></AdminLayout>} />
        <Route path="/admin/health" element={<AdminLayout><SystemHealth /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />

        {/* Buyer Routes */}
        <Route path="/buyer" element={<BuyerLayout><SourcingMap /></BuyerLayout>} />
        <Route path="/buyer/watchlist" element={<BuyerLayout><Watchlist /></BuyerLayout>} /> 
        <Route path="/buyer/orders" element={<BuyerLayout><ActiveOrders /></BuyerLayout>} /> 
        <Route path="/buyer/wallet" element={<BuyerLayout><EscrowWallet /></BuyerLayout>} />
        <Route path="/buyer/profile" element={<BuyerLayout><Profile /></BuyerLayout>} />
        
        {/* Logout Route - Redirects to Login */}
        <Route path="/logout" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App