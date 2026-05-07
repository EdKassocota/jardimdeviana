import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';

export function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2070&auto=format&fit=crop")',
            y 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/50 via-brand-black/80 to-brand-black" />
        
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            src="/logo.png" 
            alt="Logo Jardim de Viana" 
            className="w-24 md:w-32 mb-10"
          />
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[10px] tracking-[0.3em] uppercase text-brand-orange mb-6"
          >
            Restaurante & Lounge
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 font-light"
          >
            Uma Experiência <br />
            <span className="italic font-serif text-brand-white/80">Inesquecível</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 mt-4"
          >
            <Link to="/reserva" className="bg-brand-orange text-black font-bold uppercase tracking-[0.2em] text-xs py-4 px-10 hover:bg-[#D66D1D] transition-colors">
              Reservar Mesa
            </Link>
            <Link to="/menu" className="border border-subtle hover:border-brand-orange hover:text-brand-orange text-white uppercase tracking-[0.2em] text-xs py-4 px-10 transition-colors">
              Ver Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Prato do Dia / Especialidade */}
      <section className="py-32 px-6 md:px-10 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-[3/4] w-full group overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop" 
              alt="Prato do dia" 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted mb-4">Especialidade da Casa</span>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-6">Polvo à Lagareiro <span className="italic font-serif text-brand-orange">Premium</span></h2>
            <p className="text-muted leading-relaxed text-sm max-w-md mb-10">
              Uma interpretação contemporânea de um clássico intemporal. Polvo do Atlântico assado a baixa temperatura, acompanhado de batatas a murro, azeite extra virgem e toques de alho negro. Uma ode à gastronomia costeira servida com requinte exclusivo.
            </p>
            <Link to="/reserva" className="text-xs uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2 hover:opacity-80 w-fit pb-1 border-b border-brand-orange/30 hover:border-brand-orange transition-colors">
              Garantir Experiência <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Ambiente & Lounge */}
      <section className="py-32 bg-white/5 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row-reverse gap-20 items-center">
          <div className="relative aspect-square md:aspect-[4/5] w-full group overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop" 
              alt="Lounge ambiente" 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted mb-4">Atmosfera</span>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-6">O Nosso <span className="italic font-serif text-brand-orange">Lounge</span></h2>
            <p className="text-muted leading-relaxed text-sm max-w-md mb-8">
              Desfrute de cocktails de assinatura num ambiente intimista e sofisticado. A seleção musical curada e a iluminação arquitetónica criam o cenário perfeito para prolongar a sua noite em Viana.
            </p>
          </div>
        </div>
      </section>

      {/* Contatos */}
      <section className="py-32 px-6 md:px-10 max-w-[1200px] mx-auto w-full text-center flex flex-col items-center">
        <h2 className="font-display text-4xl mb-16">Contactos & <span className="italic font-serif text-brand-orange">Localização</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border border-subtle flex items-center justify-center rounded-full text-brand-orange mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="text-xs uppercase tracking-widest text-white">Morada</h3>
            <p className="text-sm text-muted">Avenida principal, Viana<br />Luanda, Angola</p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border border-subtle flex items-center justify-center rounded-full text-brand-orange mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <h3 className="text-xs uppercase tracking-widest text-white">Linha de atendimento</h3>
            <p className="text-sm text-muted">+244 900 000 000<br />reservas@jardimviana.ao</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border border-subtle flex items-center justify-center rounded-full text-brand-orange mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xs uppercase tracking-widest text-white">Horário</h3>
            <p className="text-sm text-muted">Terça - Domingo<br />12:00 - 15:00 • 19:30 - 00:00</p>
          </div>
        </div>
      </section>
      
      <footer className="py-20 border-t border-white/5 flex flex-col items-center gap-8">
        <img src="/logo.png" alt="Logo Jardim de Viana" className="h-16 w-auto opacity-80" />
        <div className="font-display text-2xl font-light">Jardim <span className="text-brand-orange italic">Viana</span></div>
        <div className="opacity-40 text-[9px] uppercase tracking-widest text-center flex flex-col gap-2">
          <span>© 2026 Jardim de Viana. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
