import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    User as UserIcon,
    LogOut,
    Shield,
    Store,
    Heart,
    Search,
    Menu,
    X,
} from 'lucide-react';



const NAV_LINKS = [
    { to: '/', label: 'Home', match: (path) => path === '/' },
    { to: '/products', label: 'Shop', match: (path) => path.startsWith('/products') || path.startsWith('/product/') },
    { to: '/journal', label: 'Journal', match: (path) => path.startsWith('/journal') },
    { to: '/advice', label: 'AI Art Consultant', match: (path) => path.startsWith('/advice') },
];

const DesktopNavLink = ({ to, active, children }) => (
    <Link
        to={to}
        className={`relative px-3 py-2 text-[13px] font-medium tracking-wide transition-colors ${
            active ? 'text-[#7C2020]' : 'text-[#5B5449] hover:text-[#241F1A]'
        }`}
    >
        {children}
        {active && (
            <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#7C2020]" aria-hidden />
        )}
    </Link>
);

export const Navbar = ({ cartCount, currentUser, setCurrentUser }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setMobileOpen(false);
        setSearchOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const logout = () => {
        setCurrentUser(null);
        navigate('/');
    };

    const runSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (q) navigate(`/products?q=${encodeURIComponent(q)}`);
        else navigate('/products');
        setSearchOpen(false);
        setQuery('');
    };

    const isActive = (link) => {
        if (typeof link.to === 'object' && link.to.hash) {
            return link.match(location.pathname, location.hash);
        }
        return link.match(location.pathname, location.hash);
    };

    const sellerLink = currentUser && (currentUser.role === 'seller' || currentUser.role === 'admin');

    return (
        <header className="fixed inset-x-0 top-0 z-[100] print:hidden">

            <div className="border-b border-[#E7E0D2] bg-[#FAF7F2]/95 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(36,31,26,0.08)]">
                <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:px-6 lg:flex lg:gap-4 lg:py-3.5">
                    <div className="flex items-center justify-start lg:flex-1">
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#241F1A] hover:bg-[#E7E0D2]/50 lg:hidden"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>

                        <Link to="/" className="hidden items-center gap-2.5 group shrink-0 lg:flex">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C2020] shadow-md shadow-[#7C2020]/25 transition-transform group-hover:scale-[1.03] lg:h-10 lg:w-10">
                                <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src="https://res.cloudinary.com/djmbuuz28/image/upload/v1761108817/logo.png"
                                    alt="Mithila Chitrakala Store"
                                />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="font-playfair text-lg font-bold text-[#241F1A] sm:text-xl">Mithila Chitrakala</span>
                                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8B8378]">Store</span>
                            </div>
                        </Link>
                    </div>

                    <Link to="/" className="flex items-center justify-center gap-2 group lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C2020] shadow-md shadow-[#7C2020]/20">
                            <img
                                className="h-7 w-7 rounded-full object-cover"
                                src="https://res.cloudinary.com/djmbuuz28/image/upload/v1761108817/logo.png"
                                alt=""
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-playfair text-[15px] font-bold text-[#241F1A]">Mithila Chitrakala</span>
                            <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#8B8378]">Store</span>
                        </div>
                    </Link>

                    <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Main">
                        {NAV_LINKS.map((link) => (
                            <DesktopNavLink key={link.label} to={link.to} active={isActive(link)}>
                                {link.label}
                            </DesktopNavLink>
                        ))}
                        {sellerLink && (
                            <Link
                                to="/seller"
                                className={`inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium ${
                                    location.pathname === '/seller' ? 'text-[#7C2020]' : 'text-[#5B5449] hover:text-[#241F1A]'
                                }`}
                            >
                                {currentUser.role === 'admin' ? <Shield size={14} /> : <Store size={14} />}
                                {currentUser.role === 'admin' ? 'Admin' : 'Seller'}
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center justify-end gap-0.5 sm:gap-2 lg:flex-1">
                        <button
                            type="button"
                            onClick={() => setSearchOpen((v) => !v)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#5B5449] transition-colors hover:bg-[#E7E0D2]/60 hover:text-[#241F1A]"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        <Link
                            to={currentUser ? '/profile' : '/login'}
                            className="hidden h-10 w-10 items-center justify-center rounded-full text-[#5B5449] transition-colors hover:bg-[#E7E0D2]/60 hover:text-[#241F1A] md:inline-flex"
                            title={currentUser ? 'Account' : 'Sign in'}
                        >
                            <UserIcon size={20} />
                        </Link>

                        <Link
                            to="/wishlist"
                            className={`hidden h-10 w-10 items-center justify-center rounded-full transition-colors md:inline-flex ${
                                location.pathname === '/wishlist'
                                    ? 'bg-[#7C2020]/10 text-[#7C2020]'
                                    : 'text-[#5B5449] hover:bg-[#E7E0D2]/60 hover:text-[#241F1A]'
                            }`}
                            title="Wishlist"
                        >
                            <Heart size={20} fill={location.pathname === '/wishlist' ? 'currentColor' : 'none'} />
                        </Link>

                        <Link
                            to="/cart"
                            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7C2020] text-white shadow-md transition-transform hover:scale-[1.03]"
                            title="Cart"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#241F1A] px-1 text-[9px] font-bold text-white ring-2 ring-[#FAF7F2]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {currentUser && (
                            <button
                                type="button"
                                onClick={logout}
                                className="hidden h-10 w-10 items-center justify-center rounded-full text-[#8B8378] hover:text-[#7C2020] lg:inline-flex"
                                title="Sign out"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {searchOpen && (
                    <div className="border-t border-[#E7E0D2] bg-[#FCF9F2] px-4 py-3 sm:px-6">
                        <form onSubmit={runSearch} className="mx-auto flex max-w-xl gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8378]" size={18} />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search art, artists, motifs..."
                                    className="w-full rounded-full border border-[#E7E0D2] bg-white py-2.5 pl-11 pr-4 text-sm text-[#241F1A] outline-none focus:border-[#7C2020]/40 focus:ring-2 focus:ring-[#7C2020]/10"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-full bg-[#7C2020] px-5 text-sm font-semibold text-white hover:bg-[#5E1717]"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-[120] lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-[#241F1A]/40 backdrop-blur-sm"
                        aria-label="Close menu"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-[#FAF7F2] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#E7E0D2] px-4 py-4">
                            <span className="font-playfair text-lg font-bold text-[#241F1A]">Menu</span>
                            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={runSearch} className="border-b border-[#E7E0D2] p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8378]" size={18} />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full rounded-xl border border-[#E7E0D2] py-2.5 pl-10 pr-3 text-sm"
                                />
                            </div>
                        </form>
                        <nav className="flex flex-col p-2">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    className="rounded-lg px-4 py-3 text-[15px] font-medium text-[#241F1A] hover:bg-[#E7E0D2]/40"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {sellerLink && (
                                <Link to="/seller" className="rounded-lg px-4 py-3 text-[15px] font-medium text-[#7C2020]">
                                    {currentUser.role === 'admin' ? 'Administration' : 'Artisan Portal'}
                                </Link>
                            )}
                        </nav>
                        <div className="mt-auto border-t border-[#E7E0D2] p-4">
                            {currentUser ? (
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E7E0D2] py-3 text-sm font-semibold text-[#7C2020]"
                                >
                                    <LogOut size={16} /> Sign Out
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex w-full items-center justify-center rounded-xl bg-[#7C2020] py-3 text-sm font-semibold text-white"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
