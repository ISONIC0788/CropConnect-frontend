import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Do farmers need the internet to use this?",
      answer: "No. Farmers interact with CropConnect entirely through USSD and SMS codes, meaning it works on any basic feature phone without requiring a data plan or smartphone."
    },
    {
      question: "How do buyers pay?",
      answer: "Buyers pay through our secure online platform. Funds are held in a protected escrow account and are only released to the farmer once the field agent confirms the quality and pickup of the produce."
    },
    {
      question: "Is farmer data private?",
      answer: "Yes. We take data privacy seriously. Farmer contact information is only shared with verified buyers once a trade agreement is locked to ensure safety and prevent harassment."
    },
    {
      question: "What crops are available on CropConnect?",
      answer: "We currently focus on high-volume staples including Maize, Beans, Rice, and Soybeans, but we are constantly expanding our catalog based on regional demand."
    },
    {
      question: "How do field agents help?",
      answer: "Field agents act as the physical trust layer. They verify the quality of the crops at the farm gate, assist with weighing, and ensure the logistics provider picks up the correct inventory."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 md:px-12 lg:px-24 bg-cream">
      <div className="max-w-3xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 font-sans">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            Support
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brown">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 font-sans">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-green-50/30 transition-colors cursor-pointer"
              >
                <span className="font-bold text-brown text-lg">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {/* Answer content with smooth opening effect */}
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default FAQ;