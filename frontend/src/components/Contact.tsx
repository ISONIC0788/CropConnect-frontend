import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 lg:px-24 bg-cream">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Contact Information */}
        <div className="font-sans">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            Get In Touch
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brown mb-8">
            Contact Us
          </h2>
          <p className="text-gray-600 text-lg mb-12 max-w-md">
            Whether you're a buyer looking to streamline your sourcing, a farmer cooperative wanting to onboard, or a partner interested in collaboration — we'd love to hear from you.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-brown font-medium">KG 123 St, Kigali, Rwanda</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-brown font-medium">+250 788 123 456</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-brown font-medium">hello@cropconnect.rw</span>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form Card */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <form className="space-y-6 font-sans">
            <div>
              <label className="block text-sm font-bold text-brown mb-2">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-brown mb-2">Email</label>
              <input 
                type="email" 
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-brown mb-2">Role</label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100 outline-none transition-all bg-white">
                <option>Select your role</option>
                <option>Wholesale Buyer</option>
                <option>Farmer Cooperative</option>
                <option>Logistics Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-brown mb-2">Message</label>
              <textarea 
                rows={4}
                placeholder="Tell us how we can help..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <button className="w-full bg-primary hover:bg-green-800 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;