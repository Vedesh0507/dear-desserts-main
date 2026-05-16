import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Home, UtensilsCrossed, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Menu', path: '/menu', icon: UtensilsCrossed },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-cream-50/95 backdrop-blur-xl shadow-sm py-2' : 'bg-transparent py-3'}`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between relative min-h-[48px]">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-1">
            <Link to="/" className="flex items-center group">
              <img src="/logo.png" alt="Dear Desserts" className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
            </Link>
          </div>

          {/* Center Brand */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <img src="/brand.png" alt="Dear Desserts" className="h-8 md:h-11 w-auto object-contain" />
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-4 flex-1">
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`relative flex items-center gap-1.5 font-medium text-xs tracking-wide transition-colors duration-200 hover-underline py-1.5 ${location.pathname === link.path ? 'text-chocolate-800' : 'text-chocolate-500 hover:text-chocolate-800'}`}>
                  <link.icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                  {location.pathname === link.path && (
                    <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                  )}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Link to="/cart" className={`relative p-2 rounded-full transition-all duration-200 ${isScrolled ? 'bg-chocolate-100 hover:bg-chocolate-200' : 'bg-chocolate-800/10 hover:bg-chocolate-800/20'}`}>
                <ShoppingCart className="w-4 h-4 text-chocolate-700" />
                {itemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-chocolate-900 text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {itemCount}
                  </motion.span>
                )}
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 rounded-full transition-colors ${isScrolled ? 'bg-chocolate-100 hover:bg-chocolate-200' : 'bg-chocolate-800/10 hover:bg-chocolate-800/20'}`}>
                {isOpen ? <X className="w-4 h-4 text-chocolate-700" /> : <Menu className="w-4 h-4 text-chocolate-700" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }} className="md:hidden overflow-hidden">
              <div className="py-4 space-y-1.5 border-t border-chocolate-100 mt-2">
                {navLinks.map((link, index) => (
                  <motion.div key={link.path} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                    <Link to={link.path}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${location.pathname === link.path ? 'bg-chocolate-800 text-cream-50' : 'text-chocolate-600 hover:bg-chocolate-100'}`}>
                      <link.icon className="w-4 h-4" /><span className="font-medium text-sm">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="pt-2">
                  <Link to="/menu" className="flex items-center justify-center gap-2 w-full bg-gold-500 hover:bg-gold-400 text-chocolate-950 py-3 rounded-xl font-bold text-sm transition-all">
                    Order Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
