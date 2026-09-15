import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Truck,
    Lock,
    HeartHandshake,
    BookOpen,
} from 'lucide-react';
import { dbService } from '../services/dbservices';
import { Reveal } from '../components/Reveal';
import { ProductCard } from '../components/ProductCard';

const CATEGORIES = [
    { key: 'paintings', label: 'Paintings', fallback: 'https://res.cloudinary.com/djmbuuz28/image/upload/v1789361816/Cozy_Madhubani_Art_Display_zdqqyb.png' },
    { key: 'crafts', label: 'Handmade Crafts', fallback: 'https://res.cloudinary.com/djmbuuz28/image/upload/v1789362149/Mithila_Folk_Art_Craft_Display_asqu81.png' },
    { key: 'home-decor', label: 'Home Decor', fallback: 'https://res.cloudinary.com/djmbuuz28/image/upload/v1789361747/Sunlit_Madhubani_Folk-Art_Cushion_klxbkq.png' },
    { key: 'textiles', label: 'Clothing & Textiles', fallback: 'https://res.cloudinary.com/djmbuuz28/image/upload/v1789361579/Artisanal_Folk_Textile_Display_bgkfql.png' },
    { key: 'art-products', label: 'Art Products', fallback: 'https://res.cloudinary.com/djmbuuz28/image/upload/v1789363065/Mithila_Art_Still_Life_Vignette_i1trvb.png' },
    { key: 'cultural-gifts', label: 'Cultural Gifts', fallback: 'https://res.cloudinary.com/djmbuuz28/image/upload/v1789362834/Mithila_Artisan_Gift_Box_Still_Life_g78pvw.png' },
];

const FALLBACK_ARTISTS = [
    { name: 'Sita Devi', location: 'Janakpur, Nepal' },
    { name: 'Kamla Jha', location: 'Dhanusha, Nepal' },
    { name: 'Rekha Kumari', location: 'Madhesh, Nepal' },
    { name: 'Pushpa Devi', location: 'Janakpur, Nepal' },
    { name: 'Sunita Devi', location: 'Sarlahi, Nepal' },
];

const TRUST_ITEMS = [
    { icon: ShieldCheck, title: 'Authentic Artwork', text: 'Original, culturally inspired Mithila pieces' },
    { icon: HeartHandshake, title: 'Support Local Artists', text: 'Fair trade and direct artisan support' },
    { icon: Lock, title: 'Secure Ordering', text: 'Safe checkout and protected payments' },
    { icon: Truck, title: 'Nepal-Wide Delivery', text: 'Reliable shipping across the region' },
];

const DEFAULT_SLIDES = [];
const EMPTY_HERO_SLIDE = { image: '', link: '/products', cta: 'Explore Collection' };

const HOME_CATEGORY_ALIASES = {
    'handmade-crafts': 'crafts',
    'crafts': 'crafts',
    'textiles': 'textile-art',
    'textile-art': 'textiles',
    'clothing-and-textiles': 'textile-art',
};

const normalizeCategoryValue = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, '-');

const normalizeHeroSlide = (slide) => ({
    id: slide.id,
    cta: slide.cta ?? slide.cta_label ?? 'Explore Collection',
    link: slide.link ?? slide.cta_link ?? '/products',
    image: slide.image ?? '',
    sort_order: slide.sort_order ?? 0,
    active: slide.active ?? true,
});

const HeroSection = ({ heroSlides }) => {
    const [current, setCurrent] = useState(0);
    const [previous, setPrevious] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isSliding, setIsSliding] = useState(false);
    const touchStartX = useRef(null);
    const slides = heroSlides.length ? heroSlides : DEFAULT_SLIDES;
    const count = slides.length;

    useEffect(() => {
        if (paused || count < 2) return undefined;
        const timer = setInterval(() => {
            const next = (current + 1) % count;
            setPrevious(current);
            setCurrent(next);
            setIsSliding(true);
            window.setTimeout(() => setIsSliding(false), 760);
        }, 3000);
        return () => clearInterval(timer);
    }, [paused, count, current]);

    useEffect(() => {
        if (current >= count) setCurrent(0);
    }, [count, current]);

    const go = (dir) => {
        if (count < 2) return;
        const next = (current + dir + count) % count;
        setPrevious(current);
        setCurrent(next);
        setIsSliding(true);
        window.setTimeout(() => setIsSliding(false), 760);
    };

    const selectSlide = (index) => {
        if (index === current || count < 2) return;
        setPrevious(current);
        setCurrent(index);
        setIsSliding(true);
        window.setTimeout(() => setIsSliding(false), 760);
    };

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
        touchStartX.current = null;
    };

    const currentSlide = slides[current] || slides[0] || EMPTY_HERO_SLIDE;
    const previousSlide = slides[previous] || slides[0] || EMPTY_HERO_SLIDE;

    return (
        <section
            className="mithila-hero-section"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-label="Hero"
        >
            <div className="mithila-hero-shell">
                <div
                    className={`mithila-hero-image ${isSliding ? 'mithila-hero-image-is-sliding' : ''}`}
                    role="img"
                    aria-label="Mithila artwork"
                >
                    <div
                        className="mithila-hero-image-layer mithila-hero-image-layer-previous"
                        style={{ backgroundImage: `url("${previousSlide.image}")` }}
                        aria-hidden="true"
                    />
                    <div
                        className="mithila-hero-image-layer mithila-hero-image-layer-current"
                        style={{ backgroundImage: `url("${currentSlide.image}")` }}
                        aria-hidden="true"
                    />
                    <div className="mithila-hero-vignette" aria-hidden="true" />

                    <div className="mithila-hero-overlay-row">
                        {count > 1 && (
                            <div className="mithila-hero-controls">
                                <button type="button" onClick={() => go(-1)} className="mithila-hero-control" aria-label="Previous">
                                    <ChevronLeft size={16} />
                                </button>
                                <button type="button" onClick={() => go(1)} className="mithila-hero-control" aria-label="Next">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {count > 1 && (
                            <div className="mithila-hero-dots">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => selectSlide(i)}
                                        aria-label={`Slide ${i + 1}`}
                                        className={`mithila-hero-dot ${i === current ? 'is-current' : ''}`}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="mithila-hero-button-wrap">
                            <Link to={currentSlide.link ?? '/products'} className="mithila-hero-cta-primary">
                                {currentSlide.cta ?? 'Explore Collection'} <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SectionHead = ({ title, subtitle, viewAllLink }) => (
    <div className="mb-4 flex items-end justify-between gap-3 sm:mb-7 sm:gap-4">
        <div>
            <h2 className="font-playfair text-[1.2rem] font-black leading-tight tracking-tight text-[#241F1A] sm:text-[2.2rem]">{title}</h2>
            {subtitle && <p className="mt-1 text-[11px] leading-relaxed text-[#8B8378] sm:mt-1.5 sm:text-sm">{subtitle}</p>}
        </div>
        {viewAllLink && (
            <Link to={viewAllLink} className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7C2020] transition-all hover:gap-2">
                View All <ArrowRight size={14} />
            </Link>
        )}
    </div>
);

export const HomePage = ({ products, addToCart, wishlist, toggleWishlist }) => {
    const [heroSlides, setHeroSlides] = useState([]);
    const [journalPosts, setJournalPosts] = useState([]);
    const featured = products.filter((p) => p.featured).slice(0, 5);
    const featuredFill = featured.length < 5
        ? [...featured, ...products.filter((p) => !p.featured).slice(0, 5 - featured.length)]
        : featured;

    const categoryImage = (cat) => cat.fallback;

    useEffect(() => {
        const loadHeroSlides = async () => {
            try {
                const slides = await dbService.getHeroSlides();
                if (slides?.length) {
                    setHeroSlides(
                        slides
                            .map(normalizeHeroSlide)
                            .filter((s) => s.active !== false)
                            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                    );
                }
            } catch (error) {
                console.error('Failed to load homepage hero slides:', error);
            }
        };
        loadHeroSlides();
    }, []);

    useEffect(() => {
        dbService.getJournalPosts()
            .then((posts) => {
                if (posts?.length) {
                    setJournalPosts(posts.filter((post) => post.published !== false).map((post) => ({
                        ...post,
                        link: `/journal/${post.slug}`,
                    })));
                }
            })
            .catch(() => {});
    }, []);

    const featuredArtists = useMemo(() => {
        const byName = new Map();
        products.forEach((p) => {
            const name = p.artist || p.storeName;
            if (!name || byName.has(name)) return;
            byName.set(name, {
                name,
                location: p.location || 'Nepal',
                preview: p.image,
                productSlug: p.slug,
            });
        });
        const fromDb = Array.from(byName.values()).slice(0, 5);
        if (fromDb.length >= 3) return fromDb;
        return FALLBACK_ARTISTS.map((a) => {
            const match = fromDb.find((d) => d.name === a.name);
            return match || { ...a, preview: null, productSlug: null };
        }).slice(0, 5);
    }, [products]);

    return (
        <div className="bg-[#FAF7F2] pb-12 text-[#241F1A] lg:pb-0">
            <div className="pt-[4.5rem] lg:pt-[4.6rem]">
                <Reveal className="lg:mx-auto lg:px-4 lg:pt-6 delay-100">
                    <HeroSection heroSlides={heroSlides} />
                </Reveal>
            </div>

            <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <SectionHead title="Shop by Category" subtitle="Discover art, crafts and cultural pieces from Mithila" viewAllLink="/products" />
                <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:gap-4 sm:px-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.key}
                            to={`/products?cat=${cat.key}`}
                            className="group w-[88px] shrink-0 flex-col items-center gap-1.5 sm:w-[140px] sm:gap-2 lg:w-auto lg:shrink lg:flex"
                        >
                            <div className="w-full overflow-hidden rounded-xl border border-[#E7E0D2] bg-white shadow-[0_12px_30px_-18px_rgba(36,31,26,0.28)] transition-transform duration-300 group-hover:-translate-y-1 sm:rounded-2xl">
                                <div className="aspect-square">
                                    <img src={categoryImage(cat)} alt={cat.label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                </div>
                            </div>
                            <span className="mt-1 block text-center text-[10px] font-semibold leading-tight text-[#241F1A] sm:mt-2 sm:text-xs">{cat.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1280px] px-4 pb-6 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
                <SectionHead title="Featured Mithila Art" subtitle="Original art pieces, handpicked for you" viewAllLink="/products" />
                {featuredFill.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[#E7E0D2] bg-white/50 px-6 py-12 text-center text-sm text-[#8B8378]">
                        New artworks are being curated. Visit the shop to browse the full collection.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-5">
                        {featuredFill.map((p, idx) => (
                            <Reveal key={p.id} delay={idx * 60}>
                                <ProductCard
                                    product={p}
                                    addToCart={addToCart}
                                    isWishlisted={wishlist.includes(p.id)}
                                    toggleWishlist={toggleWishlist}
                                />
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>

            <section id="our-story" className="scroll-mt-28 mx-auto max-w-[1280px] px-4 pb-6 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
                <Reveal>
                    <div className="relative overflow-hidden rounded-[1.7rem] border border-[#E7E0D2] bg-[#E8DCC8] shadow-[0_16px_36px_-23px_rgba(36,31,26,0.32)]">
                        <div className="grid items-center md:grid-cols-2">
                            <div className="relative order-2 md:order-1">
                                <img
                                    src="https://res.cloudinary.com/djmbuuz28/image/upload/v1789363791/Overhead_Mithila_Folk_Dance_Celebration_icgoxi.png"
                                    alt="Mithila artist at work"
                                    className="h-full min-h-[200px] w-full object-cover sm:min-h-[260px]"
                                    loading="lazy"
                                />
                            </div>
                            <div className="relative order-1 space-y-2.5 p-4 sm:space-y-4 sm:p-8 md:order-2 md:p-10 lg:p-12">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7C2020]">Our Story</p>
                                <h2 className="font-playfair text-xl font-black leading-tight text-[#241F1A] sm:text-4xl">
                                    More Than Art — It&apos;s a Legacy
                                </h2>
                                <p className="max-w-lg text-xs leading-relaxed text-[#5B5449] sm:text-[15px]">
                                    Mithila art is a centuries-old tradition, born in the heart of Nepal and India and passed down through generations. Mithila Chitrakala Store connects master artisans with collectors worldwide — preserving heritage while supporting sustainable livelihoods.
                                </p>
                                <Link to="/products" className="inline-flex items-center gap-2 rounded-lg bg-[#7C2020] px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#5E1717] sm:px-5 sm:py-3 sm:text-sm">
                                    Explore the Collection <ArrowRight size={15} />
                                </Link>
                                <div
                                    className="pointer-events-none absolute bottom-2 right-2 hidden h-28 w-28 opacity-20 md:block"
                                    aria-hidden
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cpath fill='none' stroke='%237C2020' stroke-width='2' d='M60 10c15 25 35 20 40 45-12 2-22 12-40 15-18-3-28-13-40-15 5-25 25-20 40-45z'/%3E%3Cpath fill='%237C2020' d='M55 55l5 20 5-20 10 8-12-5 5-12-5 12-12 5z'/%3E%3C/svg%3E")`,
                                        backgroundSize: 'contain',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>

            <section id="featured-artists" className="scroll-mt-28 mx-auto max-w-[1280px] px-4 pb-6 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
                <SectionHead title="Featured Artists" subtitle="Meet the talented makers behind these masterpieces" viewAllLink="/products" />
                <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:gap-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
                    {featuredArtists.map((artist) => (
                        <div key={artist.name} className="w-[156px] shrink-0 rounded-xl border border-[#E7E0D2] bg-white p-2.5 shadow-[0_12px_30px_-18px_rgba(36,31,26,0.28)] sm:w-[200px] sm:rounded-[1.15rem] sm:p-4 lg:w-auto">
                            <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
                                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-[#E7E0D2] bg-[#F7F1E4] sm:h-14 sm:w-14">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=7C2020&color=fff&size=128`}
                                        alt={artist.name}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="min-w-0 text-left">
                                    <p className="truncate font-playfair text-xs font-black text-[#241F1A] sm:text-base">{artist.name}</p>
                                    <p className="truncate text-[9px] text-[#8B8378] sm:text-[11px]">{artist.location}</p>
                                </div>
                            </div>
                            {artist.preview && (
                                <div className="mb-2 overflow-hidden rounded-lg border border-[#E7E0D2] sm:mb-3 sm:rounded-xl">
                                    <img src={artist.preview} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                                </div>
                            )}
                            <Link
                                to={artist.productSlug ? `/product/${artist.productSlug}` : `/products?q=${encodeURIComponent(artist.name)}`}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7C2020] hover:gap-2 transition-all sm:text-xs"
                            >
                                View Profile <ArrowRight size={13} />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-y border-[#E7E0D2] bg-[#F3EBDD]">
                <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-3 px-4 py-5 sm:grid-cols-2 sm:gap-6 sm:px-6 sm:py-10 lg:grid-cols-4 lg:px-8">
                    {TRUST_ITEMS.map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#7C2020]/15 text-[#7C2020] sm:h-10 sm:w-10">
                                <item.icon size={16} className="sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-[#241F1A] sm:text-sm">{item.title}</p>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-[#8B8378] sm:text-xs">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="journal" className="scroll-mt-28 mx-auto max-w-[1280px] px-4 py-5 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <div className="mb-4 flex items-end justify-between gap-2 sm:mb-7 sm:gap-4">
                    <div>
                        <div className="mb-1.5 inline-flex items-center gap-2 text-[#7C2020] sm:mb-2">
                            <BookOpen size={16} className="sm:h-[18px] sm:w-[18px]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Cultural Journal</span>
                        </div>
                        <h2 className="font-playfair text-[1.3rem] font-black leading-tight text-[#241F1A] sm:text-[2.2rem]">Stories &amp; Heritage</h2>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#8B8378] sm:mt-1.5 sm:text-sm">Editorial glimpses into Mithila culture, makers, and motifs</p>
                    </div>
                    <Link to="/journal" className="hidden shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7C2020] sm:inline-flex">
                        View Journal <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid gap-1 grid-cols-3 md:grid-cols-3 md:gap-5">
                    {journalPosts.map((post, i) => (
                        <Reveal key={post.title} delay={i * 80}>
                            <Link to={typeof post.link === 'string' ? post.link : post.link} className="group block overflow-hidden rounded-[0.5rem] border border-[#E7E0D2] bg-white shadow-[0_14px_32px_-22px_rgba(36,31,26,0.35)] transition-transform hover:-translate-y-1">
                                <div className="aspect-[16/10] overflow-hidden bg-[#F7F1E4]">
                                    <img src={post.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                </div>
                                <div className="space-y-1 p-3 sm:space-y-2 sm:p-5">
                                    <h3 className="font-playfair text-[0.8rem] font-black leading-tight line-clamp-2 text-[#241F1A] group-hover:text-[#7C2020] sm:text-xl">{post.title}</h3>
                                    <p className="text-[11px] leading-tight text-[#5B5449] line-clamp-3 sm:text-sm">{post.excerpt}</p>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C2020]">
                                        Read more <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>
        </div>
    );
};
