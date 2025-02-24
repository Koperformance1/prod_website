import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

function Schedule() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
      setShowScrollIndicator(!bottom);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const strengthDays = [
    {
      day: 'MONDAY',
      hours: [
        '6:00 AM',
        '6:30 AM',
        '9:00 AM',
        '10:30 AM (60+ / Low Impact)',
        '4:15 PM',
        '5:15 PM',
        '6:00 PM',
      ]
    },
    {
      day: 'WEDNESDAY',
      hours: [
        '6:00 AM',
        '6:30 AM',
        '9:00 AM',
        '10:30 AM (60+ / Low Impact)',
        '4:15 PM',
        '5:15 PM',
        '6:00 PM',
      ]
    },
    {
      day: 'FRIDAY',
      hours: [
        '6:00 AM',
        '6:30 AM',
        '9:00 AM',
        '10:30 AM (60+ / Low Impact)',
        '4:15 PM',
        '5:15 PM',
        '6:00 PM',
      ]
    }
  ];

  const conditioningDays = [
    {
      day: 'TUESDAY',
      hours: [
        '6:00 AM',
        '6:30 AM',
        '9:00 AM',
        '10:30 AM (60+ / Low Impact)',
        '5:15 PM', 
        '6:00 PM'
      ]
    },
    {
      day: 'THURSDAY',
      hours: [
        '6:00 AM',
        '6:30 AM',
        '9:00 AM',
        '10:30 AM (60+ / Low Impact)',
        '5:15 PM', 
        '6:00 PM'
      ]
    },
    {
      day: 'SATURDAY',
      hours: [
        '8:30 AM',
      ]
    }
  ];

  const ScrollIndicator = () => (
    <>
      {showScrollIndicator && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden">
          <div className="bg-gray-800 rounded-full p-2 shadow-lg flex flex-col items-center">
            <span className="text-white text-xs mb-1">Scroll for more</span>
            <ChevronDown className="text-white w-4 h-4" />
          </div>
        </div>
      )}
    </>
  );

  return (
    <motion.div
      className="min-h-screen-1/2 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="text-white py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-white pt-4 mb-8">
            SMALL GROUP TRAINING SCHEDULE
          </h3>
          
          {/* Desktop View */}
          <div className="hidden md:block space-y-8">
            {/* Strength Days */}
            <div className="bg-black-900 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-4">STRENGTH TRAINING DAYS</h4>
              <div className="grid grid-cols-3 gap-4">
                {strengthDays.map((item, index) => (
                  <motion.div
                    key={item.day}
                    className="text-center p-4 border border-gray-700 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-semibold text-lg">{item.day}</h3>
                    <div className="space-y-2">
                      {item.hours.map((timeSlot, i) => (
                        <p key={i} className="text-white text-sm whitespace-normal">
                          {timeSlot}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Conditioning Days */}
            <div className="bg-black-900 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-4">CONDITIONING DAYS</h4>
              <div className="grid grid-cols-3 gap-4">
                {conditioningDays.map((item, index) => (
                  <motion.div
                    key={item.day}
                    className="text-center p-4 border border-gray-700 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-semibold text-lg">{item.day}</h3>
                    <div className="space-y-2">
                      {item.hours.map((timeSlot, i) => (
                        <p key={i} className="text-white text-sm whitespace-normal">
                          {timeSlot}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-8">
            {/* Strength Days Mobile */}
            <div className="bg-black-900 p-4 rounded-lg">
              <h4 className="text-lg text-center font-semibold mb-4">STRENGTH TRAINING DAYS</h4>
              <div className="space-y-4">
                {strengthDays.map((item, index) => (
                  <motion.div
                    key={item.day}
                    className="text-center p-4 border border-gray-700 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-semibold text-lg">{item.day}</h3>
                    <div className="space-y-2">
                      {item.hours.map((timeSlot, i) => (
                        <p key={i} className="text-white text-sm">
                          {timeSlot}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Conditioning Days Mobile */}
            <div className="bg-black-900 p-4 rounded-lg">
              <h4 className="text-lg text-center font-semibold mb-4">CONDITIONING DAYS</h4>
              <div className="space-y-4">
                {conditioningDays.map((item, index) => (
                  <motion.div
                    key={item.day}
                    className="text-center p-4 border border-gray-700 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-semibold text-lg">{item.day}</h3>
                    <div className="space-y-2">
                      {item.hours.map((timeSlot, i) => (
                        <p key={i} className="text-white text-sm">
                          {timeSlot}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
    </motion.div>
  );
}

export default Schedule;