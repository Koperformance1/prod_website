import React from 'react';
import { motion } from 'framer-motion';

const Ticker = () => {
    const tickerText =  "KO PERFORMANCE • FUNCTIONAL FITNESS • KO PERFORMANCE • FUNCTIONAL FITNESS • KO PERFORMANCE • FUNCTIONAL FITNESS • KO PERFORMANCE • FUNCTIONAL FITNESS • KO PERFORMANCE • FUNCTIONAL FITNESS • KO PERFORMANCE • FUNCTIONAL FITNESS • KO PERFORMANCE • FUNCTIONAL FITNESS • KO PERFORMANCE • FUNCTIONAL FITNESS • KO PERFORMANCE • FUNCTIONAL FITNESS • KO PERFORMANCE • FUNCTIONAL FITNESS";

  // Duplicate the text to ensure smooth infinite scroll
  const repeatedText = `${tickerText} ${tickerText}`;
  
  return (
    <div style={styles.tickerContainer}>
      <motion.div
        style={styles.ticker}
        animate={{
          x: [0, -1000], // Adjust this value based on your text length
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {repeatedText}
      </motion.div>
    </div>
  );
};

const styles = {
  tickerContainer: {
    width: '100%',
    height: '50px',
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  ticker: {
    whiteSpace: 'nowrap',
    color: '#ffffff',
    fontSize: '1.2rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  }
};

export default Ticker;