import React from 'react';
import { motion } from 'framer-motion';

function Staff() {
  const teamMembers = [
    {
      name: "Kevin O'Callahan MS, PES",
      role: "Owner, Strength and Conditioning Coach",
      image: "../images/img-5706-2-square_2_orig.jpg",
      bio: "Kevin is a strength and conditioning coach with a Master's degree in exercise science, specializing in performance enhancement and injury prevention. He takes a movement-based approach to fitness, training the body as an integrated whole and tailoring each program to meet the specific needs of his clients."
    },
    {
      name: "JEFF ANSLEY CSCS",
      role: "Strength and Conditioning Coach",
      image: "/images/img-3450-1-square_1_orig.jpg",
      bio: "Jeff is an NSCA Certified Strength and Conditioning Specialist dedicated to helping individuals prioritize their health and fitness. With over 20 years of training experience and a background as a competitive college athlete, marathon runner, and Ironman triathlete, Jeff combines expertise with firsthand experience. His comprehensive knowledge and passion for fitness make him the ideal partner to guide you in achieving your goals."
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-black py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Page Header */}
      <h3 className="text-4xl font-bold text-center text-white mb-8">STAFF</h3>
      {/* Team Members Section */}
      <div className="container mx-auto px-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            className={`flex flex-col md:flex-row items-center mb-24 last:mb-0 ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            {/* Profile Image */}
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <div className="relative rounded-lg overflow-hidden shadow-xl aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Bio Content */}
            <div className={`w-full md:w-2/3 ${
              index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'
            }`}>
              <h2 className="text-3xl text-white font-bold mb-2">{member.name}</h2>
              <h3 className="text-xl text-white mb-6">{member.role}</h3>
              <p className="text-white mb-6 leading-relaxed">
                {member.bio}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Staff;