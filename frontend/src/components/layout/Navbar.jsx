import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Home, UtensilsCrossed, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Menu', path: '/menu', icon: UtensilsCrossed },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-cream-50/95 backdrop-blur-xl shadow-soft py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Dear Desserts" 
                className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:block">
              <span
                className={`font-display text-xl font-bold block leading-tight tracking-tight transition-colors duration-300 ${
                  isScrolled ? 'text-chocolate-800' : 'text-chocolate-800'
                }`}
              >
                Dear Desserts
              </span>
              <span className="text-xs text-gold-600 font-medium tracking-wide">Love at First Bite</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-2 font-medium text-sm tracking-wide transition-colors duration-300 hover-underline py-2 ${
                  location.pathname === link.path
                    ? 'text-chocolate-800'
                    : 'text-chocolate-500 hover:text-chocolate-800'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Call Button - Desktop */}
            <a
              href="tel:+919000000000"
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-chocolate-600 hover:text-chocolate-800 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>

            {/* Cart Button */}
            <Link
              to="/cart"
              className={`relative p-3 rounded-full transition-all duration-300 ${
                isScrolled 
                  ? 'bg-chocolate-100 hover:bg-chocolate-200' 
                  : 'bg-chocolate-800/10 hover:bg-chocolate-800/20'
              }`}
            >
              <ShoppingCart className={`w-5 h-5 ${isScrolled ? 'text-chocolate-700' : 'text-chocolate-700'}`} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-chocolate-900 text-xs font-bold rounded-full flex items-center justify-center shadow-sm"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Order Now Button - Desktop */}
            <Link
              to="/menu"
              className="hidden md:flex btn-gold text-sm px-6 py-2.5"
            >
              Order Now
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-3 rounded-full transition-colors ${
                isScrolled 
                  ? 'bg-chocolate-100 hover:bg-chocolate-200' 
                  : 'bg-chocolate-800/10 hover:bg-chocolate-800/20'
              }`}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-chocolate-700" />
              ) : (
                <Menu className="w-5 h-5 text-chocolate-700" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-6 space-y-2 border-t border-chocolate-100 mt-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                        location.pathname === link.path
                          ? 'bg-chocolate-800 text-cream-50'
                          : 'text-chocolate-600 hover:bg-chocolate-100'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-4"
                >
                  <Link
                    to="/menu"
                    className="flex items-center justify-center gap-2 w-full btn-gold py-4"
                  >
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
