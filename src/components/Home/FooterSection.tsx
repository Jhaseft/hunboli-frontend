import { Coins, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export function FooterSection() {
  const footerLinks = {
    product: [
      'How it Works',
      'Transparency',
      'Supported Tokens',
      'Wallet',
      'API Documentation',
    ],
    company: [
      'About Us',
      'Careers',
      'Press Kit',
      'Blog',
      'Contact',
    ],
    legal: [
      'Terms of Service',
      'Privacy Policy',
      'Cookie Policy',
      'Legal & Compliance',
      'Risk Disclosure',
    ],
    support: [
      'Help Center',
      'Knowledge Base',
      'System Status',
      'Security',
      'Fees',
    ],
  };

  return (
    <footer className="bg-gray-900/80 border-t border-gray-800 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-white">StableCoin</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              The world's most trusted stablecoin, powering the future of digital finance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-colors">
                <Github className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2013 - 2026 StableCoin Operations Limited. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors">
                Accessibility
              </a>
              <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors">
                Sitemap
              </a>
              <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
