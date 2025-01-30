import React from 'react';
import { motion } from 'framer-motion';

function Facility() {
  const contentSections = [
    {
      image: '../images/trx.jpg',
      title: 'Our Approach',
      text: 'At KO Performance, we use scientifically proven methods to deliver optimal results. Whether your goals include weight loss, strength building, improved endurance, or better posture, we are committed to helping you achieve them.',
      imageLeft: true
    },
    {
      image: '../images/cables.jpg',
      title: 'Facility',
      text: 'Using proven training equipment, KO Performance is equipped with the tools to help you achieve your goals while offering enough variety to keep your workouts engaging.',
      imageLeft: false
    },
    {
      image: '../images/kettlebells.jpg',
      title: 'Expert Coaching',
      text: 'Our coaches bring years of experience and specialized knowledge to every session. We focus on developing not just physical strength, but mental toughness and proper technique.',
      imageLeft: true
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
        <h3 className="text-4xl font-bold text-center text-white mb-8">
          FACILITY
        </h3>
          {contentSections.map((section, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${
                section.imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center mb-24 last:mb-0`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 mb-8 md:mb-0 text-white">
                <img
                  src={section.image}
                  alt={section.title}
                  className="rounded-lg shadow-xl object-cover w-full h-full"
                />
              </div>

              {/* Text Content */}
              <div className={`w-full md:w-1/2 ${
                section.imageLeft ? 'md:pl-12' : 'md:pr-12'
              }`}>
                <h2 className="text-3xl text-white font-bold mb-6">{section.title}</h2>
                <p className="text-white leading-relaxed text-lg">
                  {section.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default Facility;