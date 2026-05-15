import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Instagram, Heart, Coffee, Star, Sparkles } from 'lucide-react';

const About = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="pt-0 min-h-screen bg-cream-50 overflow-hidden selection:bg-gold-500/30">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=1600&q=80" 
            alt="Café Interior" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-50/50 via-cream-50 to-cream-50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center mt-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-6 bg-gold-100 text-gold-700 border border-gold-200">
              <Heart className="w-4 h-4" /> Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-chocolate-950 mb-6">
              Sweet Moments <br />
              <span className="gradient-text-gold italic">Made with Love 💖</span>
            </h1>
            <p className="text-lg md:text-xl text-chocolate-600 max-w-2xl mx-auto font-light">
              Cravings start here! Welcome to your go-to destination for premium desserts, savouries, and endless good vibes in Bhavanipuram.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
               <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80" 
                   alt="Desserts Selection" 
                   className="w-full h-[500px] object-cover"
                 />
                 <div className="absolute inset-0 border-[4px] border-white/20 rounded-[2rem] pointer-events-none"></div>
               </div>
               {/* Floating Element */}
               <div className="absolute -bottom-8 -right-8 glass bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white">
                 <p className="font-display text-2xl font-bold text-chocolate-900">Premium</p>
                 <p className="text-chocolate-600 font-medium tracking-wide">Dessert Café</p>
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-chocolate-950">
                A Symphony of <br/> Flavors
              </h2>
              <div className="space-y-4 text-lg text-chocolate-600 leading-relaxed font-light">
                <p>
                  <strong className="font-semibold text-chocolate-800">Dear Desserts</strong> is a premium dessert café serving delicious waffles, brownies, cheesecakes, croissants, and refreshing popsicles. 
                </p>
                <p>
                  Crafted with high-quality ingredients and rich flavors, every item is made to deliver the perfect sweet experience. From chocolate-loaded waffles and signature brownies to savory snacks like fries, wings, and lasagna, we offer something for every craving. 
                </p>
                <p>
                  Whether you're looking for a quick bite, a hangout spot, or a place to enjoy desserts with friends, Dear Desserts is your ultimate destination. 
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features/Highlights */}
      <section className="py-24 bg-chocolate-950 text-cream-50 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1200&q=30')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
         <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="grid md:grid-cols-3 gap-12 text-center">
               <motion.div initial={{ opacity:0, y:30 }} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-full flex items-center justify-center text-gold-400 border border-gold-500/30 shadow-lg">
                    <Coffee className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">Desserts & Savouries</h3>
                  <p className="text-cream-300 font-light">A perfect balance of sweet creations and savory bites to satisfy all your daily cravings.</p>
               </motion.div>
               <motion.div initial={{ opacity:0, y:30 }} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-full flex items-center justify-center text-gold-400 border border-gold-500/30 shadow-lg">
                    <Star className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">Finest Ingredients</h3>
                  <p className="text-cream-300 font-light">Meticulously crafted with high-quality ingredients for rich, unforgettable flavors in every bite.</p>
               </motion.div>
               <motion.div initial={{ opacity:0, y:30 }} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.4}} className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-full flex items-center justify-center text-gold-400 border border-gold-500/30 shadow-lg">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">Good Vibes Only</h3>
                  <p className="text-cream-300 font-light">The perfect aesthetic hangout spot for you and your friends to create sweet memories.</p>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Location & Contact Details */}
      <section className="py-24 bg-cream-50 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-chocolate-900/5 relative overflow-hidden border border-cream-100">
            {/* Background Texture */}
             <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-cream-100 to-transparent opacity-50 blur-3xl rounded-full"></div>
             
             <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-10">
                  <div>
                    <h2 className="text-4xl font-display font-bold text-chocolate-950 mb-3">Visit Us</h2>
                    <p className="text-chocolate-600 font-light text-lg">Drop by for a quick bite or stay for the good vibes. We can't wait to serve you!</p>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-cream-50 flex items-center justify-center flex-shrink-0 border border-chocolate-100 shadow-sm">
                        <MapPin className="w-6 h-6 text-chocolate-800" />
                      </div>
                      <div>
                        <h4 className="font-bold text-chocolate-900 mb-2 text-lg">Location</h4>
                        <p className="text-chocolate-600 font-light text-base leading-relaxed">
                          Swathi Theatre Rd, opposite Sri Balaji Sweets,<br />
                          Bhavanipuram, V D Puram,<br />
                          Vijayawada, Andhra Pradesh 520012
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-cream-50 flex items-center justify-center flex-shrink-0 border border-chocolate-100 shadow-sm">
                        <Clock className="w-6 h-6 text-chocolate-800" />
                      </div>
                      <div>
                        <h4 className="font-bold text-chocolate-900 mb-2 text-lg">Operating Hours</h4>
                        <p className="text-chocolate-600 font-light text-base">
                          Opens Daily at 6:00 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-cream-50 flex items-center justify-center flex-shrink-0 border border-chocolate-100 shadow-sm">
                        <Phone className="w-6 h-6 text-chocolate-800" />
                      </div>
                      <div>
                        <h4 className="font-bold text-chocolate-900 mb-2 text-lg">Contact Us</h4>
                        <a href="tel:+917396986817" className="text-chocolate-600 hover:text-gold-600 font-medium transition-colors text-base">
                          +91 7396986817
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Card */}
                <div className="bg-chocolate-950 rounded-[2.5rem] p-8 text-center text-cream-50 relative overflow-hidden group shadow-2xl h-full flex flex-col justify-center">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700 scale-105 group-hover:scale-100"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-chocolate-950/80 to-transparent"></div>
                   
                   <div className="relative z-10 flex flex-col items-center">
                      <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full p-1 mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                        <div className="w-full h-full bg-chocolate-950 rounded-full flex items-center justify-center">
                          <Instagram className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-display font-bold mb-2 text-white">Join Our Community</h3>
                      <p className="text-cream-300 font-light mb-8 text-lg">@dear.desserts_</p>
                      <a 
                        href="https://www.instagram.com/dear.desserts_/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-chocolate-950 px-8 py-4 rounded-full font-bold hover:bg-gold-400 transition-colors shadow-lg flex items-center gap-2"
                      >
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
