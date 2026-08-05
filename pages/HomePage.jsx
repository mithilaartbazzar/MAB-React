import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Plus, Award, ShieldCheck, Truck, Palette, Leaf, Quote, Star, Brush, PackageCheck, HeartHandshake, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { dbService } from '../services/dbservices';

const MARQUEE_ITEMS = [
    'Color Holds History', 'Handmade in Janakpur', 'Natural Earth Pigments', 'Certified Origin',
    'Direct From Artisans', 'Free Shipping Over रु 5,000', '2,500+ Years of Heritage', 'Ethically Sourced',
];

const CATEGORIES = [
    {
        key: 'paintings',
        label: 'Paintings',
        tagline: 'Divine stories on canvas & paper',
        fallback: 'https://res.cloudinary.com/djmbuuz28/image/upload/v1774971793/Shri_Krishna_Leela_-_The_Circular_Chronicles.png',
    },
    {
        key: 'home-decor',
        label: 'Home Decor',
        tagline: 'Heritage for your living space',
        fallback: 'https://res.cloudinary.com/djmbuuz28/image/upload/v1774970560/The%20Lady%20From%20Mithila.jpg',
    },
    {
        key: 'accessories',
        label: 'Accessories',
        tagline: 'Wearable folk artistry',
        fallback: 'https://res.cloudinary.com/djmbuuz28/image/upload/v1774971793/Shri_Krishna_Leela_-_The_Circular_Chronicles.png',
    },
];

const TESTIMONIALS = [
    {
        name: 'Aarati Sharma',
        location: 'Kathmandu, Nepal',
        text: 'The painting arrived beautifully framed with a certificate of authenticity. You can feel the devotion in every stroke — it has become the soul of our living room.',
        rating: 5,
    },
    {
        name: 'Daniel Weiss',
        location: 'Berlin, Germany',
        text: 'I ordered from halfway across the world and the piece arrived flawlessly packed. Knowing my purchase directly supports the artist in Janakpur makes it even more special.',
        rating: 5,
    },
    {
        name: 'Priya Jha',
        location: 'Delhi, India',
        text: 'As someone from the Mithila region, I was moved by the authenticity. These are not prints — they are real, hand-painted heirlooms. My mother cried when she saw it.',
        rating: 5,
    },
];

const PROCESS_STEPS = [
    { icon: Palette, title: 'Painted by Hand', text: 'Each piece is hand-painted by master artisans using pigments ground from flowers, soot and river clay.' },
    { icon: ShieldCheck, title: 'Verified Origin', text: 'Every artwork ships with a certificate of authenticity naming its artist and village of origin.' },
    { icon: PackageCheck, title: 'Museum-Grade Packing', text: 'Artworks are wrapped in acid-free tissue and double-walled crating for a safe global journey.' },
    { icon: HeartHandshake, title: 'Artisan-First Pay', text: 'The majority of every sale goes directly to the artist, sustaining village workshops and traditions.' },
];

const HERO_THEME_GRADIENTS = {
    maroon: { bg: 'from-[#5c1111] via-[#6d1414] to-[#3a0a0a]', fade: 'from-[#5c1111]' },
    charcoal: { bg: 'from-[#2a2723] via-[#1e1c1a] to-[#0d0c0b]', fade: 'from-[#1e1c1a]' },
    saffron: { bg: 'from-[#8a5200] via-[#7a4400] to-[#5c1111]', fade: 'from-[#8a5200]' }
};

const normalizeHeroSlide = (slide) => {
    const theme = slide.theme || 'maroon';
    const themeClasses = HERO_THEME_GRADIENTS[theme] || HERO_THEME_GRADIENTS.maroon;
    return {
        id: slide.id,
        tag: slide.tag ?? '',
        title: slide.title ?? '',
        highlight: slide.highlight ?? '',
        text: slide.text ?? slide.description ?? '',
        cta: slide.cta ?? slide.cta_label ?? 'Shop Now',
        link: slide.link ?? slide.cta_link ?? '/products',
        image: slide.image ?? '',
        theme,
        bg: slide.bg || themeClasses.bg,
        fade: slide.fade || themeClasses.fade,
        sort_order: slide.sort_order ?? 0,
        active: slide.active ?? true
    };
};

const HeroSection = ({ products, heroSlides }) => {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(null);
    const slides = (heroSlides || []).filter(slide => slide.active !== false);
    const count = slides.length;

    useEffect(() => {
        if (paused || count === 0) return;
        const timer = setInterval(() => setCurrent(c => (c + 1) % count), 5000);
        return () => clearInterval(timer);
    }, [paused, count]);

    useEffect(() => {
        if (count === 0 && current !== 0) {
            setCurrent(0);
        }
        if (current >= count) {
            setCurrent(0);
        }
    }, [count, current]);

    const go = (dir) => setCurrent(c => (c + dir + count) % count);

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
        touchStartX.current = null;
    };

    const deal = products.find(p => p.featured) || products[0];

    return (
        <section className="pt-20 sm:pt-28 lg:pt-32 px-3 sm:px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-4 sm:gap-6">
                {/* ── Banner Carousel ── */}
                <div
                    className="relative rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-900/20 group"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `translateX(-${current * 100}%)` }}>
                        {slides.map((slide, i) => (
                            <div key={slide.id || slide.tag || i} className={`relative min-w-full bg-gradient-to-br ${slide.bg} overflow-hidden`}>
                                {/* artwork — right half */}
                                <div className="absolute inset-y-0 right-0 w-[58%] sm:w-1/2">
                                    <img src={slide.image || products[i]?.image} alt="" className="w-full h-full object-cover" draggable="false" loading={i === 0 ? 'eager' : 'lazy'} />
                                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.fade} via-transparent to-transparent`}></div>
                                </div>

                                {/* copy — left half */}
                                <div className="relative z-10 w-[62%] sm:w-[55%] px-5 sm:px-12 min-h-[300px] sm:min-h-[440px] flex flex-col justify-center items-start gap-3 sm:gap-5">
                                    <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-amber-300 px-3 sm:px-4 py-1.5 rounded-full text-[7px] sm:text-[9px] font-black uppercase tracking-[0.25em] backdrop-blur-sm">
                                        <Sparkles size={11} /> {slide.tag}
                                    </span>
                                    <h1 className="font-playfair text-2xl sm:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.1]">
                                        {slide.title}<br />
                                        <span className="font-dancing italic text-amber-400">{slide.highlight}</span>
                                    </h1>
                                    <p className="hidden sm:block text-white/60 text-sm font-light leading-relaxed max-w-md">{slide.text}</p>
                                    <Link to={slide.link} className="bg-white text-[#2a2723] px-5 sm:px-8 py-3 sm:py-4 rounded-full font-black text-[8px] sm:text-[10px] uppercase tracking-[0.2em] hover:bg-amber-400 hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-xl mt-1">
                                        {slide.cta} <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* arrows */}
                    <button onClick={() => go(-1)} aria-label="Previous banner" className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#5c1111] border border-white/20 backdrop-blur-md flex items-center justify-center transition-all sm:opacity-0 sm:group-hover:opacity-100">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => go(1)} aria-label="Next banner" className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#5c1111] border border-white/20 backdrop-blur-md flex items-center justify-center transition-all sm:opacity-0 sm:group-hover:opacity-100">
                        <ChevronRight size={18} />
                    </button>

                    {/* dots */}
                    <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {slides.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to banner ${i + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-7 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}></button>
                        ))}
                    </div>
                </div>

                {/* ── Side Promos (desktop) ── */}
                <div className="hidden lg:flex flex-col gap-4 sm:gap-6">
                    {deal && (
                        <Link to={`/product/${deal.slug}`} className="group flex-1 bg-[#f8f6f2] border border-[#e5e1d8] rounded-[1.5rem] p-5 flex flex-col hover:shadow-2xl hover:shadow-[#5c1111]/10 hover:-translate-y-1 transition-all overflow-hidden">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#5c1111] flex items-center gap-2"><Star size={12} fill="currentColor" /> Deal Of The Day</p>
                                <span className="bg-[#5c1111] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">Featured</span>
                            </div>
                            <div className="rounded-2xl overflow-hidden aspect-[16/10] mb-3 bg-[#efece6]">
                                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <h3 className="font-playfair font-black text-[#2a2723] leading-tight line-clamp-1">{deal.name}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[#5c1111] font-playfair font-black text-lg">रु {deal.price.toLocaleString()}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:text-[#5c1111] flex items-center gap-1 transition-colors">Shop <ArrowRight size={12} /></span>
                            </div>
                        </Link>
                    )}

                    <div className="bg-[#2a2723] rounded-[1.5rem] p-5 text-white relative overflow-hidden paper-texture">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-600/20 rounded-full blur-[50px]"></div>
                        <div className="relative z-10 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-amber-400"><Truck size={16} /></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Free Insured Shipping</p>
                            </div>
                            <p className="text-white/50 text-[11px] font-light leading-relaxed">On every order above रु 5,000 — packed to museum standards.</p>
                            <div className="flex items-center gap-2 text-amber-400 text-[9px] font-black uppercase tracking-widest"><ShieldCheck size={12} /> Certificate of Origin Included</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const HomePage = ({ products, addToCart, wishlist, toggleWishlist }) => {
    const [heroSlides, setHeroSlides] = useState([]);
    const featured = products.filter(p => p.featured).slice(0, 4);
    const featuredFill = featured.length < 4 ? [...featured, ...products.filter(p => !p.featured).slice(0, 4 - featured.length)] : featured;

    useEffect(() => {
        const loadHeroSlides = async () => {
            try {
                const slides = await dbService.getHeroSlides();
                if (slides && slides.length) setHeroSlides(slides.map(normalizeHeroSlide));
            } catch (error) {
                console.error('Failed to load homepage hero slides:', error);
            }
        };
        loadHeroSlides();
    }, []);

    // Pull each category's cover image from live product data, fall back to curated stills
    const categoryImage = (cat) => products.find(p => p.category === cat.key)?.image || cat.fallback;

    return (
        <div className="overflow-hidden">
            {/* ══════════ Hero — Promo Banner Carousel ══════════ */}
            <HeroSection products={products} heroSlides={heroSlides} />

            {/* ══════════ Marquee Strip ══════════ */}
            <section className="bg-[#5c1111] mt-4 py-4 sm:py-5 overflow-hidden relative -rotate-[0.5deg] scale-[1.01] shadow-xl">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-4 sm:gap-6 text-[#efece6] text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] mx-4 sm:mx-8">
                            {item}
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block rotate-45"></span>
                        </span>
                    ))}
                </div>
            </section>

            {/* ══════════ Trust Bar ══════════ */}
            <section className="px-4 sm:px-6 py-10 sm:py-14 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {[
                        { icon: Truck, title: 'Global Shipping', text: 'Insured delivery to 28+ countries' },
                        { icon: ShieldCheck, title: 'Certified Origin', text: 'Authenticity papers with every piece' },
                        { icon: Leaf, title: 'Natural Pigments', text: '100% earth & plant based colors' },
                        { icon: HeartHandshake, title: 'Fair Trade', text: 'Artists receive the lion\'s share' },
                    ].map((item, i) => (
                        <Reveal key={item.title} delay={i * 80}>
                            <div className="group flex items-center gap-3 sm:gap-4 bg-[#f8f6f2] border border-[#e5e1d8] rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-[#5c1111]/20 hover:shadow-xl hover:shadow-[#5c1111]/5 hover:-translate-y-1 transition-all duration-500">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 bg-[#5c1111]/5 group-hover:bg-[#5c1111] rounded-xl sm:rounded-2xl flex items-center justify-center text-[#5c1111] group-hover:text-white transition-colors duration-500">
                                    <item.icon size={20} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-[10px] sm:text-xs uppercase tracking-widest text-[#2a2723]">{item.title}</p>
                                    <p className="text-[9px] sm:text-[11px] text-stone-400 font-medium mt-0.5 leading-snug">{item.text}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ══════════ Featured Collection ══════════ */}
            <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-10 mb-10 sm:mb-16">
                    <Reveal>
                        <SectionHeading subtitle="Curated Heritage" title="Private Collection" />
                    </Reveal>
                    <Reveal delay={100}>
                        <Link to="/products" className="group sm:mb-12 text-stone-400 hover:text-[#5c1111] font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 transition-colors">
                            Full Gallery <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#d1cdc7] flex items-center justify-center transition-all group-hover:bg-[#5c1111] group-hover:text-white group-hover:border-[#5c1111]"><Plus size={14} /></div>
                        </Link>
                    </Reveal>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                    {featuredFill.map((p, i) => (
                        <Reveal key={p.id} delay={i * 100}>
                            <ProductCard
                                product={p}
                                addToCart={addToCart}
                                isWishlisted={wishlist.includes(p.id)}
                                toggleWishlist={toggleWishlist}
                            />
                        </Reveal>
                    ))}
                </div>

                <Reveal>
                    <div className="text-center mt-10 sm:mt-16">
                        <Link to="/products" className="inline-flex items-center gap-3 bg-[#5c1111] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-[#5c1111]/25 hover:bg-[#2a2723] hover:-translate-y-1 transition-all">
                            View Full Collection <ArrowRight size={16} />
                        </Link>
                    </div>
                </Reveal>
            </section>

            {/* ══════════ Category Showcase ══════════ */}
            <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-7xl mx-auto">
                <Reveal>
                    <SectionHeading subtitle="Explore by Craft" title="Chambers of the Bazzar" centered />
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12">
                    {CATEGORIES.map((cat, i) => (
                        <Reveal key={cat.key} delay={i * 120}>
                            <Link to={`/products?cat=${cat.key}`} className="group relative block aspect-[4/5] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl border border-[#e5e1d8]">
                                <img src={categoryImage(cat)} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 saturate-[0.7] group-hover:saturate-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1c1a]/90 via-[#1e1c1a]/30 to-transparent"></div>
                                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                    <p className="text-amber-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] mb-2">{cat.tagline}</p>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-playfair text-2xl sm:text-3xl font-black text-[#efece6]">{cat.label}</h3>
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white transition-all group-hover:bg-[#5c1111] group-hover:border-[#5c1111] group-hover:rotate-[-45deg]">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ══════════ Heritage Section ══════════ */}
            <div className="mithila-divider"></div>
            <section className="bg-[#1e1c1a] py-20 sm:py-32 px-4 sm:px-6 overflow-hidden relative paper-texture">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-[#5c1111]/10 blur-[150px] rounded-full"></div>
                <div className="absolute -left-20 bottom-0 w-72 h-72 border-[24px] border-white/[0.02] rounded-full"></div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-center relative z-10">
                    <Reveal direction="left">
                        <div className="space-y-6 sm:space-y-10">
                            <div className="space-y-2 sm:space-y-4">
                                <span className="text-amber-600 font-black uppercase tracking-[0.4em] text-[9px] sm:text-[10px]">Living Tradition</span>
                                <h2 className="font-playfair text-3xl sm:text-6xl font-black text-[#efece6] leading-tight">Souls of <span className="text-shimmer italic">Janakpur</span></h2>
                            </div>
                            <p className="text-stone-400 text-sm sm:text-lg font-light leading-relaxed">
                                Mithila art is not merely painting; it is a ritual of life. For millennia, artisans have transformed humble mud walls into divine tapestries using nature's own palette — turmeric for gold, indigo for night skies, and soot for the outlines of gods.
                            </p>
                            <div className="grid grid-cols-3 gap-4 sm:gap-10 border-t border-white/5 pt-6 sm:pt-10">
                                <div className="space-y-1 sm:space-y-2">
                                    <h4 className="text-amber-600 font-playfair text-2xl sm:text-4xl font-black italic">100%</h4>
                                    <p className="text-stone-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em]">Earth Pigments</p>
                                </div>
                                <div className="space-y-1 sm:space-y-2">
                                    <h4 className="text-amber-600 font-playfair text-2xl sm:text-4xl font-black italic">2,500+</h4>
                                    <p className="text-stone-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em]">Year Heritage</p>
                                </div>
                                <div className="space-y-1 sm:space-y-2">
                                    <h4 className="text-amber-600 font-playfair text-2xl sm:text-4xl font-black italic">120+</h4>
                                    <p className="text-stone-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em]">Village Artists</p>
                                </div>
                            </div>
                            <Link to="/products" className="inline-flex items-center gap-3 text-amber-500 hover:text-amber-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors group">
                                Meet the Craft <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </Reveal>
                    <Reveal direction="right" delay={100}>
                        <div className="relative group max-w-xs sm:max-w-lg mx-auto lg:ml-auto">
                            <div className="absolute -inset-3 sm:-inset-4 border border-dashed border-amber-600/20 rounded-[2.5rem] sm:rounded-[3.5rem] pointer-events-none"></div>
                            <div className="aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden border-[6px] sm:border-[10px] border-white/5 shadow-2xl bg-[#efece6]">
                                <img src="https://res.cloudinary.com/djmbuuz28/image/upload/v1774970560/The%20Lady%20From%20Mithila.jpg" className="w-full h-full object-cover grayscale opacity-80 transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110" alt="The Lady From Mithila" title='The Lady From Mithila' />
                            </div>
                            <div className="absolute -bottom-5 -left-2 sm:-left-6 bg-[#efece6] rounded-2xl px-5 py-4 shadow-2xl border border-[#d1cdc7] flex items-center gap-3 rotate-[-2deg]">
                                <Brush size={18} className="text-[#5c1111]" />
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#2a2723]">Hand Painted</p>
                                    <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">No Prints. Ever.</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
            <div className="mithila-divider"></div>

            {/* ══════════ Process / Promise ══════════ */}
            <section className="px-4 sm:px-6 py-16 sm:py-28 max-w-7xl mx-auto">
                <Reveal>
                    <SectionHeading subtitle="The Bazzar Promise" title="From Village Wall to Your Wall" centered />
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-10 sm:mt-16 relative">
                    {/* connecting line on desktop */}
                    <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-px border-t-2 border-dashed border-[#d1cdc7]"></div>
                    {PROCESS_STEPS.map((step, i) => (
                        <Reveal key={step.title} delay={i * 100}>
                            <div className="relative text-center space-y-4 sm:space-y-5 group px-4">
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-[#f8f6f2] border border-[#e5e1d8] rounded-[1.5rem] flex items-center justify-center text-[#5c1111] shadow-lg group-hover:bg-[#5c1111] group-hover:text-white group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-500 z-10">
                                    <step.icon size={26} />
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md">{i + 1}</span>
                                </div>
                                <h4 className="font-playfair text-lg sm:text-xl font-black text-[#2a2723]">{step.title}</h4>
                                <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-[240px] mx-auto">{step.text}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ══════════ Testimonials ══════════ */}
            <section className="bg-[#f8f6f2] border-y border-[#e5e1d8] py-16 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#5c1111]/5 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-600/5 rounded-full blur-[100px]"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <Reveal>
                        <SectionHeading subtitle="Collector Voices" title="Cherished Across Continents" centered />
                    </Reveal>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-16">
                        {TESTIMONIALS.map((t, i) => (
                            <Reveal key={t.name} delay={i * 120}>
                                <div className="group bg-[#efece6] rounded-[1.8rem] sm:rounded-[2.5rem] p-4 sm:p-10 border border-[#e5e1d8] hover:border-[#5c1111]/20 hover:shadow-2xl hover:shadow-[#5c1111]/5 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                                    <Quote size={20} md:size={28} className="text-[#5c1111]/20 mb-4 sm:mb-6 group-hover:text-[#5c1111]/40 transition-colors" />
                                    <p className="text-stone-600 font-playfair italic text-[11px] sm:text-base leading-relaxed flex-1">"{t.text}"</p>
                                    <div className="flex flex-col md:flex-row justify-center md:items-center md:justify-between mt-2 sm:mt-8 pt-2 md:p-5 border-t border-[#ddd9d0]">
                                        <div className="flex items-center gap-2">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=5c1111&color=fff&size=96`} alt={t.name} className="w-8 h-8 md:w-10 md:h-10 rounded-xl shadow-md" />
                                            <div>
                                                <p className="font-black text-[10px] md:text-xs text-[#2a2723]">{t.name}</p>
                                                <p className="text-[8px] md:text-[10px] font-light text-stone-500 uppercase tracking-widest">{t.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500 mt-2 md:mt-0 gap-0.5">
                                            {[...Array(t.rating)].map((_, s) => <Star key={s} size={11} fill="currentColor" />)}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ Newsletter / CTA ══════════ */}
            <section className="px-4 sm:px-6 py-16 sm:py-28 max-w-7xl mx-auto">
                <Reveal direction="scale">
                    <div className="relative bg-[#5c1111] rounded-[2rem] sm:rounded-[3.5rem] px-6 sm:px-16 py-14 sm:py-20 text-center overflow-hidden shadow-2xl shadow-[#5c1111]/30 paper-texture">
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-600/20 rounded-full blur-[100px]"></div>
                        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>
                        <div className="absolute top-6 left-6 w-16 h-16 border-2 border-dashed border-white/10 rounded-full hidden sm:block"></div>
                        <div className="absolute bottom-6 right-6 w-10 h-10 border-2 border-white/10 rotate-45 hidden sm:block"></div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-6 sm:space-y-8">
                            <span className="inline-block text-amber-500 font-black uppercase tracking-[0.4em] text-[9px] sm:text-[10px]">Join the Inner Circle</span>
                            <h2 className="font-playfair text-3xl sm:text-5xl font-black text-[#efece6] leading-tight">Be First to Every <span className="font-dancing italic text-amber-500">Heritage Drop</span></h2>
                            <p className="text-white/60 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
                                New artisan collections release in small, numbered batches. Members of the circle hear about them 48 hours before anyone else.
                            </p>
                            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                                <input
                                    type="email"
                                    required
                                    placeholder="Your email address..."
                                    className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amber-500/60 focus:bg-white/15 transition-all"
                                />
                                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all hover:-translate-y-0.5 shadow-xl flex items-center justify-center gap-2">
                                    Join <Send size={14} />
                                </button>
                            </form>
                            <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em]">No spam. Only sacred art. Unsubscribe anytime.</p>
                        </div>
                    </div>
                </Reveal>
            </section>
        </div>
    );
};
