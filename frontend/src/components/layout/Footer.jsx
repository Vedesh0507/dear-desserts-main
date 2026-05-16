import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Mail, Heart, Clock, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-chocolate-950 text-cream-100 relative overflow-hidden">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="font-display text-base font-bold text-cream-50 mb-0.5">Stay Sweet with Updates</h3>
              <p className="text-cream-400 text-xs">Get exclusive offers and new dessert announcements</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input type="email" placeholder="Enter your email"
                className="flex-1 md:w-56 px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-cream-50 placeholder-cream-500 focus:outline-none focus:border-gold-500 transition-all text-xs" />
              <button className="px-4 py-2.5 bg-gold-500 text-chocolate-900 rounded-full font-bold text-xs hover:bg-gold-400 transition-all flex items-center gap-1 whitespace-nowrap">
                Subscribe <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cream-50 rounded-xl p-1.5 flex items-center justify-center">
                <img src="/logo.png" alt="Dear Desserts" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-display text-sm font-bold block text-cream-50">Dear Desserts</span>
                <span className="text-gold-400 text-[10px] font-medium">Love at First Bite</span>
              </div>
            </div>
            <p className="text-cream-400 text-[11px] leading-relaxed">
              Crafting sweet memories with passion and the finest ingredients.
            </p>
            <div className="flex gap-2">
              {[
                { href: 'https://instagram.com', icon: Instagram },
                { href: 'https://facebook.com', icon: Facebook },
              ].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-chocolate-900 transition-all duration-300">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-xs font-bold mb-4 text-cream-50 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[{ name: 'Home', path: '/' }, { name: 'Our Menu', path: '/menu' }, { name: 'Cart', path: '/cart' }, { name: 'Track Order', path: '/track' }].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-cream-400 hover:text-gold-400 transition-colors text-xs flex items-center gap-1.5 group">
                    <span className="w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-3"></span>{link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xs font-bold mb-4 text-cream-50 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-3.5 h-3.5 text-gold-400" /></div>
                <p className="text-cream-400 text-[11px]">Swathi Road, Bhavanipuram,<br />Opp Sri Balaji Sweets</p>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center"><Phone className="w-3.5 h-3.5 text-gold-400" /></div>
                <a href="tel:+917396986817" className="text-cream-400 text-[11px] hover:text-gold-400 transition-colors">+91 73969 86817</a>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center"><Mail className="w-3.5 h-3.5 text-gold-400" /></div>
                <a href="mailto:hello@deardesserts.com" className="text-cream-400 text-[11px] hover:text-gold-400 transition-colors">hello@deardesserts.com</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-xs font-bold mb-4 text-cream-50 uppercase tracking-wider">Opening Hours</h4>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-cream-200 text-[11px] font-medium">We're Open</span>
              </div>
              <ul className="space-y-2 text-[11px]">
                <li className="flex justify-between text-cream-400"><span>Mon - Fri</span><span className="text-cream-200">10 AM - 10 PM</span></li>
                <li className="flex justify-between text-cream-400"><span>Saturday</span><span className="text-cream-200">9 AM - 11 PM</span></li>
                <li className="flex justify-between text-cream-400"><span>Sunday</span><span className="text-cream-200">9 AM - 10 PM</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-cream-500 text-[10px]">&copy; {currentYear} Dear Desserts. All rights reserved.</p>
            <p className="text-cream-500 text-[10px] flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> for dessert lovers
            </p>
          </div>
        </div>
      </div>

      {/* Built by credit */}
      <div className="border-t border-white/10 bg-chocolate-950">
        <div className="container mx-auto px-4 py-3 text-center">
          <p className="text-cream-400 text-[11px]">
            Built by{' '}
            <a href="https://uxitech.in" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors font-semibold underline underline-offset-2">
              uxitech.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
