import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Plus, Heart, Eye, Share2, Check } from 'lucide-react';
import { Badge } from './Badge';
import { QuickViewModal } from './QuickViewModal';

export const ProductCard = ({ product, addToCart, isWishlisted, toggleWishlist }) => {
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

    const triggerFeedback = () => {
        setIsAnimating(false);
        // Force reflow
        void (null); 
        setTimeout(() => setIsAnimating(true), 10);
        setTimeout(() => setIsAnimating(false), 510);
    };

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        triggerFeedback();
    };

    useEffect(() => {
        if (isAdded) {
            const timer = setTimeout(() => setIsAdded(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isAdded]);

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        toggleWishlist?.(product.id);
        triggerFeedback();
    };

    const handleShare = async (e) => {
        e.preventDefault();
        const shareData = {
            title: `MAB - ${product.name}`,
            text: product.description,
            url: `${window.location.origin}/#/product/${product.slug}`
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err); 
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                setShowCopiedFeedback(true);
                setTimeout(() => setShowCopiedFeedback(false), 2000);
            } catch (err) {
                alert('Could not copy link to clipboard');
            }
        }
    };

    return (
        <>
            <div className="group flex h-full flex-col overflow-hidden rounded border border-[#e3dbcf] bg-[#fbf9f5] shadow-[0_3px_14px_rgba(70,52,32,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(70,52,32,0.12)]">
                <div className="relative aspect-[1.08/1] overflow-hidden bg-[#e9e0d4]">
                    <Link to={`/product/${product.slug}`} className="block h-full">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                        />
                    </Link>
                    
                    <div className="absolute left-2 top-1 z-10 sm:left-3 sm:top-3">
                        {product.badge && <Badge variant={product.badge === 'Bestseller' ? 'saffron' : 'primary'}>{product.badge}</Badge>}
                    </div>

                    <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 sm:right-3 sm:top-3 sm:gap-2">
                        <button 
                            onClick={handleToggleWishlist}
                            className={`rounded-full p-1.5 shadow-sm transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-4 sm:group-hover:translate-x-0 ${isWishlisted ? 'bg-[#7c2020] text-white' : 'bg-white/90 text-stone-400 hover:text-[#7c2020]'}`}
                            title="Add to Wishlist"
                        >
                            <Heart size={12} className="sm:w-[14px] sm:h-[14px]" fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                        <button 
                            onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
                            className="p-1.5 sm:p-2 bg-white/90 text-stone-400 hover:text-[#2a2723] rounded-full transition-all duration-300 shadow-sm sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-4 sm:group-hover:translate-x-0 delay-75 hidden sm:flex"
                            title="Quick View"
                        >
                            <Eye size={14} />
                        </button>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-20 p-2 transition-all duration-500 ease-out sm:translate-y-6 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        <button 
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`flex w-full items-center justify-center gap-1 rounded-sm py-2 text-[7px] font-black uppercase tracking-widest shadow-2xl transition-all duration-300 sm:gap-2 sm:py-2.5 sm:text-[9px]
                                ${isAdded ? 'bg-green-600 text-white' : 'bg-[#2a2723] text-white hover:bg-[#5c1111] sm:hover:scale-[1.02]'} 
                                ${isAnimating ? 'animate-feedback-bounce' : ''} 
                                active:scale-95`}
                        >
                            {isAdded ? (
                                <>
                                    <Check size={10} className="sm:w-[12px]" /> <span className="hidden xs:inline">Added</span><span className="xs:hidden">✓</span>
                                </>
                            ) : (
                                <>
                                    <Plus size={10} className="sm:w-[12px]" /> <span className="hidden xs:inline">Add To Bag</span><span className="xs:hidden">Add to cart</span>
                                </>
                            )}
                        </button>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a2723]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>

                <div className="flex flex-1 flex-col p-2.5 sm:p-4">
                    <div className="flex justify-between items-start mb-1 gap-2">
                        <Link to={`/product/${product.slug}`} className="hover:text-[#5c1111] transition-colors flex-1">
                            <h3 className="line-clamp-1 font-playfair text-[11px] font-bold leading-tight text-[#292621] sm:text-base">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-0.5 sm:gap-1 text-amber-600 mt-0.5 shrink-0">
                            <Star size={9} fill="currentColor" />
                            <span className="text-[8px] font-bold">{product.rating}</span>
                        </div>
                    </div>
                    <p className="mb-2 line-clamp-1 text-[7px] font-medium uppercase tracking-widest text-stone-400 sm:mb-3 sm:text-[9px]">{product.storeName}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-[#e5e1d8] pt-2 sm:pt-3">
                        <span className="font-playfair text-xs font-bold text-[#7c2020] sm:text-lg">Rs {product.price.toLocaleString()}</span>
                        <Link 
                            to={`/product/${product.slug}`} 
                            className="hidden xs:flex items-center gap-1 text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-[#2a2723] transition-colors group/link"
                        >
                            Details <ArrowRight size={10} className="sm:w-[12px] transition-transform group-hover/link:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            <QuickViewModal 
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                addToCart={addToCart}
            />
        </>
    );
};
