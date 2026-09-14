import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Frame, Heart, Leaf, Minus, Palette, Pin, Plus, Ruler, Send, ShoppingCart, Star, Truck, X } from 'lucide-react';
import { Badge } from '../components/Badge';
import { ProductCard } from '../components/ProductCard';
import { dbService } from '../services/dbservices';

export const ProductDetailPage = ({ products, addToCart, wishlist, toggleWishlist }) => {
    const slug = useLocation().pathname.split('/').pop();
    const product = products.find((item) => item.slug === slug);
    const [activeImg, setActiveImg] = useState(product?.image);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const navigate = useNavigate();
    const carouselRef = useRef(null);
    const thumbnailRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('mithila-user') || 'null');
    const isWishlisted = product ? wishlist.includes(product.id) : false;
    const isModerator = currentUser?.role === 'admin' || currentUser?.role === 'seller';

    useEffect(() => {
        if (!product) return;
        setActiveImg(product.image);
        setQuantity(1);
        window.scrollTo(0, 0);
        loadReviews();
    }, [product]);

    const loadReviews = async () => {
        if (product) setReviews(await dbService.getReviews(product.id));
    };

    const handleReviewSubmit = async (event) => {
        event.preventDefault();
        if (!currentUser || !product) return;
        setIsSubmittingReview(true);
        await dbService.addReview({ productId: product.id, userId: currentUser.id, userName: currentUser.name, ...newReview });
        setNewReview({ rating: 5, comment: '' });
        setIsSubmittingReview(false);
        loadReviews();
    };

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products
            .filter((item) => item.category === product.category && item.id !== product.id)
            .concat(products.filter((item) => item.category !== product.category && item.id !== product.id).slice(0, 4));
    }, [product, products]);

    const scrollCarousel = (direction) => {
        carouselRef.current?.scrollBy({ left: direction === 'left' ? -360 : 360, behavior: 'smooth' });
    };

    if (!product) {
        return <div className="flex min-h-screen items-center justify-center bg-[#f8f5ee] text-center"><div><h1 className="font-playfair text-4xl font-bold">Piece not found</h1><Link to="/products" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7c2020]"><ArrowLeft size={14} /> Back to gallery</Link></div></div>;
    }

    const images = [product.image, ...(product.images || [])];
    const showNextImage = () => {
        const currentIndex = Math.max(0, images.indexOf(activeImg));
        setActiveImg(images[(currentIndex + 1) % images.length]);
    };

    return (
        <main className="min-h-screen bg-[#fbf9f4] px-3 pb-16 pt-24 text-[#29251f] sm:px-6 sm:pb-24 sm:pt-28 lg:px-10">
            <div className="mx-auto max-w-[1220px]">
                <div className="mb-5 flex items-center justify-between text-[9px] text-stone-500 sm:mb-8 sm:text-[10px]">
                    <div className="flex min-w-0 items-center gap-1.5"><Link to="/" className="shrink-0 hover:text-[#7c2020]">Home</Link><span>/</span><Link to="/products" className="shrink-0 hover:text-[#7c2020]">Paintings</Link><span>/</span><span className="truncate text-stone-700">{product.name}</span></div>
                    <button onClick={() => navigate(-1)} className="hidden items-center gap-1.5 uppercase tracking-widest hover:text-[#7c2020] sm:flex"><ArrowLeft size={13} /> Back</button>
                </div>

                <section className="grid gap-7 sm:gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
                    <div className="grid grid-cols-[42px_1fr] gap-3 sm:grid-cols-[64px_1fr] sm:gap-7">
                        <div className="flex min-w-0 flex-col items-center">
                            <div ref={thumbnailRef} className="no-scrollbar flex max-h-[360px] w-full flex-col gap-2 overflow-y-auto sm:gap-3">
                            {images.map((image, index) => <button key={`${image}-${index}`} onClick={() => setActiveImg(image)} className={`aspect-[4/5] overflow-hidden rounded border bg-[#eee9df] p-0.5 transition ${activeImg === image ? 'border-[#9c2929] ring-1 ring-[#9c2929]' : 'border-transparent opacity-75 hover:opacity-100'}`} aria-label={`View image ${index + 1}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}
                            </div>
                            <button onClick={showNextImage} className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm hover:text-[#7c2020]" aria-label="Show next image"><ChevronDown size={14} /></button>
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-md bg-[#eee9df] p-1 sm:aspect-[1.12/1] sm:p-2"><img src={activeImg} alt={product.name} className="h-full w-full object-cover" /><button onClick={() => setIsImageZoomed(true)} className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow sm:bottom-3 sm:right-3 sm:h-8 sm:w-8" aria-label="View larger image"><ArrowUpRight size={14} /></button></div>
                    </div>

                    <div className="flex flex-col pt-1 lg:pt-2">
                        <div className="mb-3 flex items-start justify-between gap-4"><Badge variant="saffron">{product.badge || 'Original Artwork'}</Badge><button onClick={() => toggleWishlist(product.id)} className="flex h-8 w-8 items-center justify-center rounded border border-stone-200 text-[#7c2020]" aria-label="Add to wishlist"><Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} /></button></div>
                        <h1 className="max-w-xl font-playfair text-[1.4rem] leading-[1.08] text-[#20221f] sm:text-4xl lg:text-[2.55rem]">{product.name}</h1>
                        <p className="mt-1 text-xs text-stone-500 lg:text-sm">By <span className="font-semibold text-stone-700">{product.storeName || 'Mithila Artisan'}</span> <span className="mx-1">•</span> {product.location || 'Janakpur, Nepal'}</p>
                        <div className="mt-1 flex flex-col items-start gap-2"><span className="flex items-center gap-1 text-xs text-amber-600 lg:text-sm">{product.rating != null && <><Star size={13} fill="currentColor" /> {product.rating}</>} {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span><span className="font-playfair text-3xl font-bold text-[#29251f] lg:text-4xl">रु {product.price.toLocaleString()}</span></div>
                        <p className="mt-2 max-w-xl text-[12px] leading-6 text-stone-600 lg:text-base lg:leading-7">{product.description}</p>
                        <div className="mt-5 flex flex-row gap-1 border-y border-[#e8e1d6] py-4 text-[10px] text-stone-600 sm:gap-4 lg:gap-5 lg:text-base"><div className="flex items-center gap-1"><BadgeCheck size={20} className="text-[#7c2020]" /> Original artwork</div><div className="flex items-center border-x border-[#e8e1d6] px-3 gap-1"><Leaf size={20} className="text-[#7c2020]" /> Handmade &amp; eco-friendly</div><div className="flex items-center gap-1"><Truck size={20} className="text-[#7c2020]" /> Ships from Nepal</div></div>
                        <p className="mt-5 text-[10px] font-semibold text-stone-700 lg:text-xs">Quantity</p>
                        <div className="mt-2 flex gap-2 sm:gap-3"><div className="flex h-10 w-24 shrink-0 items-center justify-between rounded border border-[#e0d8cc] bg-white px-1.5 sm:w-28 sm:px-2"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-stone-500" aria-label="Decrease quantity"><Minus size={13} /></button><span className="text-xs px-3 border-x border-[#e8e1d6]">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="p-1 text-stone-500" aria-label="Increase quantity"><Plus size={13} /></button></div><button onClick={() => { for (let index = 0; index < quantity; index += 1) addToCart(product); }} className="flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded bg-[#8e1717] px-2 text-[11px] font-semibold text-white transition hover:bg-[#6f1010] sm:max-w-[260px] sm:px-4 sm:text-xs"><ShoppingCart size={14} /> Add to cart</button></div>
                        <div className="mt-3 flex items-center gap-2 rounded border border-[#eee5d8] bg-[#f5f0e7] px-3 py-3 text-[10px] text-stone-600 lg:text-sm"><Truck size={14} className="text-[#7c2020]" /> Estimated delivery: {product.delivery || 'Not specified'} <ChevronRight size={13} className="ml-auto" /></div>
                    </div>
                </section>

                <section className="mt-14 border-t border-[#e7e0d4] pt-5">
                    <div className="flex gap-6 overflow-x-auto border-b border-[#e7e0d4] text-[10px] font-semibold whitespace-nowrap sm:gap-7 lg:text-sm" role="tablist" aria-label="Product information">
                        {[['description', 'Description'], ['details', 'Details'], ['artist', 'Artist'], ['shipping', 'Shipping & Return']].map(([tab, label]) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`border-b-2 pb-3 transition-colors ${activeTab === tab ? 'border-[#8e1717] text-[#8e1717]' : 'border-transparent text-stone-500 hover:text-stone-800'}`}>{label}</button>)}
                    </div>
                    <div className="grid gap-6 py-6 sm:gap-8 sm:py-7 lg:grid-cols-[1.12fr_1fr_0.92fr] lg:items-stretch lg:gap-6 lg:py-6">
                        {activeTab === 'description' && <div><h2 className="font-playfair text-lg lg:text-2xl">About This Artwork</h2><p className="mt-3 max-w-lg text-xs leading-5 text-stone-600 lg:mt-3 lg:text-base lg:leading-7">{product.description}</p><p className="mt-4 font-playfair text-sm italic text-stone-600 lg:mt-5 lg:text-base">Art is not just what we see, but what we feel.</p></div>}
                        {activeTab === 'details' && <div><h2 className="font-playfair text-lg lg:text-2xl">Artwork Details</h2><p className="mt-3 max-w-lg text-xs leading-5 text-stone-600 lg:mt-3 lg:text-base lg:leading-7">Technical information supplied by the artist for this artwork.</p></div>}
                        {activeTab === 'artist' && <div><h2 className="font-playfair text-lg lg:text-2xl">About the Artist</h2><p className="mt-3 max-w-lg text-xs leading-5 text-stone-600 lg:mt-3 lg:text-base lg:leading-7">This artwork is offered by {product.storeName || 'a Mithila artisan'} from {product.location || 'Nepal'}.</p></div>}
                        {activeTab === 'shipping' && <div><h2 className="font-playfair text-lg lg:text-2xl">Shipping &amp; Return</h2><p className="mt-3 max-w-lg text-xs leading-5 text-stone-600 lg:mt-3 lg:text-base lg:leading-7">Delivery: {product.delivery || 'Not specified'}.</p><p className="mt-2 max-w-lg text-xs leading-5 text-stone-600 lg:text-base lg:leading-7">{product.instruction || 'Please handle this handmade artwork with care.'}</p></div>}
                        <div className="grid grid-cols-2 gap-y-5 rounded-md bg-[#f5f0e8] p-5 text-[10px] text-stone-600 lg:gap-y-5 lg:p-5 lg:text-[15px]"><div className="flex items-center gap-2"><Palette size={15} /> Material</div><div className="text-stone-800">{product.material || 'Not specified'}</div><div className="flex items-center gap-2"><Ruler size={15} /> Size</div><div className="text-stone-800">{product.length || 'Not specified'}</div><div className="flex items-center gap-2"><Frame size={15} /> Frame</div><div className="text-stone-800">Not included</div><div className="flex items-center gap-2"><CircleCheck size={15} /> Authenticity</div><div className="text-stone-800">{product.authenticity || 'Not specified'}</div></div>
                        <div className="flex flex-col rounded-md border border-[#d9bda7] bg-[#fffaf3] p-5 lg:p-5"><div className="mb-3 text-[#c98255]"><Leaf size={36} /></div><h3 className="font-playfair text-base lg:text-xl">Support Traditional Artists</h3><p className="mt-2 text-[10px] leading-4 text-stone-500 lg:text-[15px] lg:leading-6">Your purchase helps preserve Mithila art and supports local artists and their families.</p><Link to="/journal" className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold text-[#7c2020] lg:mt-auto lg:pt-5 lg:text-sm">Learn More <ArrowRight size={14} /></Link></div>
                    </div>
                </section>

                <section className="mt-2"><div className="mb-4 flex items-end justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8e1717] lg:text-xs">Curated for you</p><h2 className="mt-1 inline-flex items-center gap-1 font-playfair text-xl lg:text-2xl">You May Also Like <ArrowRight size={17} className="text-[#8e1717]" /></h2></div><div className="flex gap-2"><button onClick={() => scrollCarousel('left')} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200" aria-label="Previous products"><ChevronLeft size={15} /></button><button onClick={() => scrollCarousel('right')} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200" aria-label="Next products"><ChevronRight size={15} /></button></div></div><div ref={carouselRef} className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">{relatedProducts.map((related) => <div key={related.id} className="min-w-[180px] sm:min-w-[210px]"><ProductCard product={related} addToCart={addToCart} isWishlisted={wishlist.includes(related.id)} toggleWishlist={toggleWishlist} /></div>)}</div></section>

                <section className="mt-12 border-t border-[#e7e0d4] pt-10"><div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]"><div><h2 className="font-playfair text-2xl lg:text-3xl">Voices of the Gallery</h2>{currentUser ? <form onSubmit={handleReviewSubmit} className="mt-5 space-y-3 rounded-md bg-[#f5f0e8] p-5"><p className="text-[10px] font-semibold uppercase tracking-widest lg:text-xs">Leave a review</p><div className="flex gap-1">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className={newReview.rating >= star ? 'text-amber-500' : 'text-stone-300'} aria-label={`${star} stars`}><Star size={16} fill={newReview.rating >= star ? 'currentColor' : 'none'} /></button>)}</div><textarea required value={newReview.comment} onChange={(event) => setNewReview({ ...newReview, comment: event.target.value })} className="min-h-24 w-full resize-none rounded border border-stone-200 bg-white p-3 text-xs outline-none focus:border-[#8e1717] lg:text-sm" placeholder="Share your experience..." /><button disabled={isSubmittingReview} className="flex items-center gap-2 rounded bg-[#29251f] px-4 py-2 text-[10px] font-semibold text-white lg:text-xs">{isSubmittingReview ? 'Submitting...' : 'Submit review'} <Send size={12} /></button></form> : <div className="mt-5 rounded-md bg-[#f5f0e8] p-5"><p className="text-xs leading-5 text-stone-600 lg:text-sm">Sign in to share your appreciation for this artwork.</p><Link to="/login" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[#8e1717] lg:text-xs">Sign in to review <ArrowRight size={12} /></Link></div>}</div><div className="space-y-4">{reviews.length === 0 ? <p className="rounded-md bg-[#f5f0e8] p-6 text-xs italic text-stone-500 lg:text-sm">This piece awaits its first collector&apos;s voice.</p> : reviews.map((review) => <article key={review.id} className="border-b border-[#e7e0d4] pb-4"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold lg:text-sm">{review.userName}</p><p className="text-[10px] text-stone-400 lg:text-xs">{new Date(review.date).toLocaleDateString()}</p></div><div className="flex text-amber-500">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={12} fill={star <= review.rating ? 'currentColor' : 'none'} />)}</div></div><p className="mt-2 text-sm italic text-stone-600 lg:text-base">&quot;{review.comment}&quot;</p>{isModerator && <button onClick={() => { dbService.toggleReviewPinned(review.id, !review.pinned).then(loadReviews); }} className="mt-2 flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#8e1717] lg:text-[10px]"><Pin size={11} /> {review.pinned ? 'Unpin' : 'Pin'}</button>}</article>)}</div></div></section>
            </div>
            {isImageZoomed && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={`Enlarged image of ${product.name}`} onClick={() => setIsImageZoomed(false)}><button onClick={() => setIsImageZoomed(false)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-800" aria-label="Close enlarged image"><X size={20} /></button><img src={activeImg} alt={product.name} className="max-h-[90vh] max-w-full object-contain" onClick={(event) => event.stopPropagation()} /></div>}
        </main>
    );
};
