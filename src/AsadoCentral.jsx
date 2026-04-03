import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, MapPin, Instagram, Facebook, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import CarouselCylinder from './CarouselCylinder';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-6 flex justify-between items-center ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent'}`}>
      <div className="flex items-center gap-2">
        <Flame className="text-[#FF4D4D]" size={24} />
        <span className="font-['Montserrat'] font-black text-xl tracking-tighter text-white">ASADO CENTRAL</span>
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <a href="#experiencia" className="font-['Space_Grotesk'] text-xs tracking-widest uppercase text-white/70 hover:text-[#FF4D4D] transition-colors">La Experiencia</a>
        <a href="#selección" className="font-['Space_Grotesk'] text-xs tracking-widest uppercase text-white/70 hover:text-[#FF4D4D] transition-colors">La Selección</a>
        <a href="#sedes" className="font-['Space_Grotesk'] text-xs tracking-widest uppercase text-white/70 hover:text-[#FF4D4D] transition-colors">Sedes</a>
        <a href="#reserva" className="bg-[#FF4D4D] px-6 py-2 rounded-full font-['Space_Grotesk'] text-[10px] font-bold tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all">Reservar</a>
      </div>
      <button className="md:hidden text-white">
        <div className="w-6 h-px bg-white mb-1.5"></div>
        <div className="w-6 h-px bg-white"></div>
      </button>
    </nav>
  );
};

export default function AsadoCentral() {
  const containerRef = useRef(null);
  const asmrVideoRef = useRef(null);
  const expVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Audio Activation & Smooth Fade-in
      ScrollTrigger.create({
        trigger: 'body',
        start: 'top 5%',
        onEnter: () => {
          if (asmrVideoRef.current && asmrVideoRef.current.muted) {
            asmrVideoRef.current.muted = false;
            asmrVideoRef.current.volume = 0;
            gsap.to(asmrVideoRef.current, { volume: 1, duration: 2 });
            setIsMuted(false);
          }
        },
        once: true
      });

      // VOLUME MAPPING: Fade out ASMR as we leave Hero
      gsap.to(asmrVideoRef.current, {
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            if (asmrVideoRef.current && !isMuted) {
              asmrVideoRef.current.volume = 1 - self.progress;
            }
          }
        }
      });

      // Video Cross-fade (ASMR to Experience)
      ScrollTrigger.create({
        trigger: '#experiencia',
        start: 'top 80%',
        end: 'top 20%',
        scrub: true,
        onEnter: () => {
          gsap.to(asmrVideoRef.current, { opacity: 0, duration: 1 });
          gsap.to(expVideoRef.current, { opacity: 1, duration: 1 });
          if (expVideoRef.current) expVideoRef.current.play().catch(() => {});
        },
        onLeaveBack: () => {
          gsap.to(asmrVideoRef.current, { opacity: 1, duration: 1 });
          gsap.to(expVideoRef.current, { opacity: 0, duration: 1 });
        }
      });

      gsap.utils.toArray('.floating-item').forEach((el) => {
        gsap.to(el, {
          y: -50,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      });

      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%'
          }
        });
      });

      gsap.from('.cut-card', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cuts-grid',
          start: 'top 75%'
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleSound = () => {
    const v = asmrVideoRef.current;
    if (v) {
      v.muted = !v.muted;
      setIsMuted(v.muted);
    }
  };

  return (
    <div ref={containerRef} className="text-white min-h-screen font-['Manrope'] overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .misty-gradient {
          background: linear-gradient(135deg, #96ccff 0%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .grain-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 999; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .global-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          object-fit: cover;
        }

        .global-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: linear-gradient(to bottom, rgba(13, 13, 13, 0.4) 0%, rgba(13, 13, 13, 0.8) 100%);
          pointer-events: none;
        }

        .ember-glow {
          box-shadow: 0 0 40px rgba(255, 77, 77, 0.15);
        }

        .glassmorphic-celeste-text {
          color: rgba(116, 172, 223, 0.15);
          -webkit-text-stroke: 1.5px rgba(116, 172, 223, 0.8);
          mix-blend-mode: color-dodge;
          text-shadow: 
            0 0 30px rgba(116, 172, 223, 0.4),
            0 0 10px rgba(116, 172, 223, 0.2);
          position: relative;
        }
        
        .sound-btn {
          position: fixed;
          bottom: 40px;
          right: 40px;
          z-index: 100;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sound-btn:hover {
          background: rgba(255, 77, 77, 0.2);
          border-color: #FF4D4D;
          transform: scale(1.1);
        }

        .wave-container {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .wave {
          width: 2px;
          height: 12px;
          background: #FF4D4D;
          animation: wave-anim 1s ease-in-out infinite alternate;
        }

        @keyframes wave-anim {
          0% { height: 4px; }
          100% { height: 16px; }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #FF4D4D; border-radius: 10px; }
      `}} />

      <div className="grain-overlay"></div>
      <video 
        ref={asmrVideoRef}
        autoPlay 
        muted 
        loop 
        playsInline 
        className="global-bg"
      >
        <source src="/asado-asmr.mp4" type="video/mp4" />
      </video>
      <video 
        ref={expVideoRef}
        muted 
        loop 
        playsInline 
        style={{ opacity: 0 }}
        className="global-bg"
      >
        <source src="/The_Smoky_Tira_de_Asado_version_1.mp4" type="video/mp4" />
      </video>
      <div className="global-overlay"></div>
      <Navbar />

      <button className="sound-btn" onClick={toggleSound}>
        {isMuted ? (
          <VolumeX size={24} className="text-white/50" />
        ) : (
          <div className="wave-container">
            <div className="wave" style={{animationDelay: '0s'}}></div>
            <div className="wave" style={{animationDelay: '0.2s'}}></div>
            <div className="wave" style={{animationDelay: '0.4s'}}></div>
            <Volume2 size={20} className="text-[#FF4D4D] ml-1" />
          </div>
        )}
      </button>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden hero-section z-10">
        <div className="relative z-20 text-center px-4 w-full max-w-5xl">
          <p className="font-['Space_Grotesk'] text-[#FF4D4D] text-xs md:text-sm tracking-[0.5em] uppercase mb-6 reveal-up font-bold">El Ritual del Fuego | Est. 1984</p>
          
          <h1 className="font-['Montserrat'] font-bold text-6xl md:text-[130px] tracking-tighter leading-none mb-12 reveal-up glassmorphic-celeste-text">
            ASADO<br/>
            CENTRAL
          </h1>

          <a href="#selección" className="group relative inline-flex items-center justify-center pl-10 pr-2 py-2 overflow-hidden rounded-full reveal-up mt-8">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-full transition-all duration-500 group-hover:bg-[#FF4D4D]/10 group-hover:border-[#FF4D4D]/50 group-hover:shadow-[0_0_40px_rgba(255,77,77,0.3)]"></div>
            
            <span className="relative z-10 font-['Space_Grotesk'] text-white/70 font-bold text-[10px] tracking-[0.4em] uppercase transition-colors duration-500 group-hover:text-white">
              Toca para Entrar
            </span>
            
            <div className="relative z-10 ml-8 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 transition-all duration-500 group-hover:bg-[#FF4D4D] group-hover:border-[#FF4D4D] group-hover:translate-x-1">
              <ArrowRight size={16} className="text-white" />
            </div>
          </a>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-50">
          <div className="w-px h-12 bg-white/30"></div>
          <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* LA EXPERIENCIA */}
      <section id="experiencia" className="py-24 md:py-40 px-6 md:px-12 z-10 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 bg-black/40 p-8 md:p-12 rounded-[40px] backdrop-blur-sm border border-white/5 floating-item">
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
               <img src="https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100" alt="Parrilla tradicional" />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-8">
            <h2 className="font-['Montserrat'] font-black text-4xl md:text-6xl text-white uppercase tracking-tighter reveal-up">
              No es solo <br/> una cena
            </h2>
            <p className="font-['Cormorant_Garamond'] italic text-3xl md:text-4xl text-white/40 leading-tight reveal-up">
              "La tradición argentina, elevada en el corazón de España."
            </p>
            <p className="text-lg text-white/60 font-light leading-relaxed reveal-up">
              En Asado Central, respetamos la nobleza del producto. Cada corte es seleccionado a mano y sometido al dominio absoluto del fuego. No hay atajos, solo paciencia y brasas.
            </p>
          </div>
        </div>
      </section>

      {/* ARCO 3D - CARTA INTERACTIVA */}
      <CarouselCylinder />

      {/* LA SELECCIÓN (MENU GRID) */}
      <section id="selección" className="py-24 md:py-40 px-6 md:px-12 z-10 relative text-center">
        <div className="max-w-7xl mx-auto mb-20 space-y-4 reveal-up">
          <p className="font-['Space_Grotesk'] text-[#FF4D4D] text-xs tracking-[0.4em] uppercase font-bold">The Prime Cuts</p>
          <h2 className="font-['Montserrat'] font-black text-5xl md:text-7xl">LA SELECCIÓN</h2>
        </div>

        <div className="cuts-grid grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            { name: "Ojo de Bife", desc: "400g de centro de lomo alto madurado.", price: "34€", img: "https://images.pexels.com/photos/361184/pexels-photo-361184.jpeg" },
            { name: "Entraña Fina", desc: "Corte de culto, intenso y jugoso.", price: "28€", img: "https://images.pexels.com/photos/7613568/pexels-photo-7613568.jpeg" },
            { name: "Costillar", desc: "6 horas a fuego lento, se desprende solo.", price: "42€", img: "https://images.pexels.com/photos/361184/pexels-photo-361184.jpeg" }
          ].map((item, idx) => (
            <div key={idx} className="cut-card group bg-black/60 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-[#FF4D4D]/30 transition-all duration-500 floating-item">
              <div className="relative aspect-square overflow-hidden">
                <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={item.name} />
                <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                   <span className="font-['Montserrat'] font-black text-sm">{item.price}</span>
                </div>
              </div>
              <div className="p-8 space-y-4 text-left">
                <h3 className="font-['Montserrat'] font-black text-2xl uppercase tracking-tighter">{item.name}</h3>
                <p className="text-white/50 font-light text-sm leading-relaxed">{item.desc}</p>
                <div className="pt-4 flex items-center justify-between">
                   <span className="font-['Space_Grotesk'] text-[10px] text-[#FF4D4D] tracking-widest uppercase font-bold">Reserva Recomendada</span>
                   <ArrowRight className="text-white/20 group-hover:text-[#FF4D4D] transition-colors" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEDES */}
      <section id="sedes" className="py-24 md:py-40 px-6 md:px-12 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 bg-black/40 backdrop-blur-md p-12 rounded-[50px] border border-white/10 floating-item">
          <div className="flex-1 space-y-12">
            <h2 className="font-['Montserrat'] font-black text-5xl md:text-8xl tracking-tighter reveal-up">MADRID</h2>
            <div className="space-y-4 reveal-up">
              <div className="flex items-center gap-4 text-white/50 text-sm">
                <MapPin size={16} className="text-[#FF4D4D]" /> Calle de Jorge Juan, 14
              </div>
              <p className="text-white/60 max-w-sm font-medium">En el corazón del Barrio de Salamanca, donde el lujo se rinde ante la brasa auténtica.</p>
            </div>
          </div>
          <div className="w-px bg-white/10 hidden md:block"></div>
          <div className="flex-1 space-y-12 md:pl-12">
            <h2 className="font-['Montserrat'] font-black text-5xl md:text-8xl tracking-tighter reveal-up">BARCELONA</h2>
            <div className="space-y-4 reveal-up">
              <div className="flex items-center gap-4 text-white/50 text-sm">
                <MapPin size={16} className="text-[#FF4D4D]" /> Passeig de Gràcia, 92
              </div>
              <p className="text-white/60 max-w-sm font-medium">Elevando el asado en la zona más prestigiosa de la Ciudad Condal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RESERVAS */}
      <section id="reserva" className="py-24 md:py-40 px-6 md:px-12 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto relative z-10 bg-black/60 backdrop-blur-xl p-12 rounded-[60px] border border-white/20 shadow-2xl floating-item">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-['Montserrat'] font-black text-5xl md:text-8xl reveal-up">ASEGURA TU LUGAR</h2>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-12 reveal-up">
            <div className="space-y-2">
              <label className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-[#FF4D4D] font-bold">Tu Nombre</label>
              <input type="text" className="w-full bg-white/5 border-b border-white/20 px-0 py-4 text-white focus:outline-none focus:border-[#FF4D4D] transition-colors" placeholder="Nombre completo" />
            </div>
            <div className="space-y-2">
              <label className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-[#FF4D4D] font-bold">Email de Contacto</label>
              <input type="email" className="w-full bg-white/5 border-b border-white/20 px-0 py-4 text-white focus:outline-none focus:border-[#FF4D4D] transition-colors" placeholder="email@ejemplo.com" />
            </div>
            <div className="space-y-2">
              <label className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-[#FF4D4D] font-bold">Ubicación</label>
              <select className="w-full bg-white/5 border-b border-white/20 px-0 py-4 text-white focus:outline-none focus:border-[#FF4D4D] transition-colors appearance-none">
                <option className="bg-[#131313]">Selecciona Sede</option>
                <option className="bg-[#131313]">Madrid - Jorge Juan</option>
                <option className="bg-[#131313]">Barcelona - Passeig de Gràcia</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-[#FF4D4D] font-bold">Comensales</label>
              <select className="w-full bg-white/5 border-b border-white/20 px-0 py-4 text-white focus:outline-none focus:border-[#FF4D4D] transition-colors appearance-none">
                <option className="bg-[#131313]">1-2 Personas</option>
                <option className="bg-[#131313]">3-4 Personas</option>
                <option className="bg-[#131313]">5+ Personas (Grupo)</option>
              </select>
            </div>
            <button className="md:col-span-2 w-full bg-[#FF4D4D] py-6 rounded-2xl font-['Montserrat'] font-black text-xl md:text-2xl uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 ember-glow">
              Confirmar mi Mesa
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-2">
            <Flame className="text-[#FF4D4D]" size={32} />
            <span className="font-['Montserrat'] font-black text-3xl tracking-tighter">ASADO CENTRAL</span>
          </div>
          <div className="flex gap-8">
            <Instagram size={24} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
            <Facebook size={24} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
          </div>
          <p className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.4em] text-white/20 text-center md:text-right">
            © {new Date().getFullYear()} Asado Central. <br/> "El dominio del fuego."
          </p>
        </div>
      </footer>
    </div>
  );
}
