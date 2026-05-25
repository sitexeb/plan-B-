import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { MapPin, Phone, Clock, Star, ChevronDown, Menu, X, Instagram, Facebook, Mail, ArrowUp, Send, Sparkles, Flame, UtensilsCrossed, Pizza, Sandwich, IceCreamCone, GlassWater, Heart, Eye } from 'lucide-react';

/* ──────────────────────────── Types ──────────────────────────── */
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_popular: boolean;
}
interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  created_at: string;
}

/* ──────────────────────────── Constants ──────────────────────────── */
const GOLD = '#C9A96E';
const GOLD_LIGHT = '#E2C992';
const GOLD_DARK = '#A68B4B';

const CATEGORY_META: Record<string, { icon: React.ReactNode; label: string; img: string }> = {
  pizzas:   { icon: <Pizza size={18} />,           label: 'Pizzas',   img: '/images/pizza-hero.jpg' },
  burgers:  { icon: <Flame size={18} />,            label: 'Burgers',  img: '/images/burger.jpg' },
  tacos:    { icon: <Sandwich size={18} />,         label: 'Tacos',    img: '/images/tacos.jpg' },
  salades:  { icon: <UtensilsCrossed size={18} />,  label: 'Salades',  img: '/images/salad.jpg' },
  desserts: { icon: <IceCreamCone size={18} />,     label: 'Desserts', img: '/images/dessert.jpg' },
  boissons: { icon: <GlassWater size={18} />,       label: 'Boissons', img: '/images/interior.jpg' },
};

/* ──────────────────────────── Grain overlay ──────────────────────────── */
function GrainOverlay() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03]"
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
    />
  );
}

/* ──────────────────────────── Decorative line ──────────────────────────── */
function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-[#C9A96E]/40" />
      <Sparkles size={14} style={{ color: GOLD }} />
      <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-[#C9A96E]/40" />
    </div>
  );
}

/* ──────────────────────────── Section Title ──────────────────────────── */
function SectionTitle({ children, subtitle, light = false }: { children: React.ReactNode; subtitle?: string; light?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
      <motion.span initial={{ opacity: 0, letterSpacing: '0.5em' }} animate={isInView ? { opacity: 1, letterSpacing: '0.3em' } : {}} transition={{ duration: 1, delay: 0.2 }}
        className="block text-xs font-medium uppercase mb-4" style={{ color: GOLD, fontFamily: '"Inter", sans-serif' }}>
        ✦ {String(children).toUpperCase()} ✦
      </motion.span>
      <h2 className={`text-4xl md:text-6xl font-bold mb-4 ${light ? 'text-zinc-900' : 'text-white'}`} style={{ fontFamily: '"Playfair Display", serif' }}>
        {children}
      </h2>
      {subtitle && <p className={`text-base max-w-lg mx-auto leading-relaxed ${light ? 'text-zinc-600' : 'text-zinc-400'}`}>{subtitle}</p>}
      <GoldDivider className="mt-8 max-w-xs mx-auto" />
    </motion.div>
  );
}

/* ──────────────────────────── Navbar ──────────────────────────── */
function Navbar({ onNavigate, currentSection }: { onNavigate: (id: string) => void; currentSection: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'apropos', label: 'À propos' },
    { id: 'carte', label: 'La Carte' },
    { id: 'avis', label: 'Avis' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/50' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button onClick={() => onNavigate('accueil')} className="flex items-center gap-3 group">
              <div className="relative w-11 h-11">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#C9A96E] to-[#A68B4B] rotate-0 group-hover:rotate-3 transition-transform duration-300" />
                <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-sm" style={{ fontFamily: '"Playfair Display", serif' }}>PB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>Plan B</span>
                <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: GOLD }}>Roanne</span>
              </div>
            </button>
            <div className="hidden md:flex items-center gap-1">
              {links.map(l => (
                <button key={l.id} onClick={() => onNavigate(l.id)}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentSection === l.id ? 'text-[#C9A96E]' : 'text-zinc-400 hover:text-white'}`}>
                  {currentSection === l.id && (
                    <motion.div layoutId="nav-indicator" className="absolute inset-0 rounded-full bg-white/5 border border-[#C9A96E]/20" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </button>
              ))}
            </div>
            <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-2">
            {links.map((l, i) => (
              <motion.button key={l.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => { onNavigate(l.id); setMobileOpen(false); }}
                className={`text-2xl font-medium py-3 transition-colors ${currentSection === l.id ? 'text-[#C9A96E]' : 'text-zinc-400 hover:text-white'}`}
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──────────────────────────── Hero ──────────────────────────── */
function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="accueil" ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img src="/images/pizza-hero.jpg" alt="Pizza artisanale" className="w-full h-[120%] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </motion.div>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]" style={{ background: `radial-gradient(circle, ${GOLD}40, transparent 70%)` }} />

      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ opacity }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/5 backdrop-blur-sm mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
            <span className="text-sm font-medium tracking-wider" style={{ color: GOLD_LIGHT }}>RESTAURANT & PIZZERIA</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 1 }}
          className="text-7xl md:text-9xl font-bold text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
          Plan
        </motion.h1>
        <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 1.3, type: 'spring' }}
          className="text-7xl md:text-9xl font-bold mb-8" style={{ fontFamily: '"Playfair Display", serif', color: GOLD }}>
          B
        </motion.h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.6 }}
          className="w-24 h-px mx-auto mb-8" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.8 }}
          className="text-lg md:text-xl text-zinc-300 mb-12 max-w-xl mx-auto leading-relaxed font-light">
          Pizzas artisanales, burgers gourmands & tacos généreux<br />
          <span style={{ color: GOLD }}>au cœur de Roanne</span>
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => onNavigate('carte')}
            className="group relative px-10 py-4 overflow-hidden rounded-full font-medium text-black transition-all duration-300 hover:scale-105 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A96E] to-[#E2C992]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#E2C992] to-[#C9A96E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2 text-sm tracking-wider uppercase">Découvrir la carte <Sparkles size={14} /></span>
          </button>
          <button onClick={() => onNavigate('contact')}
            className="px-10 py-4 rounded-full font-medium text-white border border-white/20 hover:border-[#C9A96E]/50 hover:bg-[#C9A96E]/5 transition-all duration-300 hover:scale-105 active:scale-95 text-sm tracking-wider uppercase backdrop-blur-sm">
            Nous trouver
          </button>
        </motion.div>
      </motion.div>

      <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Scroll</span>
        <ChevronDown size={20} style={{ color: GOLD }} />
      </motion.div>
    </section>
  );
}

/* ──────────────────────────── About ──────────────────────────── */
function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '200+', label: 'Avis positifs' },
    { value: '4.5', label: 'Note Google' },
    { value: '30+', label: 'Plats à la carte' },
    { value: '100%', label: 'Fait maison' },
  ];

  return (
    <section id="apropos" className="py-28 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10 blur-[100px]" style={{ background: GOLD }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <SectionTitle subtitle="Une cuisine généreuse et authentique, servie avec passion depuis le premier jour">Notre Histoire</SectionTitle>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Image side */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9 }} className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img src="/images/interior.jpg" alt="Intérieur du restaurant" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            </div>
            {/* Floating card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 md:right-8 bg-black/90 backdrop-blur-xl border border-[#C9A96E]/20 rounded-2xl p-6 shadow-2xl max-w-[260px]">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} style={{ color: GOLD }} fill={GOLD} />)}
              </div>
              <p className="text-white text-sm font-medium mb-1">Exceptionnel</p>
              <p className="text-zinc-500 text-xs">Basé sur 200+ avis Google</p>
            </motion.div>
            {/* Decorative corner */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: `${GOLD}40` }} />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: `${GOLD}40` }} />
          </motion.div>

          {/* Text side */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.2 }} className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: GOLD }}>Bienvenue</span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mt-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                L'art du bon,<br />le goût du <span style={{ color: GOLD }}>simple</span>
              </h3>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              Bienvenue au <span className="text-[#C9A96E] font-medium">Plan B</span>, votre adresse gourmande au cœur de Roanne.
              Ici, pas de chichis — juste de bons produits, des recettes qui ont du caractère et un accueil toujours chaleureux.
            </p>
            <p className="text-zinc-500 leading-relaxed font-light">
              De nos pizzas cuites avec amour à nos burgers qui font fondre, en passant par nos tacos légendaires,
              chaque plat raconte une histoire de passion et de générosité. Sur place, à emporter ou en livraison —
              le Plan B s'adapte à vos envies.
            </p>
            <div className="flex items-center gap-8 pt-2">
              <a href="tel:+33426543741" className="flex items-center gap-3 text-zinc-400 hover:text-[#C9A96E] transition-colors group">
                <div className="w-10 h-10 rounded-full border border-[#C9A96E]/20 flex items-center justify-center group-hover:bg-[#C9A96E]/10 transition-colors">
                  <Phone size={16} style={{ color: GOLD }} />
                </div>
                <span className="text-sm">04 26 54 37 41</span>
              </a>
              <a href="mailto:contact@planb-roanne.fr" className="flex items-center gap-3 text-zinc-400 hover:text-[#C9A96E] transition-colors group">
                <div className="w-10 h-10 rounded-full border border-[#C9A96E]/20 flex items-center justify-center group-hover:bg-[#C9A96E]/10 transition-colors">
                  <Mail size={16} style={{ color: GOLD }} />
                </div>
                <span className="text-sm">contact@planb-roanne.fr</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
              className="text-center py-8 border border-white/5 rounded-2xl bg-white/[0.02] hover:border-[#C9A96E]/20 hover:bg-[#C9A96E]/[0.02] transition-all duration-500 group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-500" style={{ fontFamily: '"Playfair Display", serif', color: GOLD }}>
                {s.value}
              </div>
              <div className="text-zinc-500 text-sm tracking-wider uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Dish Tooltip (Desktop) ──────────────────────────── */
function DishTooltip({ item, mousePos, visible }: { item: MenuItem | null; mousePos: { x: number; y: number }; visible: boolean }) {
  if (!item) return null;
  const img = item.image_url || CATEGORY_META[item.category]?.img || '/images/interior.jpg';
  const offsetX = 24;
  const offsetY = 16;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const tooltipWidth = 200;
  const left = mousePos.x + offsetX + tooltipWidth > vw ? mousePos.x - tooltipWidth - offsetX : mousePos.x + offsetX;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[60] pointer-events-none hidden md:block"
          style={{ left, top: mousePos.y + offsetY }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10"
            style={{ width: tooltipWidth }}>
            <div className="relative h-36 w-full overflow-hidden">
              <img src={img} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────── Dish Lightbox (Mobile) ──────────────────────────── */
function DishLightbox({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  if (!item) return null;
  const img = item.image_url || CATEGORY_META[item.category]?.img || '/images/interior.jpg';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-center justify-center md:hidden"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-[85vw] max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <img src={img} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 text-center">
              <h4 className="text-white font-bold text-lg mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>{item.name}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: `${GOLD}15`, color: GOLD }}>
                {item.price.toFixed(2)} €
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────── Menu Section ──────────────────────────── */
function MenuSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('pizzas');
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => { fetchMenu(); }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (!res.ok) {
        console.error('Menu API error:', res.status, res.statusText);
        setItems([]);
        return;
      }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Menu fetch error:', err);
      setItems([]);
    } finally { setLoading(false); }
  };

  const handleMouseMove = (e: React.MouseEvent, item: MenuItem) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setHoveredItem(item);
  };

  const categories = Array.from(new Set(items.map(i => i.category)));
  const filtered = items.filter(i => i.category === activeCategory);
  const meta = CATEGORY_META[activeCategory];

  return (
    <section id="carte" className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />
      <div className="absolute right-0 top-1/3 w-96 h-96 rounded-full opacity-5 blur-[120px]" style={{ background: GOLD }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <SectionTitle subtitle="Des plats préparés avec passion et des ingrédients de qualité">La Carte</SectionTitle>

        {/* Category tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map(cat => {
            const m = CATEGORY_META[cat];
            const isActive = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-400 flex items-center gap-2 ${
                  isActive
                    ? 'text-black shadow-lg shadow-[#C9A96E]/20'
                    : 'text-zinc-500 hover:text-white bg-white/[0.03] border border-white/5 hover:border-[#C9A96E]/20'
                }`}
                style={isActive ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` } : {}}>
                {m?.icon} {m?.label || cat}
              </button>
            );
          })}
        </motion.div>

        {/* Category hero image */}
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden mb-12 h-48 md:h-64">
            <img src={meta?.img || '/images/interior.jpg'} alt={meta?.label || ''} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
            <div className="absolute bottom-6 left-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/20 backdrop-blur-sm border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
                {meta?.icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>{meta?.label || activeCategory}</h3>
                <p className="text-zinc-400 text-sm">{filtered.length} plats disponibles</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Menu items */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-zinc-800 rounded w-3/4 mb-3" />
                <div className="h-3 bg-zinc-800 rounded w-1/2 mb-3" />
                <div className="h-3 bg-zinc-800 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onMouseMove={(e) => handleMouseMove(e, item)}
                  onClick={() => setSelectedItem(item)}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-[#C9A96E]/30 hover:bg-[#C9A96E]/[0.02] transition-all duration-500 cursor-pointer md:cursor-default overflow-hidden active:scale-[0.98]"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at top right, ${GOLD}08, transparent 70%)` }} />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-semibold text-lg group-hover:text-[#C9A96E] transition-colors duration-300">{item.name}</h4>
                        {item.is_popular && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider" style={{ background: `${GOLD}15`, color: GOLD }}>
                            <Heart size={10} fill={GOLD} /> Populaire
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">{item.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xl font-bold" style={{ color: GOLD }}>{item.price.toFixed(2)}</span>
                      <span className="text-zinc-600 text-xs">€</span>
                    </div>
                  </div>

                  {/* Mobile tap hint */}
                  <div className="absolute top-3 right-3 md:hidden flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/5">
                    <Eye size={10} style={{ color: GOLD }} />
                    <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: GOLD }}>Voir</span>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/0 to-transparent group-hover:via-[#C9A96E]/30 transition-all duration-500" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Floating dish tooltip (desktop) */}
      <DishTooltip item={hoveredItem} mousePos={mousePos} visible={!!hoveredItem} />

      {/* Dish lightbox (mobile) */}
      <DishLightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

/* ──────────────────────────── Reviews ──────────────────────────── */
function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formAuthor, setFormAuthor] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) {
        console.error('Reviews API error:', res.status, res.statusText);
        setReviews([]);
        return;
      }
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Reviews fetch error:', err);
      setReviews([]);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor || !formComment) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: formAuthor, rating: formRating, comment: formComment }),
      });
      if (res.ok) {
        setFormAuthor(''); setFormRating(5); setFormComment(''); setShowForm(false);
        fetchReviews();
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '4.5';

  return (
    <section id="avis" className="py-28 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-[400px] rounded-full opacity-5 blur-[120px]" style={{ background: GOLD }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <SectionTitle subtitle="Ils nous ont fait confiance et partagent leur expérience">Avis Clients</SectionTitle>

        {/* Rating summary */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
          <div className="text-center">
            <div className="text-6xl md:text-7xl font-bold mb-2" style={{ fontFamily: '"Playfair Display", serif', color: GOLD }}>{avgRating}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={20} className={s <= Math.round(Number(avgRating)) ? '' : 'text-zinc-700'} style={s <= Math.round(Number(avgRating)) ? { color: GOLD, fill: GOLD } : {}} />
              ))}
            </div>
            <p className="text-zinc-500 text-sm">{reviews.length} avis vérifiés</p>
          </div>
          <div className="h-16 w-px bg-gradient-to-b from-transparent via-[#C9A96E]/30 to-transparent hidden sm:block" />
          <button onClick={() => setShowForm(!showForm)}
            className="group relative px-8 py-4 overflow-hidden rounded-full font-medium text-black transition-all duration-300 hover:scale-105 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A96E] to-[#E2C992]" />
            <span className="relative z-10 flex items-center gap-2 text-sm tracking-wider uppercase">
              <Star size={14} fill="black" /> Laisser un avis
            </span>
          </button>
        </motion.div>

        {/* Review form */}
        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }} onSubmit={handleSubmit}
              className="overflow-hidden bg-white/[0.02] border border-[#C9A96E]/20 rounded-2xl p-8 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>Partagez votre expérience</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Votre nom" value={formAuthor} onChange={e => setFormAuthor(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C9A96E]/50 transition-colors" required />
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 text-sm">Votre note :</span>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setFormRating(s)} className="transition-transform hover:scale-125">
                      <Star size={28} className={s <= formRating ? 'transition-colors' : 'text-zinc-700 hover:text-zinc-500 transition-colors'}
                        style={s <= formRating ? { color: GOLD, fill: GOLD } : {}} />
                    </button>
                  ))}
                </div>
                <textarea placeholder="Votre commentaire..." value={formComment} onChange={e => setFormComment(e.target.value)}
                  rows={4} className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C9A96E]/50 transition-colors resize-none" required />
                <button type="submit" disabled={submitting}
                  className="w-full py-4 rounded-xl font-medium text-black transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
                  {submitting ? 'Envoi en cours...' : '✦ Publier mon avis'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Reviews grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 animate-pulse"><div className="h-4 bg-zinc-800 rounded w-1/2 mb-3" /><div className="h-3 bg-zinc-800 rounded w-full mb-2" /><div className="h-3 bg-zinc-800 rounded w-3/4" /></div>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-white/[0.02] border border-white/5 rounded-2xl p-7 hover:border-[#C9A96E]/20 hover:bg-[#C9A96E]/[0.02] transition-all duration-500">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: '#000' }}>
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-white font-medium block">{review.author}</span>
                      <span className="text-zinc-600 text-xs">{new Date(review.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12} style={s <= review.rating ? { color: GOLD, fill: GOLD } : { color: '#333' }} />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">« {review.comment} »</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────── Contact ──────────────────────────── */
function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (res.ok) {
        setName(''); setEmail(''); setPhone(''); setMessage('');
        setSent(true);
        setTimeout(() => setSent(false), 5000);
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const hours = [
    { day: 'Lundi - Jeudi', time: '11h00 - 14h00 / 17h00 - 22h00' },
    { day: 'Vendredi - Samedi', time: '11h00 - 22h30' },
    { day: 'Dimanche', time: '17h00 - 22h00' },
  ];

  return (
    <section id="contact" className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-5 blur-[100px]" style={{ background: GOLD }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <SectionTitle subtitle="Venez nous rendre visite ou écrivez-nous">Contact & Horaires</SectionTitle>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left column - Info */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }} className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-[#C9A96E]/20 transition-all duration-500">
              <div className="relative">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2780.0!2d4.0702408!3d46.0396551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f40f208c557719%3A0x9aa107adef88aa29!2sPLAN%20B%20ROANNE!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
                  width="100%" height="180" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full" />
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} style={{ color: GOLD }} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Adresse</h4>
                    <p className="text-zinc-500 text-sm">6 Rue des Aqueducs<br />42300 Roanne, France</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-[#C9A96E]/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center">
                  <Clock size={16} style={{ color: GOLD }} />
                </div>
                <h4 className="text-white font-medium text-sm">Horaires</h4>
              </div>
              <div className="space-y-3">
                {hours.map((h, i) => (
                  <div key={i} className="flex justify-between items-center py-1">
                    <span className="text-zinc-400 text-sm">{h.day}</span>
                    <span className="text-sm font-medium" style={{ color: GOLD }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-[#C9A96E]/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center">
                  <Phone size={16} style={{ color: GOLD }} />
                </div>
                <h4 className="text-white font-medium text-sm">Contact</h4>
              </div>
              <div className="space-y-3">
                <a href="tel:+33426543741" className="flex items-center gap-3 text-zinc-400 hover:text-[#C9A96E] transition-colors group">
                  <Phone size={14} /><span className="text-sm">04 26 54 37 41</span>
                </a>
                <a href="mailto:contact@planb-roanne.fr" className="flex items-center gap-3 text-zinc-400 hover:text-[#C9A96E] transition-colors group">
                  <Mail size={14} /><span className="text-sm">contact@planb-roanne.fr</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right column - Form */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }} className="lg:col-span-3">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 h-full hover:border-[#C9A96E]/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center">
                  <Send size={16} style={{ color: GOLD }} />
                </div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>Envoyez-nous un message</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input type="text" placeholder="Votre nom" value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C9A96E]/50 transition-colors" required />
                  <input type="email" placeholder="Votre email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C9A96E]/50 transition-colors" required />
                </div>
                <input type="tel" placeholder="Téléphone (optionnel)" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C9A96E]/50 transition-colors" />
                <textarea placeholder="Votre message..." value={message} onChange={e => setMessage(e.target.value)}
                  rows={6} className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C9A96E]/50 transition-colors resize-none" required />
                <button type="submit" disabled={submitting}
                  className="w-full py-4 rounded-xl font-medium text-black transition-all duration-300 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
                  <Send size={16} />
                  {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
                {sent && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm" style={{ color: GOLD }}>
                    ✦ Message envoyé avec succès ! Nous vous répondrons bientôt.
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Footer ──────────────────────────── */
function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <footer className="bg-black relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />

      {/* CTA Banner */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
            Prêt à vous régaler ?
          </h3>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">Réservez votre table ou passez nous voir — le Plan B vous attend avec des plats qui font du bien.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+33426543741"
              className="group relative px-8 py-4 overflow-hidden rounded-full font-medium text-black transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center gap-2">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C9A96E] to-[#E2C992]" />
              <span className="relative z-10 flex items-center gap-2 text-sm tracking-wider uppercase"><Phone size={14} /> Réserver</span>
            </a>
            <button onClick={() => onNavigate('carte')}
              className="px-8 py-4 rounded-full font-medium text-white border border-white/20 hover:border-[#C9A96E]/50 hover:bg-[#C9A96E]/5 transition-all duration-300 hover:scale-105 active:scale-95 text-sm tracking-wider uppercase">
              Voir la carte
            </button>
          </div>
        </div>
      </div>

      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A96E] to-[#A68B4B] flex items-center justify-center text-black font-bold text-sm">PB</div>
              <div>
                <span className="text-white font-bold text-lg block leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>Plan B</span>
                <span className="text-[9px] uppercase tracking-[0.25em]" style={{ color: GOLD }}>Roanne</span>
              </div>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed">Restaurant & Pizzeria au cœur de Roanne. Cuisine généreuse et savoureuse, servis avec passion.</p>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wider" style={{ color: GOLD }}>Navigation</h4>
            <div className="space-y-2">
              {[{ id: 'accueil', label: 'Accueil' }, { id: 'apropos', label: 'À propos' }, { id: 'carte', label: 'La Carte' }, { id: 'avis', label: 'Avis' }, { id: 'contact', label: 'Contact' }].map(l => (
                <button key={l.id} onClick={() => onNavigate(l.id)} className="block text-zinc-500 text-sm hover:text-[#C9A96E] transition-colors">{l.label}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wider" style={{ color: GOLD }}>Horaires</h4>
            <div className="space-y-2 text-zinc-500 text-sm">
              <p>Lun - Jeu : 11h-14h / 17h-22h</p>
              <p>Ven - Sam : 11h-22h30</p>
              <p>Dimanche : 17h-22h</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wider" style={{ color: GOLD }}>Suivez-nous</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-[#C9A96E] hover:border-[#C9A96E]/30 hover:bg-[#C9A96E]/5 transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-[#C9A96E] hover:border-[#C9A96E]/30 hover:bg-[#C9A96E]/5 transition-all duration-300">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-700 text-xs">© 2025 Plan B Roanne — Tous droits réservés</p>
          <p className="text-zinc-700 text-xs flex items-center gap-2"><MapPin size={12} /> 6 Rue des Aqueducs, 42300 Roanne</p>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────── App ──────────────────────────── */
export default function App() {
  const [currentSection, setCurrentSection] = useState('accueil');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
      const sections = ['contact', 'avis', 'carte', 'apropos', 'accueil'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          setCurrentSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <GrainOverlay />
      <Navbar onNavigate={navigate} currentSection={currentSection} />
      <Hero onNavigate={navigate} />
      <About />
      <MenuSection />
      <ReviewsSection />
      <ContactSection />
      <Footer onNavigate={navigate} />
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: '#000' }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
