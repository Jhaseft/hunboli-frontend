'use client';
import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is Tether?',
      answer:
        'Launched in 2014, Tether is a blockchain-enabled platform designed to facilitate the use of fiat currencies in a digital manner. Tether works to disrupt the conventional financial system via a more modern approach to money. Tether has made headway by giving customers the ability to transact with traditional currencies across the blockchain, without the inherent volatility and complexity typically associated with a digital currency. As the first blockchain-enabled platform to facilitate the digital use of traditional currencies (a familiar, stable accounting unit), Tether has democratised cross-border transactions across the blockchain.',
    },
    {
      question: 'How do Tether Tokens work?',
      answer:
        'Tether tokens are pegged 1-to-1 to their respective fiat currencies and are backed 100% by Tether\'s reserves.',
    },
    {
      question: 'What are Tether Tokens?',
      answer: 'Tether tokens are digital assets that represent fiat currencies on the blockchain.',
    },
    {
      question: 'What currencies and commodities does Tether support?',
      answer: 'Tether supports multiple currencies including USD, EUR, and other major fiat currencies.',
    },
    {
      question: 'Who can use Tether Tokens?',
      answer: 'Anyone can use Tether tokens for transactions, trading, and value storage.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-teal-500 to-teal-600">
      <div className="max-w-4xl mx-auto px-6">
      
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            FAQs
          </h2>
        </div>

      
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/15"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg md:text-xl font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-white flex-shrink-0 transform transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

            
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-white/90 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white hover:bg-gray-100 text-teal-600 font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            See All FAQs
          </button>
        </div>
      </div>
    </section>
  );
};

