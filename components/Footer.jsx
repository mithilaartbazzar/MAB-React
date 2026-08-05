import React from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Mail } from 'lucide-react';

export const Footer = () => (
    <footer className="bg-stone-950 text-white print:hidden">
        <div className="mithila-divider"></div>
        <div className="pt-20 sm:pt-24 pb-[110px] lg:pb-16 px-6 relative overflow-hidden paper-texture">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#5c1111]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12 lg:gap-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <img
                              className="w-10 h-10 rounded-[0.5rem] shadow-lg"
                              src="https://res.cloudinary.com/djmbuuz28/image/upload/v1761108817/logo.png"
                              alt="Logo"
                            />
                            <div className="flex flex-col">
                                <h3 className="font-dancing text-2xl font-bold text-red-600 leading-none">Mithila Art Bazzar</h3>
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-500 mt-1">Est. Heritage &bull; Janakpur</span>
                            </div>
                        </div>
                        <p className="text-stone-500 text-sm leading-relaxed font-light max-w-sm">
                            Elevating thousands of years of Mithila tradition to the modern stage. We work directly with rural artisans to bring their divine stories to your home.
                        </p>
                        <div className="space-y-3 text-stone-500 text-xs">
                            <p className="flex items-center gap-3"><MapPin size={14} className="text-[#5c1111]" /> Janakpur Dham, Nepal</p>
                            <p className="flex items-center gap-3"><Mail size={14} className="text-[#5c1111]" /> hello@mithilaartbazzar.com</p>
                        </div>
                        <div className="flex gap-3">
                            <a href="https://www.instagram.com/mithilachitrakalastore" className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/5 rounded-full hover:bg-[#5c1111] hover:border-[#5c1111] hover:-translate-y-1 transition-all" target='_blank' rel="noreferrer" title="Instagram"><i className="fa-brands fa-instagram text-[16px]"></i></a>
                            <a href="https://www.facebook.com/profile.php?id=61578104247563" className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/5 rounded-full hover:bg-[#5c1111] hover:border-[#5c1111] hover:-translate-y-1 transition-all" target='_blank' rel="noreferrer" title="Facebook"><i className="fa-brands fa-facebook-f text-[16px]"></i></a>
                            <a href="https://www.tiktok.com/@mithila_chitrakala" className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/5 rounded-full hover:bg-[#5c1111] hover:border-[#5c1111] hover:-translate-y-1 transition-all" target='_blank' rel="noreferrer" title="TikTok"><i className="fa-brands fa-tiktok text-[15px]"></i></a>
                        </div>
                    </div>

                    {/* The Vault */}
                    <div>
                        <h4 className="font-playfair text-lg font-black mb-6 sm:mb-8 text-amber-500">The Vault</h4>
                        <ul className="space-y-4 text-stone-500 text-[11px] font-black uppercase tracking-widest">
                            <li><Link to="/products" className="hover:text-white hover:pl-1 transition-all inline-block">Our Collection</Link></li>
                            <li><Link to="/products?cat=paintings" className="hover:text-white hover:pl-1 transition-all inline-block">Paintings</Link></li>
                            <li><Link to="/products?cat=home-decor" className="hover:text-white hover:pl-1 transition-all inline-block">Home Decor</Link></li>
                            <li><Link to="/advice" className="hover:text-white hover:pl-1 transition-all inline-block">AI Art Consultant</Link></li>
                            <li><Link to="/wishlist" className="hover:text-white hover:pl-1 transition-all inline-block">My Wishlist</Link></li>
                        </ul>
                    </div>

                    {/* Concierge */}
                    <div>
                        <h4 className="font-playfair text-lg font-black mb-6 sm:mb-8 text-amber-500">Concierge</h4>
                        <ul className="space-y-4 text-stone-500 text-[11px] font-black uppercase tracking-widest">
                            <li><Link to="/profile" className="hover:text-white hover:pl-1 transition-all inline-block" title='Track Your Order'>Track Collection</Link></li>
                            <li><Link to="#" className="hover:text-white hover:pl-1 transition-all inline-block" title='Authentication'>Authentication</Link></li>
                            <li><Link to="#" className="hover:text-white hover:pl-1 transition-all inline-block" title='Shipping & Returns'>Shipping & Returns</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-white hover:pl-1 transition-all inline-block" title='Privacy Policy'>Privacy Circle</Link></li>
                        </ul>
                    </div>

                    {/* Journal */}
                    <div>
                        <h4 className="font-playfair text-lg font-black mb-6 sm:mb-8 text-amber-500">Journal</h4>
                        <p className="text-stone-500 text-[11px] mb-5 font-black uppercase tracking-widest leading-relaxed">Join our circle for heritage drops &amp; artisan stories.</p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                            <input type="email" required placeholder="Your email..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm flex-1 min-w-0 focus:outline-none focus:border-[#5c1111] focus:bg-white/10 transition-all placeholder:text-stone-600" />
                            <button type="submit" className="bg-[#5c1111] px-4 py-3 rounded-xl hover:bg-red-700 hover:-translate-y-0.5 transition-all shadow-lg shrink-0" title="Subscribe"><Send size={16} /></button>
                        </form>
                        <p className="text-stone-700 text-[9px] font-bold uppercase tracking-widest mt-4">Small batches. No spam.</p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 mt-16 sm:mt-20 pt-8 sm:pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-stone-600 text-[10px] font-black uppercase tracking-[0.3em] text-center md:text-left">
                        &copy; 2025 Mithila Art Bazzar &bull; Heritage Reserved
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
