import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SensoryLoader = ({ ON_LOAD_COMPLETE }) => {
  useEffect(() => {
    // Desvanecer automáticamente rápido pase lo que pase
    const timer = setTimeout(ON_LOAD_COMPLETE, 1200);
    return () => clearTimeout(timer);
  }, [ON_LOAD_COMPLETE]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[1000] bg-[#0d0d0d] flex flex-col items-center justify-center pointer-events-auto"
    >
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Flame className="text-[#FF4D4D]" size={48} />
      </motion.div>
    </motion.div>
  );
};

export default SensoryLoader;
