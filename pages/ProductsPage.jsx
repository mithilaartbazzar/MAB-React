import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, Heart, ShieldCheck, Truck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';

const BASE_CATEGORY_LABELS = {
    'all': 'All Works',
    'paintings': 'Paintings',
    'accessories': 'Accessories',
    'home-decor': 'Home Decor',
    'wall-art': 'Wall Art',
    'textile-art': 'Textile Art',
};

const CATEGORY_ALIASES = {
    crafts: 'accessories',
    textiles: 'textile-art',
};

const normalizeCategory = (value) => {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, '-');
    return normalized;
};

const categoryLabel = (category) => category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const SORT_OPTIONS = [
    { key: 'featured', label: 'Featured First' },
    { key: 'price-asc', label: 'Price: Low to High' },
    { key: 'price-desc', label: 'Price: High to Low' },
    { key: 'rating', label: 'Top Rated' },
    { key: 'name', label: 'Name: A to Z' },
];

const STYLE_OPTIONS = [
    { key: 'traditional', label: 'Traditional', terms: ['traditional', 'mithila', 'folk', 'handmade', 'painting'] },
    { key: 'modern', label: 'Modern', terms: ['modern', 'contemporary', 'minimal'] },
    { key: 'nature', label: 'Nature', terms: ['nature', 'floral', 'flower', 'bird', 'tree', 'fish', 'sun'] },
    { key: 'god', label: 'God & Goddess', terms: ['god', 'goddess', 'krishna', 'radha', 'shiva', 'sita', 'ram'] },
    { key: 'folklore', label: 'Folklore', terms: ['folklore', 'story', 'myth', 'village', 'folk'] },
];

const productSearchText = (product) => [
    product.style,
    product.theme,
    product.tags,
    product.category,
    product.name,
    product.description,
].flat().filter(Boolean).join(' ').toLowerCase();

export const ProductsPage = ({ products, addToCart, wishlist, toggleWishlist }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(() => searchParams.get('q') || '');
    const [sort, setSort] = useState('featured');
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [priceLimit, setPriceLimit] = useState(null);
    const category = normalizeCategory(searchParams.get('cat') || 'all');
    const selectedCategory = CATEGORY_ALIASES[category] || category;

    const maxPrice = useMemo(() => Math.max(10000, ...products.map((product) => Number(product.price) || 0)), [products]);
    const activePriceLimit = priceLimit ?? maxPrice;

    useEffect(() => {
        setSearch(searchParams.get('q') || '');
    }, [searchParams]);

    const setCategory = (cat) => {
        if (cat === 'all') searchParams.delete('cat');
        else searchParams.set('cat', cat);
        setSearchParams(searchParams, { replace: true });
    };

    const toggleStyle = (styleKey) => {
        setSelectedStyles((current) => current.includes(styleKey)
            ? current.filter((style) => style !== styleKey)
            : [...current, styleKey]);
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('all');
        setSelectedStyles([]);
        setPriceLimit(null);
        setSort('featured');
    };

    const categoryCounts = useMemo(() => {
        const counts = { all: products.length };
        products.forEach(p => {
            const normalizedCategory = normalizeCategory(p.category);
            counts[normalizedCategory] = (counts[normalizedCategory] || 0) + 1;
        });
        return counts;
    }, [products]);

    const categoryOptions = useMemo(() => {
        const existingCategories = new Set(products.map((product) => normalizeCategory(product.category)).filter(Boolean));
        const options = Object.entries(BASE_CATEGORY_LABELS);
        existingCategories.forEach((categoryKey) => {
            if (!BASE_CATEGORY_LABELS[categoryKey] && !options.some(([key]) => key === categoryKey)) {
                options.push([categoryKey, categoryLabel(categoryKey)]);
            }
        });
        return options;
    }, [products]);

    const filtered = useMemo(() => {
        const list = products.filter(p => {
            const q = search.toLowerCase();
            const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.storeName || '').toLowerCase().includes(q);
            const matchesCategory = selectedCategory === 'all' || normalizeCategory(p.category) === selectedCategory;
            const productText = productSearchText(p);
            const matchesStyle = selectedStyles.length === 0 || selectedStyles.some((styleKey) => {
                const style = STYLE_OPTIONS.find((option) => option.key === styleKey);
                return style?.terms.some((term) => productText.includes(term));
            });
            const matchesPrice = (Number(p.price) || 0) <= activePriceLimit;
            return matchesSearch && matchesCategory && matchesStyle && matchesPrice;
        });
        switch (sort) {
            case 'price-asc': return [...list].sort((a, b) => a.price - b.price);
            case 'price-desc': return [...list].sort((a, b) => b.price - a.price);
            case 'rating': return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'name': return [...list].sort((a, b) => a.name.localeCompare(b.name));
            default: return [...list].sort((a, b) => (b.featured === true) - (a.featured === true));
        }
    }, [products, search, selectedCategory, selectedStyles, activePriceLimit, sort]);

    return (
        <div className="min-h-screen bg-[#f5f1e9] pb-20 pt-[5.8rem] text-[#292621] sm:pb-28 sm:pt-[6.6rem]">
            <section className="border-y border-[#ded7ca] bg-[#eee8dc]">
                <div className="relative mx-auto flex min-h-[190px] max-w-[1280px] items-center overflow-hidden px-5 py-8 sm:min-h-[235px] sm:px-10 lg:px-14">
                    <div className="relative z-10 max-w-md">
                        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#7c2020]">Traditional Art · Handcrafted · From Mithila</p>
                        <h1 className="font-playfair text-3xl font-bold leading-none text-[#292621] sm:text-5xl">Our Products</h1>
                        <p className="mt-4 max-w-sm text-[11px] leading-relaxed text-[#71695e] sm:text-xs">Explore our collection of authentic Mithila art, handmade by skilled artisans from Janakpur. Each piece carries a story, a tradition and a piece of our cultural heritage.</p>
                    </div>
                    {products[0]?.image && <img src={products[0].image} alt="Mithila artwork" className="absolute -right-10 top-0 h-full w-[58%] object-cover object-left opacity-80 mix-blend-multiply sm:-right-4 sm:w-[46%]" />}
                    <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-r from-[#eee8dc] via-[#eee8dc]/55 to-transparent" />
                </div>
            </section>

            <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-10">
                <div className="flex items-center gap-2 py-4 text-[10px] text-[#81786d] sm:py-5"><span>Home</span><span>/</span><span className="text-[#292621]">Shop</span></div>
                <div className="mb-5 flex items-center justify-between border-y border-[#ded7ca] py-3 sm:mb-7">
                    <button type="button" onClick={() => setFilterOpen(!filterOpen)} className="inline-flex min-h-10 items-center gap-2 border border-[#cfc6b8] bg-[#fbf9f5] px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#292621] lg:hidden"><Filter size={13} /> Filter</button>
                    <p className="hidden text-[10px] text-[#81786d] sm:block">Showing <strong className="text-[#292621]">1–{filtered.length}</strong> of {products.length} products</p>
                    <div className="ml-auto flex items-center gap-2 text-[10px] text-[#81786d]"><span>Sort by:</span><div className="relative"><select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none bg-transparent py-2 pl-1 pr-6 font-semibold text-[#292621] outline-none"><option value="featured">Popularity</option>{SORT_OPTIONS.filter((option) => option.key !== 'featured').map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}</select><ChevronDown size={12} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" /></div></div>
                </div>

                <div className="grid grid-cols-1 gap-7 lg:grid-cols-[185px_minmax(0,1fr)] lg:gap-8">
                    <aside className={`${filterOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className="border border-[#e0d8cb] bg-[#fbf9f5] p-4 sm:p-5">
                            <div className="mb-3 flex items-center justify-between"><h2 className="text-[10px] font-bold uppercase tracking-[0.16em]">Categories</h2><button type="button" className="lg:hidden" onClick={() => setFilterOpen(false)} aria-label="Close filters"><X size={15} /></button></div>
                            <div className="space-y-1 border-t border-[#e6dfd4] pt-2">{categoryOptions.map(([cat, label]) => <button key={cat} onClick={() => { setCategory(cat); setFilterOpen(false); }} className={`flex w-full items-center justify-between border-b border-[#eee8df] py-2 text-left text-[10px] transition-colors ${selectedCategory === cat ? 'font-bold text-[#7c2020]' : 'text-[#6f675e] hover:text-[#7c2020]'}`}><span>{label}</span><span className="text-[8px] text-[#a39a8d]">({categoryCounts[cat] || 0})</span></button>)}</div>
                            <div className="mt-6 border-t border-[#e6dfd4] pt-4"><h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em]">Price Range</h3><input type="range" min="0" max={maxPrice} step="100" value={activePriceLimit} onChange={(event) => setPriceLimit(Number(event.target.value))} className="h-1 w-full cursor-pointer accent-[#7c2020]" aria-label="Maximum price" /><div className="mt-2 flex justify-between text-[8px] text-[#81786d]"><span>Rs 0</span><span>{activePriceLimit >= maxPrice ? `Rs ${maxPrice.toLocaleString()}+` : `Up to Rs ${activePriceLimit.toLocaleString()}`}</span></div></div>
                            <div className="mt-6 border-t border-[#e6dfd4] pt-4"><h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em]">Style / Theme</h3>{STYLE_OPTIONS.map((style) => <label key={style.key} className="flex cursor-pointer items-center gap-2 py-1 text-[10px] text-[#6f675e]"><input type="checkbox" checked={selectedStyles.includes(style.key)} onChange={() => toggleStyle(style.key)} className="h-3 w-3 cursor-pointer accent-[#7c2020]" />{style.label}<span className="ml-auto text-[8px] text-[#a39a8d]">{products.filter((product) => style.terms.some((term) => productSearchText(product).includes(term))).length}</span></label>)}</div>
                            <button type="button" onClick={clearFilters} className="mt-6 w-full bg-[#292621] py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#7c2020]">Clear Filters</button>
                        </div>
                    </aside>

                    <main>
                        <div className="mb-4 flex items-center justify-between"><p className="text-[10px] text-[#81786d] sm:hidden">{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</p><div className="relative ml-auto w-full max-w-[265px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9387]" /><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full border-b border-[#cfc6b8] bg-transparent py-2 pl-8 pr-7 text-[11px] outline-none placeholder:text-[#a59c90] focus:border-[#7c2020]" />{search && <button type="button" onClick={() => setSearch('')} className="absolute right-1 top-1/2 -translate-y-1/2 text-[#81786d]" aria-label="Clear search"><X size={13} /></button>}</div></div>
                        {filtered.length > 0 ? <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-6 xl:grid-cols-4">{filtered.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 55}><ProductCard product={p} addToCart={addToCart} isWishlisted={wishlist.includes(p.id)} toggleWishlist={toggleWishlist} /></Reveal>)}</div> : <div className="border border-dashed border-[#cfc6b8] bg-[#fbf9f5] px-6 py-24 text-center"><Filter size={28} className="mx-auto mb-5 text-[#b8aea0]" /><h3 className="font-playfair text-2xl font-bold">No works found</h3><p className="mt-2 text-sm text-[#81786d]">Try another search or clear your filters.</p><button onClick={clearFilters} className="mt-6 bg-[#7c2020] px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-white">Clear Filters</button></div>}
                    </main>
                </div>
                <div className="mt-12 grid grid-cols-3 border-y border-[#ded7ca] py-5 text-center text-[#6f675e] sm:mt-16"><div className="flex flex-col items-center gap-1 border-r border-[#ded7ca] text-[8px] uppercase tracking-[0.13em] sm:flex-row sm:justify-center sm:text-[9px]"><ShieldCheck size={15} /> <span>100% Genuine</span></div><div className="flex flex-col items-center gap-1 border-r border-[#ded7ca] text-[8px] uppercase tracking-[0.13em] sm:flex-row sm:justify-center sm:text-[9px]"><Truck size={15} /> <span>Secure Delivery</span></div><div className="flex flex-col items-center gap-1 text-[8px] uppercase tracking-[0.13em] sm:flex-row sm:justify-center sm:text-[9px]"><Heart size={15} /> <span>Support Artists</span></div></div>
            </div>
        </div>
    );
}
