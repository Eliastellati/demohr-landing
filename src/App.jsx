import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Calendar, FileText, ArrowRight,
  Clock, CheckCircle, Database, AlertCircle, LayoutDashboard,
  ShieldCheck, FileSpreadsheet, Stethoscope, Briefcase
} from 'lucide-react';
import DemoFormOverlay from './DemoFormOverlay';
import { GLSLHills } from './GLSLHills';
import { GlowCard } from './GlowCard';
import imgAnagrafica from '../images/Anagrafica.png';
import imgPresenze from '../images/presenze.png';
import imgTurni from '../images/turni.png';
import imgDisponibilita from '../images/disponibilità.png';
import imgAssenze from '../images/assenze.png';
import imgScadenze from '../images/visite_mediche.png';

const moduleIcons = {
  anagrafica: Users,
  presenze: Clock,
  turni: Calendar,
  disponibilita: CheckCircle,
  assenze: Briefcase,
  scadenze: Stethoscope
};

const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const FeatureSection = ({ id, title, subtitle, content, align = "left", iconName, features = [], imageSrc }) => {
  const Icon = moduleIcons[iconName] || FileText;
  const mockupRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = mockupRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc;
    const dy = (y - yc) / yc;

    // Max 10 degrees tilt
    const rotateX = -dy * 10;
    const rotateY = dx * 10;

    // Shadow moves in the opposite direction of mouse to simulate a realistic light source
    const shadowX = -dx * 12;
    const shadowY = -dy * 12;
    // Shadow blur varies based on tilt height lift
    const shadowBlur1 = 50 + (dy * -10);
    const shadowBlur2 = 60 + (dy * -15);

    card.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.15s ease-out';
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    card.style.boxShadow = `${shadowX}px ${shadowY + 25}px ${shadowBlur1}px rgba(0, 229, 255, 0.12), ${shadowX}px ${shadowY + 35}px ${shadowBlur2}px -15px rgba(0, 0, 0, 0.85)`;
  };

  const handleMouseLeave = () => {
    const card = mockupRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease-out';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = '';
  };

  return (
    <section id={id} className="relative py-10 md:py-12 xl:py-24 z-10 border-t border-white/5 overflow-hidden w-full flex items-center justify-center">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        <div className={`flex flex-col gap-10 xl:gap-16 items-center ${align === 'right' ? 'xl:flex-row-reverse' : 'xl:flex-row'}`}>

          {/* Testo */}
          <div className="flex-1 w-full text-center xl:text-left flex flex-col items-center xl:items-start">
            <FadeIn>
              <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center border border-blue-500/20 mb-6 mx-auto xl:mx-0">
                <Icon className="w-6 h-6 text-cyan-glow" />
              </div>
              <h2 className="text-3xl xl:text-4xl module-title mb-4">{title}</h2>
              {subtitle && <h3 className="text-xl text-blue-400 mb-6 font-nevera">{subtitle}</h3>}
              <div className="text-gray-100 text-lg space-y-4">
                {content}
              </div>

              {features.length > 0 && (
                <ul className="mt-8 space-y-3">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-start justify-center xl:justify-start gap-3 text-left">
                      <CheckCircle className="w-5 h-5 text-cyan-glow shrink-0 mt-1" />
                      <span className="text-gray-100">{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </FadeIn>
          </div>

          {/* Mockup Visivo / Immagine Reale */}
          <div className="flex-1 w-full max-w-full relative">
            <FadeIn delay={0.2}>
              <div 
                ref={mockupRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`relative ${imageSrc ? 'h-auto' : 'h-[300px] md:h-[400px]'} w-full max-w-full glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col hover:shadow-[0_20px_50px_rgba(0,229,255,0.12),0_30px_60px_-15px_rgba(0,0,0,0.85)] hover:z-20 z-10`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                }}
              >
               <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5 shrink-0">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 <div className="ml-auto text-xs text-gray-500 font-mono tracking-wider truncate">{title.toUpperCase()} MODULE</div>
               </div>

               <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center bg-[#010208]/50">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,85,255,0.05)_0%,transparent_70%)] pointer-events-none" />

                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={`${title} Screenshot`}
                      className="w-full h-auto block relative z-10 max-w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                           <div className="h-2 bg-white/10 rounded w-1/3"></div>
                           <div className="h-2 bg-white/5 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="mt-4 flex-1 bg-white/5 rounded-lg border border-white/5 p-4">
                        <div className="space-y-3">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="flex gap-4 items-center">
                              <div className="h-2 w-2 rounded-full bg-cyan-glow/50"></div>
                              <div className="h-2 bg-white/10 rounded flex-1"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                 </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

function App() {
  const heroRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const openDemo = () => setIsDemoOpen(true);

  useEffect(() => {
    const ids = [
      'hero', 'problema', 'anagrafica', 'presenze', 'turni',
      'disponibilita', 'assenze', 'scadenze', 'controllo', 'cta',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: '-15% 0px -15% 0px' }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#010208] text-white selection:bg-electric-blue/30 font-sans overflow-x-hidden">
      <DemoFormOverlay isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Background patterns */}
      <div className="fixed inset-0 z-0 pointer-events-none noise-gradient-orbs bg-grid-pattern" />

      {/* ── Fixed dark overlay ── */}
      <div className="fixed inset-0 z-[1] bg-[#010208]/45 pointer-events-none" />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 py-4 bg-[#010208]/70 backdrop-blur-lg">
        <div className="container mx-auto px-5 md:px-8 max-w-6xl flex justify-between items-center relative">

          <button
            className="md:hidden text-white/80 hover:text-white p-2 -ml-2 z-20 absolute left-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <div className="flex items-center justify-center w-full md:w-auto md:justify-start gap-4">
            <img src="/images/syncHR_type.png" alt="SyncHR" className="hidden md:inline h-[30px] w-auto" />
            <img src="/images/libreria_white_no_bg.png" alt="SyncHR Logo" className="h-[48px] md:h-[54px] w-auto" />
          </div>

          <div className="hidden md:flex gap-10 text-base font-medium text-white/70 items-center">
            <a href="#problema" className="hover:text-white transition-colors">Il Problema</a>
            <a href="#moduli" className="hover:text-white transition-colors">I Moduli</a>
            <a href="#controllo" className="hover:text-white transition-colors">Controllo</a>
            <button onClick={openDemo} className="bg-white text-black px-6 py-2.5 rounded-full text-base font-semibold hover:bg-gray-200 transition-colors ml-4">
              Richiedi Demo
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-[100%] left-0 w-full bg-[#010208]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl flex flex-col p-10 gap-8">
            <a href="#problema" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium text-center text-gray-300 hover:text-white">Il Problema</a>
            <a href="#moduli" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium text-center text-gray-300 hover:text-white">I Moduli</a>
            <a href="#controllo" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium text-center text-gray-300 hover:text-white">Controllo</a>
            <button onClick={() => { setIsMenuOpen(false); openDemo(); }} className="bg-white text-black px-5 py-5 mt-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors w-full">
              Richiedi Demo
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section id="hero" ref={heroRef} className="relative h-[80vh] md:h-[65vh] xl:h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-28 xl:pt-0">
        {/* Animated GLSL Hills background with mask-image for a super smooth fade out */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0.15) 80%, rgba(0, 0, 0, 0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0.15) 80%, rgba(0, 0, 0, 0) 100%)'
          }}
        >
          <GLSLHills width="100%" height="100%" cameraZ={125} planeSize={256} speed={0.5} />
        </div>

        <div
          className="relative z-10 container mx-auto px-5 md:px-8 h-full flex flex-col justify-center items-center mt-10 md:mt-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-center flex flex-col items-center w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-medium text-cyan-glow mb-6 border-cyan-glow/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-glow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-glow"></span>
              </span>
              Enterprise OS 2.0
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gradient">La gestione <em>HR</em> in un'unica piattaforma.</span>
            </h1>

            <p className="text-xl md:text-xl text-gray-200 mb-8 md:mb-10 max-w-2xl">
              Trasforma il caos operativo in controllo totale.
              Un ecosistema unico per gestire dati, presenze, turni, scadenze e molto altro.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button onClick={openDemo} className="relative group px-10 py-4 rounded-full bg-white text-black font-semibold text-sm overflow-hidden transition-all hover:scale-105 w-fit">
                <span className="relative flex items-center justify-center gap-2">
                  Richiedi Demo Gratuita <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main scrollable content ── */}
      <div className="relative z-10 w-full overflow-x-hidden">

        {/* Il Problema */}
        <section id="problema" className="py-12 md:py-16 xl:py-32 relative z-10 overflow-hidden flex items-center justify-center">
          <div className="container mx-auto px-5 md:px-8 max-w-6xl text-center relative z-10">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Come gestisci la tua <em>azienda</em> oggi?</h2>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10 md:mb-16">
                L'uso frammentato di WhatsApp, email, fogli Excel e cartellino non basta più.
                Rende la gestione caotica, espone a rischi normativi e fa perdere tempo.
              </p>
            </FadeIn>

            <div className="flex flex-col md:flex-row gap-8 text-left">
              <FadeIn delay={0.2} className="flex-1 flex">
                <GlowCard 
                  glowColor="red" 
                  customSize={true} 
                  className="w-full p-6 md:p-10 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(255,0,0,0.1)] hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-start"
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-red-400 relative z-10">Prima di SyncHR</h3>
                  <ul className="space-y-4 md:space-y-5 relative z-10">
                    {["Dati del personale sparsi o non aggiornati", "Turni comunicati su WhatsApp con errori e lamentele", "Richieste di ferie/permessi perse in chat o email", "Scadenze normative (visite, sicurezza) dimenticate"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 md:gap-4 text-gray-200 text-base md:text-lg">
                        <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500/70 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </FadeIn>

              <FadeIn delay={0.4} className="flex-1 flex">
                <GlowCard 
                  glowColor="blue" 
                  customSize={true} 
                  className="w-full p-6 md:p-10 rounded-3xl border border-cyan-400/30 shadow-[0_0_50px_rgba(0,229,255,0.15)] hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-start"
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-300 relative z-10">Con SyncHR</h3>
                  <ul className="space-y-4 md:space-y-5 relative z-10">
                    {["Tutti i dati in un'unica piattaforma sicura", "Pianificazione turni centralizzata con notifiche automatiche", "Flusso di approvazione rapido e tracciabile", "Sistema di alert per non perdere nessuna scadenza"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 md:gap-4 text-gray-300 text-base md:text-lg">
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-cyan-glow shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Moduli */}
        <div id="moduli" className="relative z-20">
          <div className="relative">
            <FeatureSection
              id="anagrafica"
              iconName="anagrafica"
              title="Anagrafica"
              subtitle="Il cuore dei tuoi dati"
              content={
                <>
                  <p>Niente più faldoni o file excel obsoleti. In SyncHR avrai una scheda dipendente digitale, costantemente aggiornata.</p>
                  <p>Ogni persona ha un profilo con ruoli, competenze e documenti allegati, oltre a un sistema di tag e note per una profilazione personalizzata.</p>
                </>
              }
              features={["Dati personali e contrattuali", "Documenti allegati in un archivio sicuro", "Tag e personalizzazioni"]}
              align="left"
              imageSrc={imgAnagrafica}
            />
          </div>
          <FeatureSection
            id="presenze"
            iconName="presenze"
            title="Presenze"
            subtitle="Dimentica il vecchio cartellino"
            content={
              <>
                <p>SyncHR permette la timbratura digitale in modo semplice e sicuro. I dipendenti possono registrare ingresso, pausa e uscita direttamente da smartphone o tablet condiviso, anche tramite badge NFC.</p>
              </>
            }
            features={["Timbratura in app (anche in base alla geolocalizzazione autorizzata)", "Supporto per Badge NFC", "Visualizzazione ore lavorate in tempo reale"]}
            align="right"
            imageSrc={imgPresenze}
          />
          <FeatureSection
            id="turni"
            iconName="turni"
            title="Turni"
            subtitle="Pianifica senza stress"
            content={
              <>
                <p>Gestire chi fa cosa non è mai stato così veloce. Crei i turni in un calendario condiviso e l'app avvisa automaticamente il personale.</p>
                <p>Puoi creare modelli di turnazione ripetitivi e verificare in un attimo la copertura dei reparti.</p>
              </>
            }
            features={["Calendario interattivo e drag&drop", "Notifiche in tempo reale ai dipendenti", "Gestione del fabbisogno per ruolo/reparto"]}
            align="left"
            imageSrc={imgTurni}
          />
          <FeatureSection
            id="disponibilita"
            iconName="disponibilita"
            title="Disponibilità"
            subtitle="La flessibilità sotto controllo"
            content={
              <>
                <p>Prima di fare i turni, chiedi al tuo staff quando è disponibile. I dipendenti inseriscono i loro "preferiti" e tu pianifichi tenendo conto delle esigenze di tutti, riducendo lamentele e cambi dell'ultimo minuto.</p>
              </>
            }
            align="right"
            imageSrc={imgDisponibilita}
          />
          <FeatureSection
            id="assenze"
            iconName="assenze"
            title="Assenze"
            subtitle="Stop ai messaggi 'posso prendere ferie?'"
            content={
              <>
                <p>Un flusso di approvazione chiaro: il dipendente fa richiesta tramite app, il responsabile riceve la notifica e approva (o rifiuta) con un clic. Tutto viene registrato e il calendario presenze si aggiorna automaticamente.</p>
              </>
            }
            features={["Gestione permessi, ferie, malattie, legge 104", "Storico approvazioni e conteggio residui"]}
            align="left"
            imageSrc={imgAssenze}
          />
          <FeatureSection
            id="scadenze"
            iconName="scadenze"
            title="Scadenze, Visite e Formazione"
            subtitle="Zero rischi normativi"
            content={
              <>
                <p>SyncHR ti avvisa prima che sia troppo tardi. Pianifica le visite mediche del lavoro, tieni traccia degli attestati sulla sicurezza e gestisci l'assegnazione delle dotazioni (DPI, chiavi, veicoli) in modo inattaccabile.</p>
              </>
            }
            features={["Dashboard delle scadenze imminenti", "Log della consegna DPI e dotazioni", "Archivio certificati"]}
            align="right"
            imageSrc={imgScadenze}
          />
        </div>

        {/* Controllo, tracciabilità e supporto */}
        <section id="controllo" className="py-10 md:py-12 xl:py-24 relative z-10 border-t border-white/5 overflow-hidden w-full bg-[#010208]/30">
          <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-electric-blue/5 blur-[80px] md:blur-[100px] rounded-full pointer-events-none translate-x-1/2" />
          <div className="container mx-auto px-5 md:px-8 max-w-6xl">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16">Controllo, <em>Tracciabilità</em> e Supporto</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <FadeIn delay={0.1} className="flex-1 flex">
                <GlowCard 
                  glowColor="blue" 
                  customSize={true} 
                  className="w-full p-6 md:p-8 rounded-2xl border border-cyan-400/20 shadow-[0_8px_32px_rgba(0,229,255,0.05)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center md:items-start text-center md:text-left justify-start"
                >
                  <FileSpreadsheet className="w-10 h-10 text-cyan-glow mb-6 relative z-10" />
                  <h3 className="text-xl font-bold mb-3 relative z-10">Esportazione per il Consulente</h3>
                  <p className="text-gray-200 text-sm flex-1 relative z-10">
                    Ogni mese, estrai il report di presenze e assenze pronto per il consulente del lavoro o per l'elaborazione buste paga. Meno errori di trascrizione, meno ritardi.
                  </p>
                </GlowCard>
              </FadeIn>
              <FadeIn delay={0.2} className="flex-1 flex">
                <GlowCard 
                  glowColor="blue" 
                  customSize={true} 
                  className="w-full p-6 md:p-8 rounded-2xl border border-cyan-400/20 shadow-[0_8px_32px_rgba(0,229,255,0.05)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center md:items-start text-center md:text-left justify-start"
                >
                  <Database className="w-10 h-10 text-blue-400 mb-6 relative z-10" />
                  <h3 className="text-xl font-bold mb-3 relative z-10">Log delle Attività</h3>
                  <p className="text-gray-200 text-sm flex-1 relative z-10">
                    "Chi ha cambiato questo turno?" SyncHR traccia ogni azione (chi ha fatto cosa e quando), garantendo totale trasparenza e responsabilizzazione.
                  </p>
                </GlowCard>
              </FadeIn>
              <FadeIn delay={0.3} className="flex-1 flex md:col-span-2 xl:col-span-1">
                <GlowCard 
                  glowColor="blue" 
                  customSize={true} 
                  className="w-full p-6 md:p-8 rounded-2xl border border-cyan-400/20 shadow-[0_8px_32px_rgba(0,229,255,0.05)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center md:items-start text-center md:text-left justify-start"
                >
                  <LayoutDashboard className="w-10 h-10 text-indigo-400 mb-6 relative z-10" />
                  <h3 className="text-xl font-bold mb-3 relative z-10">Guide Integrati e AI</h3>
                  <p className="text-gray-200 text-sm flex-1 relative z-10">
                    Non sei solo: tutorial passo-passo dentro l'app e la possibilità di chiedere supporto a un assistente virtuale istruito sul funzionamento della piattaforma.
                  </p>
                </GlowCard>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* CTA Finale */}
        <section id="cta" className="py-12 md:py-16 xl:py-24 relative text-center border-t border-white/5 overflow-hidden w-full bg-[#010208]/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,85,255,0.08)_0%,transparent_50%)] pointer-events-none" />
          <div className="container mx-auto px-5 md:px-8 relative z-10 max-w-3xl">
            <FadeIn>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue to-cyan-glow mx-auto flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Riporta l'<em>ordine</em> in azienda. <br/>Il tuo team ringrazierà.
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-6">
                L'implementazione è rapida e il team di SyncHR ti seguirà nell'onboarding per garantirti un passaggio fluido dal caos all'efficienza.
              </p>
              <button onClick={openDemo} className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-white text-black font-bold text-base md:text-lg hover:scale-105 transition-transform hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] w-fit mx-auto mb-2">
                Contattaci per una demo gratuita
              </button>
            </FadeIn>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-3 pb-1 md:py-4 text-center text-gray-500 text-xs bg-[#010208]/70">
          <p>&copy; {new Date().getFullYear()} SyncHR. Tutti i diritti riservati.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
