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

// A wrapper for the landing page to keep things clean
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
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Admin Dashboard Route */}
        <Route 
          path="/admin" 
          element={
            <AdminLayout>
              <AdminDashboard1 />
            </AdminLayout>
          } 
        />
        
        {/* Logout Route (Strictly /logout as requested) */}
        <Route path="/logout" element={<div className="p-10 text-center">Logging out...</div>} />
      </Routes>
    </Router>
  )
}

export default App