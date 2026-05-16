import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Instagram, Coffee, Star } from 'lucide-react';

const About = () => {
  const fadeIn = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <div className="pt-0 min-h-screen bg-cream-50 overflow-hidden">
      {/* Hero */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=1600&q=80" alt="" className="w-full h-full object-cover opacity-8" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-50/60 via-cream-50 to-cream-50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center mt-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-600 mb-3">Our Story</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-chocolate-950 mb-4">
              Sweet Moments,{' '}<span className="gradient-text-gold italic">Made with Love</span>
            </h1>
            <p className="text-sm md:text-base text-chocolate-600 max-w-lg mx-auto font-light leading-relaxed">
              Your go-to destination for premium desserts, savouries, and endless good vibes in Bhavanipuram.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80" alt="Desserts" className="w-full h-[300px] md:h-[380px] object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-cream-200">
                <p className="font-display text-base font-bold text-chocolate-900">Premium</p>
                <p className="text-chocolate-500 text-xs font-medium">Dessert Cafe</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-chocolate-950">A Symphony of Flavors</h2>
              <div className="space-y-3 text-sm text-chocolate-600 leading-relaxed font-light">
                <p><strong className="font-semibold text-chocolate-800">Dear Desserts</strong> is a premium dessert cafe serving delicious waffles, brownies, cheesecakes, croissants, and refreshing popsicles.</p>
                <p>Crafted with high-quality ingredients and rich flavors, every item is made to deliver the perfect sweet experience.</p>
                <p>Whether you're looking for a quick bite or a place to enjoy desserts with friends, Dear Desserts is your ultimate destination.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 bg-chocolate-950 text-cream-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Coffee, title: 'Desserts & Savouries', desc: 'Sweet creations and savory bites for all your cravings.' },
              { icon: Star, title: 'Finest Ingredients', desc: 'High-quality ingredients for rich, unforgettable flavors.' },
              { icon: Clock, title: 'Fresh Daily', desc: 'Everything made fresh, every single day.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-400 border border-gold-500/20">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-display font-bold text-white">{item.title}</h3>
                <p className="text-cream-400 text-xs font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 md:py-16 bg-cream-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg border border-cream-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-chocolate-950 mb-1">Visit Us</h2>
                  <p className="text-chocolate-500 text-xs font-light">Drop by for a quick bite or stay for the vibes.</p>
                </div>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, title: 'Location', content: 'Swathi Theatre Rd, opposite Sri Balaji Sweets, Bhavanipuram, Vijayawada, AP 520012' },
                    { icon: Clock, title: 'Hours', content: 'Opens Daily at 6:00 PM' },
                    { icon: Phone, title: 'Contact', content: '+91 7396986817', href: 'tel:+917396986817' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cream-50 flex items-center justify-center flex-shrink-0 border border-chocolate-100">
                        <item.icon className="w-4 h-4 text-chocolate-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-chocolate-900 text-xs mb-0.5">{item.title}</h4>
                        {item.href ? (
                          <a href={item.href} className="text-chocolate-500 hover:text-gold-600 text-xs font-light transition-colors">{item.content}</a>
                        ) : (
                          <p className="text-chocolate-500 text-xs font-light leading-relaxed">{item.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Social Card */}
              <div className="bg-chocolate-950 rounded-xl p-6 text-center text-cream-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80')] bg-cover bg-center opacity-15"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-chocolate-950/80 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full p-0.5 mb-4">
                    <div className="w-full h-full bg-chocolate-950 rounded-full flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-bold mb-1 text-white">Follow Us</h3>
                  <p className="text-cream-400 text-xs font-light mb-5">@dear.desserts_</p>
                  <a href="https://www.instagram.com/dear.desserts_/" target="_blank" rel="noopener noreferrer"
                    className="bg-white text-chocolate-950 px-5 py-2.5 rounded-full font-bold text-xs hover:bg-gold-400 transition-colors shadow-md">
                    Follow on Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
