import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SensoryLoader = ({ ON_LOAD_COMPLETE }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5s simulated loading for heavy assets
    const interval = 20;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(ON_LOAD_COMPLETE, 500);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [ON_LOAD_COMPLETE]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "circIn" } }}
      className="fixed inset-0 z-[1000] bg-[#0d0d0d] flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="relative w-full max-w-sm px-12 md:px-0">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative">
            <Flame className="text-[#FF4D4D] animate-pulse" size={64} />
            <div className="absolute inset-0 bg-[#FF4D4D]/20 blur-2xl rounded-full"></div>
          </div>
          
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-end">
              <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.5em] text-white/40">Iniciando el Fuego</span>
              <span className="font-['Montserrat'] font-black text-xl text-white">{Math.round(progress)}%</span>
            </div>
            
            <div className="h-[2px] w-full bg-white/5 overflow-hidden">
              <motion.div 
                className="h-full bg-[#FF4D4D]" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <p className="font-['Cormorant_Garamond'] italic text-white/30 text-lg">
            La paciencia es el ingrediente secreto.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-12 flex items-center gap-4">
        <div className="w-8 h-[1px] bg-[#FF4D4D]/40"></div>
        <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-[#FF4D4D]/60 font-bold">Asado Central | Est. 1984</span>
      </div>
    </motion.div>
  );
};

export default SensoryLoader;
