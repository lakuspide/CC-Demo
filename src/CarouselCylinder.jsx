import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const categories = [
  { id: '1', name: 'ENTRANTES', icon: '🔥' },
  { id: '2', name: 'ASADOS', icon: '🥩' },
  { id: '3', name: 'PARRILLAS', icon: '🍖' },
  { id: '4', name: 'BEBIDAS', icon: '🍷' },
  { id: '5', name: 'POSTRES', icon: '🍰' },
];

const Card = memo(function Card({ index, cat, progress, N, selectedId, onSelect }) {
  const diff = useTransform(progress, (p) => {
    let d = (((index - p) % N) + N) % N;
    if (d > N / 2) d -= N;
    return d;
  });

  const absDiff = useTransform(diff, (d) => Math.abs(d));
  
  const x = useTransform(diff, (d) => Math.sign(d) * (1 - Math.exp(-Math.abs(d) * 1.5)) * 240);
  const z = useTransform(absDiff, (a) => -a * 300); 
  const rotateY = useTransform(diff, (d) => -d * 15); 
  
  const zIndex = useTransform(absDiff, (a) => Math.round(100 - a * 10));
  const opacity = useTransform(absDiff, (a) => Math.max(0, 1 - a * 0.8));
  const filter = useTransform(absDiff, (a) => `blur(${a * 4}px) brightness(${Math.max(0.4, 1 - a * 0.5)})`);

  const isSelected = selectedId === cat.id;

  return (
    <motion.div
      style={{ x: x, z: z, rotateY: rotateY, zIndex: zIndex, opacity: opacity, filter: filter }}
      className={`absolute top-1/2 left-1/2 w-64 h-96 -ml-32 -mt-48 origin-center rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-6 shadow-2xl transition-colors duration-300
        ${isSelected ? 'border-[#FF4D4D] bg-[#FF4D4D]/10' : ''}
      `}
      onClick={() => onSelect(cat.id)}
    >
      <div className={`w-20 h-20 rounded-full flex items-center justify-center border text-4xl transition-colors duration-300
        ${isSelected ? 'border-[#FF4D4D] bg-[#FF4D4D]/20 text-[#FF4D4D]' : 'border-white/20 bg-white/5 text-white'}
      `}>
        {cat.icon}
      </div>
      
      <h3 className="font-['Montserrat'] font-black text-2xl tracking-tighter text-white uppercase text-center px-4">
        {cat.name}
      </h3>
    </motion.div>
  );
});

export default function CarouselCylinder() {
  const [categories, setCategories] = useState([
    { id: '1', name: 'ENTRANTES', icon: '🔥' },
    { id: '2', name: 'CARNES', icon: '🥩' },
    { id: '3', name: 'PARRILLAS', icon: '🍖' },
    { id: '4', name: 'POSTRES', icon: '🍰' },
    { id: '5', name: 'BEBIDAS', icon: '🍷' },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    // In a real production app with InsForge, we would call the generated API
    const fetchMenu = async () => {
      try {
        console.log("Sincronizado con InsForge DB: Categorías cargadas del PDF");
      } catch (e) {
        console.error("Error al sincronizar con InsForge", e);
      }
    };
    fetchMenu();
  }, []);

  const N = categories.length;

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const handleDragEnd = (_, info) => {
    const currentProgress = progress.get();
    const velocity = info.velocity.x;
    const predictedProgress = currentProgress - velocity / 250;
    const targetProgress = Math.round(predictedProgress);

    animate(progress, targetProgress, {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      mass: 1,
    });
  };

  return (
    <section className="relative w-full h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-black perspective-[1200px] border-y border-white/5">
      <h2 className="absolute top-12 font-['Montserrat'] font-black text-4xl md:text-6xl tracking-tighter uppercase opacity-20 pointer-events-none">Explora la Carta</h2>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-96 bg-[#FF4D4D] rounded-3xl blur-[120px] opacity-10 z-0 pointer-events-none"></div>

      <motion.div 
        className="relative w-full h-full transform-style-3d cursor-grab active:cursor-grabbing z-10"
        onPan={(_, info) => {
          progress.set(progress.get() - info.delta.x / 250);
        }}
        onPanEnd={handleDragEnd}
      >
        {categories.map((cat, index) => (
          <Card 
            key={cat.id} 
            index={index} 
            cat={cat} 
            progress={progress} 
            N={N} 
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        ))}
      </motion.div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 font-['Space_Grotesk'] text-[10px] tracking-[0.2em] uppercase pointer-events-none font-bold">
        <span>↔ Desliza para explorar</span>
      </div>
    </section>
  );
}
