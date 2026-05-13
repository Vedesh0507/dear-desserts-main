import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Mail, Heart, Clock, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-chocolate-950 text-cream-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-cream-50 mb-2">
                Stay Sweet with Updates
              </h3>
              <p className="text-cream-400">
                Subscribe to receive exclusive offers and new dessert announcements
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-80 px-5 py-3.5 rounded-full bg-white/10 border border-white/10 text-cream-50 placeholder-cream-400 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
              <button className="px-6 py-3.5 bg-gold-500 text-chocolate-900 rounded-full font-semibold hover:bg-gold-400 transition-all flex items-center gap-2 whitespace-nowrap">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-cream-50 rounded-2xl p-2 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Dear Desserts" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display text-xl font-bold block text-cream-50">Dear Desserts</span>
                <span className="text-gold-400 text-sm font-medium">Love at First Bite</span>
              </div>
            </div>
            <p className="text-cream-400 text-sm leading-relaxed">
              Crafting sweet memories with passion and the finest ingredients. Every dessert is a celebration of artisanal excellence.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center hover:bg-gold-500 hover:text-chocolate-900 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center hover:bg-gold-500 hover:text-chocolate-900 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6 text-cream-50">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Our Menu', path: '/menu' },
                { name: 'Cart', path: '/cart' },
                { name: 'Track Order', path: '/track' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-cream-400 hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-4"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6 text-cream-50">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-cream-300 text-sm">
                    Swathi Road, Bhavanipuram,<br />Opp Sri Balaji Sweets
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gold-400" />
                </div>
                <a href="tel:+919876543210" className="text-cream-300 text-sm hover:text-gold-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gold-400" />
                </div>
                <a href="mailto:hello@deardesserts.com" className="text-cream-300 text-sm hover:text-gold-400 transition-colors">
                  hello@deardesserts.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6 text-cream-50">Opening Hours</h4>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <Clock className="w-5 h-5 text-gold-400" />
                <span className="text-cream-200 font-medium">We're Open</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between text-cream-400">
                  <span>Monday - Friday</span>
                  <span className="text-cream-200">10:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between text-cream-400">
                  <span>Saturday</span>
                  <span className="text-cream-200">9:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between text-cream-400">
                  <span>Sunday</span>
                  <span className="text-cream-200">9:00 AM - 10:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream-500 text-sm">
              © {currentYear} Dear Desserts. All rights reserved.
            </p>
            <p className="text-cream-500 text-sm flex items-center gap-1">
              Crafted with <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> for dessert lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
