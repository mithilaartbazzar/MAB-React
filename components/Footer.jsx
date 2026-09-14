import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Mail } from 'lucide-react';
import { dbService } from '../services/dbservices';

export const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleJournalSubscribe = async (event) => {
        event.preventDefault();

        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
            setStatus({ type: 'error', message: 'Enter a valid email address.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await dbService.subscribeJournalEmail(trimmedEmail);
            setStatus({ type: 'success', message: 'You are on the journal list.' });
            setEmail('');
        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'Unable to join the journal list.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer id="contact" className="scroll-mt-28 bg-stone-950 text-white print:hidden">
            <div className="mithila-divider"></div>
            <div className="relative overflow-hidden px-4 pb-[92px] pt-12 paper-texture sm:px-6 sm:pb-[110px] sm:pt-24 lg:px-6 lg:pb-16">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#5c1111]/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-16">
                        {/* Brand */}
                        <div className="col-span-2 space-y-4 sm:space-y-6 lg:col-span-1">
                            <div className="flex items-center gap-3">
                                <img
                                  className="h-9 w-9 rounded-[0.5rem] shadow-lg sm:h-10 sm:w-10"
                                  src="https://res.cloudinary.com/djmbuuz28/image/upload/v1761108817/logo.png"
                                  alt="Logo"
                                />
                                <div className="flex flex-col">
                                    <h3 className="font-dancing text-xl font-bold leading-none text-red-600 sm:text-2xl">Mithila Chitrakala Store</h3>
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-500 mt-1">Est. Heritage &bull; Janakpur</span>
                                </div>
                            </div>
                            <p className="max-w-sm text-xs font-light leading-relaxed text-stone-500 sm:text-sm">
                                Elevating thousands of years of Mithila tradition to the modern stage. We work directly with rural artisans to bring their divine stories to your home.
                            </p>
                            <div className="space-y-2 text-[11px] text-stone-500 sm:space-y-3 sm:text-xs">
                                <p className="flex items-center gap-3"><MapPin size={14} className="text-[#5c1111]" /> Janakpur Dham, Nepal</p>
                                <p className="flex items-center gap-3"><Mail size={14} className="text-[#5c1111]" /> hello@mithilaartbazzar.com</p>
                            </div>
                            <div className="flex gap-3">
                                <a href="https://www.instagram.com/mithilachitrakalastore" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:-translate-y-1 hover:border-[#5c1111] hover:bg-[#5c1111] sm:h-10 sm:w-10" target='_blank' rel="noreferrer" title="Instagram"><i className="fa-brands fa-instagram text-[14px] sm:text-[16px]"></i></a>
                                <a href="https://www.facebook.com/profile.php?id=61578104247563" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:-translate-y-1 hover:border-[#5c1111] hover:bg-[#5c1111] sm:h-10 sm:w-10" target='_blank' rel="noreferrer" title="Facebook"><i className="fa-brands fa-facebook-f text-[14px] sm:text-[16px]"></i></a>
                                <a href="https://www.tiktok.com/@mithila_chitrakala" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:-translate-y-1 hover:border-[#5c1111] hover:bg-[#5c1111] sm:h-10 sm:w-10" target='_blank' rel="noreferrer" title="TikTok"><i className="fa-brands fa-tiktok text-[13px] sm:text-[15px]"></i></a>
                            </div>
                        </div>

                        {/* The Vault */}
                        <div>
                            <h4 className="mb-4 font-playfair text-base font-black text-amber-500 sm:mb-8 sm:text-lg">The Vault</h4>
                            <ul className="space-y-2.5 text-[10px] font-black uppercase tracking-widest text-stone-500 sm:space-y-4 sm:text-[11px]">
                                <li><Link to="/products" className="hover:text-white hover:pl-1 transition-all inline-block">Our Collection</Link></li>
                                <li><Link to="/products?cat=paintings" className="hover:text-white hover:pl-1 transition-all inline-block">Paintings</Link></li>
                                <li><Link to="/products?cat=home-decor" className="hover:text-white hover:pl-1 transition-all inline-block">Home Decor</Link></li>
                                <li><Link to="/advice" className="hover:text-white hover:pl-1 transition-all inline-block">AI Art Consultant</Link></li>
                                <li><Link to="/wishlist" className="hover:text-white hover:pl-1 transition-all inline-block">My Wishlist</Link></li>
                            </ul>
                        </div>

                        {/* Concierge */}
                        <div>
                            <h4 className="mb-4 font-playfair text-base font-black text-amber-500 sm:mb-8 sm:text-lg">Concierge</h4>
                            <ul className="space-y-2.5 text-[10px] font-black uppercase tracking-widest text-stone-500 sm:space-y-4 sm:text-[11px]">
                                <li><Link to="/profile" className="hover:text-white hover:pl-1 transition-all inline-block" title='Track Your Order'>Track Collection</Link></li>
                                <li><Link to="#" className="hover:text-white hover:pl-1 transition-all inline-block" title='Authentication'>Authentication</Link></li>
                                <li><Link to="#" className="hover:text-white hover:pl-1 transition-all inline-block" title='Shipping & Returns'>Shipping & Returns</Link></li>
                                <li><Link to="/privacy-policy" className="hover:text-white hover:pl-1 transition-all inline-block" title='Privacy Policy'>Privacy Circle</Link></li>
                            </ul>
                        </div>

                        {/* Journal */}
                        <div className="col-span-2 sm:col-span-1">
                            <h4 className="mb-4 font-playfair text-base font-black text-amber-500 sm:mb-8 sm:text-lg">Journal</h4>
                            <p className="mb-3 text-[10px] font-black uppercase leading-relaxed tracking-widest text-stone-500 sm:mb-5 sm:text-[11px]">Join our circle for heritage drops &amp; artisan stories.</p>
                            <form onSubmit={handleJournalSubscribe} className="flex gap-2">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Your email..."
                                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs transition-all placeholder:text-stone-600 focus:border-[#5c1111] focus:bg-white/10 focus:outline-none sm:px-4 sm:py-3 sm:text-sm"
                                />
                                <button disabled={loading} type="submit" className="shrink-0 rounded-xl bg-[#5c1111] px-3 py-2.5 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-70 sm:px-4 sm:py-3" title="Subscribe">
                                    <Send size={14} className="sm:h-4 sm:w-4" />
                                </button>
                            </form>
                            {status.message && (
                                <p className={`mt-4 text-[9px] font-black uppercase tracking-widest ${status.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>{status.message}</p>
                            )}
                            <p className="text-stone-700 text-[9px] font-bold uppercase tracking-widest mt-4">Small batches. No spam.</p>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:mt-20 sm:gap-6 sm:pt-10 md:flex-row">
                        <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-stone-600 sm:text-left sm:text-[10px] sm:tracking-[0.3em]">
                            &copy; 2025 Mithila Chitrakala Store &bull; Heritage Reserved
                        </p>
                        <div className="flex gap-5 md:gap-6 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-3 md:h-4" alt="PayPal" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg" className="h-3 md:h-4" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3 md:h-4" alt="Mastercard" />
                            <img src="https://cdn.brandfetch.io/idDVuHZ3OK/w/124/h/33/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1751351341090" className='h-4 md:h-5' alt="E-Sewa" />
                            <img src="https://cdn.brandfetch.io/idGPw_2fQs/w/1513/h/575/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B" className="h-5 md:h-6" alt="Khalti" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
