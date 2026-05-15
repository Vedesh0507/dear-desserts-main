import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Home, UtensilsCrossed, Phone, Info } from 'lucide-react';
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
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-cream-50/95 backdrop-blur-xl shadow-soft py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between relative min-h-[60px]">
          {/* Left: Circular Logo & Mobile Menu */}
          <div className="flex items-center gap-4 flex-1">
            <Link to="/" className="flex items-center group">
              <img
                src="/logo.png"
                alt="Dear Desserts"
                className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Center: Brand Text Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none w-full flex justify-center">
            <img 
              src="/brand.png" 
              alt="Dear Desserts" 
              className="h-8 md:h-12 w-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* Right: Navigation & Cart */}
          <div className="flex items-center justify-end gap-6 flex-1">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 font-medium text-sm tracking-wide transition-colors duration-300 hover-underline py-2 ${location.pathname === link.path
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
            
            <div className="flex items-center gap-3">
              {/* Call Button */}
              <a
                href="tel:+917396986817"
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-chocolate-600 hover:text-chocolate-800 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">Call Us</span>
              </a>

              {/* Cart Button */}
              <Link
                to="/cart"
                className={`relative p-2 md:p-3 rounded-full transition-all duration-300 ${isScrolled
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden p-2 rounded-full transition-colors ${isScrolled
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
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${location.pathname === link.path
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
