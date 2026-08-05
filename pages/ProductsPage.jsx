import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';

const CATEGORY_LABELS = {
    'all': 'All Works',
    'paintings': 'Paintings',
    'accessories': 'Accessories',
    'home-decor': 'Home Decor',
    'Wall Art': 'Wall Art',
    'Textile Art': 'Textile Art',
};

const SORT_OPTIONS = [
    { key: 'featured', label: 'Featured First' },
    { key: 'price-asc', label: 'Price: Low to High' },
    { key: 'price-desc', label: 'Price: High to Low' },
    { key: 'rating', label: 'Top Rated' },
    { key: 'name', label: 'Name: A to Z' },
];

export const ProductsPage = ({ products, addToCart, wishlist, toggleWishlist }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('featured');
    const category = searchParams.get('cat') || 'all';

    const setCategory = (cat) => {
        if (cat === 'all') searchParams.delete('cat');
        else searchParams.set('cat', cat);
        setSearchParams(searchParams, { replace: true });
    };

    const categoryCounts = useMemo(() => {
        const counts = { all: products.length };
        products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
        return counts;
    }, [products]);

    const filtered = useMemo(() => {
        const list = products.filter(p => {
            const q = search.toLowerCase();
            const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.storeName || '').toLowerCase().includes(q);
            const matchesCategory = category === 'all' || p.category === category;
            return matchesSearch && matchesCategory;
        });
        switch (sort) {
            case 'price-asc': return [...list].sort((a, b) => a.price - b.price);
            case 'price-desc': return [...list].sort((a, b) => b.price - a.price);
            case 'rating': return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'name': return [...list].sort((a, b) => a.name.localeCompare(b.name));
            default: return [...list].sort((a, b) => (b.featured === true) - (a.featured === true));
        }
    }, [products, search, category, sort]);

    return (
        <div className="pt-24 sm:pt-40 pb-20 sm:pb-32 min-h-screen">
            {/* ── Page Header Band ── */}
            <div className="px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="relative bg-[#f8f6f2] border border-[#e5e1d8] rounded-[2rem] sm:rounded-[3rem] px-6 sm:px-14 py-10 sm:py-16 mb-8 sm:mb-12 overflow-hidden paper-texture">
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#5c1111]/5 rounded-full blur-[80px]"></div>
                    <div className="absolute -bottom-10 left-1/4 w-48 h-48 bg-amber-600/5 rounded-full blur-[60px]"></div>
                    <div className="hidden sm:block absolute top-8 right-10 w-14 h-14 border-2 border-dashed border-[#5c1111]/10 rounded-full"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                        <div>
                            <SectionHeading subtitle="Artisan Originals" title="The Heritage Vault" />
                            <p className="text-stone-400 text-xs sm:text-sm font-light max-w-md -mt-2 sm:-mt-4">
                                Every piece is one-of-a-kind, hand-painted and shipped with its certificate of origin.
                            </p>
                        </div>
                        <div className="w-full lg:w-auto lg:min-w-[420px]">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search motifs, artists, stories..."
                                    className="w-full pl-14 pr-12 py-4 sm:py-5 bg-white border border-[#d1cdc7] rounded-2xl sm:rounded-[1.8rem] text-sm focus:ring-4 focus:ring-[#5c1111]/5 focus:border-[#5c1111] transition-all shadow-sm outline-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#5c1111]"><X size={16} /></button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Filter / Sort Toolbar ── */}
            <div className="px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8 sm:mb-12">
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 no-scrollbar sm:mx-0 sm:px-0">
                        {Object.keys(CATEGORY_LABELS).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`group px-5 sm:px-7 py-3 sm:py-4 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2 ${category === cat ? 'bg-[#5c1111] text-white border-[#5c1111] shadow-xl premium-shadow' : 'bg-[#f8f6f2] text-stone-500 border-[#d1cdc7] hover:border-[#5c1111]/30 hover:text-[#5c1111]'}`}
                            >
                                {CATEGORY_LABELS[cat]}
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black ${category === cat ? 'bg-white/15 text-white' : 'bg-[#e5e1d8] text-stone-400 group-hover:bg-[#5c1111]/10 group-hover:text-[#5c1111]'}`}>
                                    {categoryCounts[cat] || 0}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <p className="text-stone-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
                            {filtered.length} {filtered.length === 1 ? 'Piece' : 'Pieces'}
                        </p>
                        <div className="relative">
                            <SlidersHorizontal size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="appearance-none pl-10 pr-10 py-3 sm:py-4 bg-[#f8f6f2] border border-[#d1cdc7] rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-600 outline-none focus:border-[#5c1111] cursor-pointer transition-all hover:border-[#5c1111]/30"
                            >
                                {SORT_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                            </select>
                            <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* ── Grid ── */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                        {filtered.map((p, i) => (
                            <Reveal key={p.id} delay={(i % 4) * 70}>
                                <ProductCard
                                    product={p}
                                    addToCart={addToCart}
                                    isWishlisted={wishlist.includes(p.id)}
                                    toggleWishlist={toggleWishlist}
                                />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 sm:py-40 bg-[#f8f6f2] rounded-[2rem] sm:rounded-[4rem] border border-dashed border-[#d1cdc7] px-6">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#efece6] rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mx-auto mb-6 sm:mb-8 text-stone-300 shadow-inner">
                            <Filter size={32} />
                        </div>
                        <h3 className="font-playfair text-2xl sm:text-4xl font-black text-[#2a2723] mb-3">Silent Corridors</h3>
                        <p className="text-stone-400 font-light max-w-xs mx-auto text-sm sm:text-base">These specific motifs are currently only whispered in the artist's studio.</p>
                        <button onClick={() => { setSearch(''); setCategory('all'); }} className="mt-8 bg-[#5c1111] text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#2a2723] transition-all shadow-xl">Clear All Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}
