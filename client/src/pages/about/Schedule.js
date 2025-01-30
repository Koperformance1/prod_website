import React from 'react';
import { motion } from 'framer-motion';

function Schedule() {
  const operatingHours = [
    {
      day: 'Monday',
      type: '[Strength]',
      hours: [
        '6:00 AM - 6:30 AM',
        '6:30 AM - 6:45 AM',
        '9:00 AM - 10:30 AM',
        '10:30 AM - 11:30 AM (60+ / Low Impact)',
        '4:15 PM - 5:15 PM',
        '5:15 PM - 6:00 PM',
      ]
    },
    {
      day: 'Tuesday',
      type: '[Conditioning]',
      hours: [
        '6:00 AM - 6:30 AM',
        '6:30 AM - 9:00 AM',
        '9:00 AM - 10:30 AM',
        '9:00 AM - 10:30 AM',
        '10:30 AM - 11:30 AM (60+ / Low Impact)',
        '5:15 PM - 6:00 PM',
      ]
    },
    {
      day: 'Wednesday',
      type: '[Strength]',
      hours: [
        '6:00 AM - 6:30 AM',
        '6:30 AM - 6:45 AM',
        '9:00 AM - 10:30 AM',
        '10:30 AM - 11:30 AM (60+ / Low Impact)',
        '4:15 PM - 5:15 PM',
        '5:15 PM - 6:00 PM',
      ]
    },
    {
      day: 'Thursday',
      type: '[Conditioning]',
      hours: [
        '6:00 AM - 6:30 AM',
        '6:30 AM - 9:00 AM',
        '9:00 AM - 10:30 AM',
        '9:00 AM - 10:30 AM',
        '10:30 AM - 11:30 AM (60+ / Low Impact)',
        '5:15 PM - 6:00 PM',
      ]
    },
    {
      day: 'Friday',
      type: '[Strength]',
      hours: [
        '6:00 AM - 6:30 AM',
        '6:30 AM - 6:45 AM',
        '9:00 AM - 10:30 AM',
        '10:30 AM - 11:30 AM (60+ / Low Impact)',
        '4:15 PM - 5:15 PM',
        '5:15 PM - 6:00 PM',
      ]
    }
  ];

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
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-full grid grid-cols-5">
              {operatingHours.map((item, index) => (
                <motion.div
                  key={item.day}
                  className="text-center p-4 border border-gray-700 rounded-lg min-w-[300px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="font-semibold text-lg">{item.day}</h3>
                  <h4 className="mb-4 text-md">{item.type}</h4>
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

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {operatingHours.map((item, index) => (
              <motion.div
                key={item.day}
                className="text-center p-4 border border-gray-700 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-lg">{item.day}</h3>
                <h4 className="mb-4 text-md">{item.type}</h4>
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
      </section>
    </motion.div>
  );
}

export default Schedule;