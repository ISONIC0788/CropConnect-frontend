import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Landing Page Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Mission from './components/Mission'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Admin Components
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard1 from './pages/admin/admindashboard1'
import UserManagement from './pages/admin/UserManagement' // <-- ADD THIS IMPORT

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
        
        {/* Admin Overview Route */}
        <Route 
          path="/admin" 
          element={<AdminLayout><AdminDashboard1 /></AdminLayout>} 
        />

        {/* Admin User Management Route --> ADD THIS ROUTE */}
        <Route 
          path="/admin/users" 
          element={<AdminLayout><UserManagement /></AdminLayout>} 
        />
        
        <Route path="/logout" element={<div className="p-10 text-center">Logging out...</div>} />
      </Routes>
    </Router>
  )
}

export default App