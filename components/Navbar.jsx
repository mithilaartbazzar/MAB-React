import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Shield, Store, Heart } from 'lucide-react';

const NavLink = ({ to, active, children }) => (
    <Link
        to={to}
        className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${active ? 'bg-[#5c1111] text-white shadow-sm shadow-[#5c1111]/20' : 'text-stone-500 hover:text-[#5c1111] hover:bg-[#f9f2ed]'}`}
    >
        {children}
    </Link>
);

export const Navbar = ({ cartCount, currentUser, setCurrentUser }) => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        setCurrentUser(null);
        navigate('/');
    };

    return (
        <nav className="fixed inset-x-0 top-1 md:top-4 z-[100] px-4 sm:px-6 print:hidden">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
                <div className={`rounded-[1.75rem] border border-white/60 bg-white/85 shadow-[0_18px_60px_rgba(41,30,24,0.12)] backdrop-blur-xl transition-all duration-500  py-2 px-2 sm:px-6`}> 
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-[1rem] bg-[#5c1111] text-white shadow-lg shadow-[#5c1111]/20 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.03]">
                            <img
                                className="h-8 w-8 md:h-10 md:w-10 rounded-[1rem] object-cover"
                                src="https://res.cloudinary.com/djmbuuz28/image/upload/v1761108817/logo.png"
                                alt="Logo"
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-dancing text-[18px] sm:text-xl font-bold text-[#2a2723] tracking-tight">Mithila</span>
                            <span className="text-[7px] md:text-[9px] uppercase tracking-[0.35em] text-[#5c1111]/70">Art Bazzar</span>
                        </div>
                    </Link>
                </div>

                <div className="hidden md:hidden lg:block rounded-[1.75rem] border border-white/60 bg-white/85 shadow-[0_18px_60px_rgba(41,30,24,0.12)] backdrop-blur-xl transition-all duration-500 py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                        <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
                        <NavLink to="/products" active={location.pathname === '/products'}>Gallery</NavLink>
                        <NavLink to="/advice" active={location.pathname === '/advice'}>AI Art Consultant</NavLink>
                        {currentUser && (currentUser.role === 'seller' || currentUser.role === 'admin') && (
                            <Link
                                to="/seller"
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${location.pathname === '/seller' ? 'bg-[#f7ece6] text-[#5c1111]' : 'text-stone-500 hover:bg-[#f9f2ed] hover:text-[#5c1111]'}`}
                            >
                                {currentUser.role === 'admin' ? <Shield size={14} /> : <Store size={14} />}
                                {currentUser.role === 'admin' ? 'Administration' : 'Artisan Portal'}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/60 bg-white/85 shadow-[0_18px_60px_rgba(41,30,24,0.12)] backdrop-blur-xl transition-all duration-500 py-1 px-1 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2 justify-end">
                        <Link to="/wishlist" className={`hidden sm:inline-flex items-center justify-center rounded-full border border-transparent p-3 text-stone-600 transition-all duration-300 ${location.pathname === '/wishlist' ? 'bg-[#f9f2ed] text-[#5c1111]' : 'hover:bg-[#f9f2ed] hover:text-[#5c1111]'}`} title="My Wishlist">
                            <Heart size={20} fill={location.pathname === '/wishlist' ? 'currentColor' : 'none'} />
                        </Link>

                        {currentUser ? (
                            <div className="flex items-center gap-2">
                                <Link to="/profile" className="relative inline-flex items-center justify-center rounded-full border border-stone-200 bg-white p-3 text-stone-600 transition-all duration-300 hover:border-[#5c1111]/40 hover:text-[#5c1111]" title="My Profile">
                                    <UserIcon size={20} />
                                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white"></span>
                                </Link>
                                <button onClick={logout} className="hidden lg:inline-flex items-center justify-center rounded-full p-3 text-stone-500 transition-colors duration-300 hover:text-red-700" title="Sign Out">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="rounded-full border border-stone-200 bg-[#f4f1ec] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#5c1111] transition-all duration-300 hover:bg-white hover:border-[#5c1111]/30 hover:shadow-lg">
                                Sign In
                            </Link>
                        )}

                        <Link to="/cart" className="relative inline-flex items-center justify-center rounded-full bg-[#5c1111] px-4 py-3 text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2a2723]" title="My Cart">
                            <ShoppingCart size={18} className="transition-transform duration-300" />
                            {cartCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[9px] font-black text-white shadow-md border border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
