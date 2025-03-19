import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const VisionAILanding = () => {
  const features = [
    {
      title: 'Face Shape Analysis',
      description: 'Determine your exact face shape using AI-powered measurements and advanced facial recognition.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: 'Eyewear Recommendations',
      description: 'Get personalized eyewear recommendations that complement your face shape and personal style.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: 'Virtual Try-On',
      description: 'Try on glasses virtually with our AR technology to see how they look before making a purchase.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Precise Measurements',
      description: 'Get accurate facial measurements to ensure the perfect fit for your next pair of glasses.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-24 md:pt-32 md:pb-32">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    New Vision AI
                  </h1>
                  <p className="text-xl md:text-2xl text-slate-300 mb-8">
                    Revolutionizing eyewear selection with advanced facial analysis technology
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                    >
                      <Link to="/analyze">Try Face Analysis</Link>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-transparent border border-blue-500 hover:bg-blue-500/10 rounded-lg font-medium"
                    >
                      <Link to="/register">Create Account</Link>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-80 h-80 md:w-96 md:h-96 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 overflow-hidden flex items-center justify-center">
                      <svg width="70%" height="70%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M50 10C30 10 20 30 20 50C20 70 30 90 50 90C70 90 80 70 80 50C80 30 70 10 50 10Z" 
                          stroke="#60A5FA"
                          strokeWidth="2"
                          strokeDasharray="1 3"
                        />
                        <circle cx="35" cy="40" r="5" stroke="#60A5FA" strokeWidth="2" fill="none" />
                        <circle cx="65" cy="40" r="5" stroke="#60A5FA" strokeWidth="2" fill="none" />
                        <path d="M42 60C45 65 55 65 58 60" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M30 75C35 83 65 83 70 75" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M30 25C35 17 65 17 70 25" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none" />
                      </svg>

                      {/* Animated scan line */}
                      <motion.div
                        className="absolute inset-x-0 h-1 bg-blue-500/50"
                        initial={{ y: "-50%" }}
                        animate={{ y: "150%" }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      />
                    </div>

                    {/* Measurement lines */}
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-px bg-blue-500/50">
                      <div className="absolute -top-3 -right-2 text-xs text-blue-400">68mm</div>
                    </div>
                    <div className="absolute top-1/3 right-1/4 h-1/3 w-px bg-blue-500/50">
                      <div className="absolute -top-3 -left-6 text-xs text-blue-400">52mm</div>
                    </div>

                    {/* Animated dots */}
                    <motion.div
                      className="absolute w-2 h-2 rounded-full bg-blue-500"
                      style={{ top: "40%", left: "35%" }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <motion.div
                      className="absolute w-2 h-2 rounded-full bg-blue-500"
                      style={{ top: "40%", right: "35%" }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Cutting-Edge Features
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Our AI-powered platform brings the latest advancements in computer vision and facial recognition to help you find the perfect eyewear.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-700/50 transition-colors"
            >
              <div className="bg-blue-600/20 p-3 rounded-lg w-fit mb-4">
                <div className="text-blue-400">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to experience the future of eyewear selection?</h2>
              <p className="text-slate-300 text-lg">
                Scan your face now and discover the perfect frames tailored to your unique features.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-lg">
                <Link to="/scan">Start Now</Link>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                New Vision AI
              </div>
              <p className="text-slate-400 mt-2">
                © {new Date().getFullYear()} New Vision AI. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VisionAILanding; 