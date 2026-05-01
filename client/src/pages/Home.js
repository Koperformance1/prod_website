import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Ticker from './Ticker';

const Home = () => {
  const [backgroundImage, setBackgroundImage] = useState('url(images/IMG_4356.jpg)');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setBackgroundImage('url(images/mobile.jpg)');
      } else {
        setBackgroundImage('url(images/IMG_4356.jpg)');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-[77vh]">
      <motion.div
        className="relative h-[calc(100vh-50px)] bg-cover bg-center bg-no-repeat m-0 p-0 overflow-hidden"
        style={{
          backgroundImage: backgroundImage
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-end md:items-center p-4 md:p-8">
          <motion.div
            className="w-full max-w-[500px] p-6 bg-white
                       sm:p-8 sm:max-w-[450px]
                       md:ml-[5%] md:max-w-[400px]
                       lg:ml-[10%] lg:max-w-[450px]
                       mb-4 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-black">A Gym for Life.</h2>
            <p className="text-base sm:text-lg leading-relaxed text-black mb-3 sm:mb-4 justify-left">
              KO Performance is a premier, private gym where members train in a supportive and judgment-free environment designed to foster real progress.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-black font-bold underline">
              <Link to="/contact" className="text-black hover:text-gray-700 transition-colors">
                Explore Membership
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
      <Ticker />
    </div>
  );
};

export default Home;