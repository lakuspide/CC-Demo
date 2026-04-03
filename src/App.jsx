import React from 'react';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="fixed inset-0 bg-[#0d0d0d] flex items-center justify-center overflow-hidden">
      {/* Imagen de Fondo */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url('/coming-soon.png')`,
          filter: 'brightness(0.6)'
        }}
      />
      
      {/* Overlay de Gradiente */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/40" />

      {/* Contenido Coming Soon */}
      <div className="relative z-20 flex flex-col items-center text-center px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="space-y-4"
        >
          <span className="font-['Space_Grotesk'] text-[#FF4D4D] text-xs md:text-sm tracking-[0.6em] uppercase font-bold animate-pulse">
            El Ritual del Fuego
          </span>
          
          <h1 className="font-['Montserrat'] font-black text-6xl md:text-8xl text-white tracking-tighter leading-none">
            ASADO<br/>CENTRAL
          </h1>
          
          <div className="pt-12">
            <div className="inline-block px-8 py-3 border border-white/20 bg-white/5 backdrop-blur-md rounded-full">
              <span className="font-['Space_Grotesk'] text-white/40 text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold">
                Coming Soon
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Estático */}
      <div className="absolute bottom-12 left-0 w-full z-20 text-center">
        <p className="font-['Space_Grotesk'] text-[8px] md:text-[10px] text-white/20 tracking-[0.4em] uppercase font-bold">
          Madrid & Barcelona | Est. 1984
        </p>
      </div>
    </div>
  );
}

export default App;
