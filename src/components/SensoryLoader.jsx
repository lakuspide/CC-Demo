import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SensoryLoader = ({ ON_LOAD_COMPLETE }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Escuchar el evento de carga completa del navegador
    const handleLoad = () => {
      setProgress(100);
      setIsReady(true);
      setTimeout(ON_LOAD_COMPLETE, 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      
      // Fallback: Si tarda mucho, mostrar algo a los 5s para no bloquear
      const fallback = setTimeout(handleLoad, 5000);
      
      // Progreso simulado rápido hasta el 90%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 150);

      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallback);
        clearInterval(interval);
      };
    }
  }, [ON_LOAD_COMPLETE]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[1000] bg-[#0d0d0d] flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="relative w-full max-w-sm px-12 md:px-0">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative">
            <Flame className="text-[#FF4D4D]" size={64} />
            <div className="absolute inset-0 bg-[#FF4D4D]/20 blur-3xl rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-4 w-full text-center">
            <span className="font-['Montserrat'] font-black text-2xl text-white tracking-[0.2em]">
              {progress}%
            </span>
            <div className="h-[1px] w-full bg-white/10 overflow-hidden mt-4">
              <motion.div 
                className="h-full bg-[#FF4D4D]" 
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SensoryLoader;
