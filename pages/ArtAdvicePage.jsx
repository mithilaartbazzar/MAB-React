import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Info, Quote, History, Lightbulb, User, X, ArrowRight, Leaf } from 'lucide-react';
import { getArtAdvice } from '../geminiService.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ArtAdvicePage = () => {
    const [prompt, setPrompt] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [chat, loading]);

    const askGemini = async () => {
        if (!prompt.trim() || loading) return;
        const msg = prompt;
        setPrompt('');
        setChat(prev => [...prev, { role: 'user', text: msg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setLoading(true);

        try {
            const res = await getArtAdvice(msg);
            setChat(prev => [...prev, { role: 'ai', text: res, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (error) {
            setChat(prev => [...prev, { role: 'ai', text: 'The spirits of Mithila are momentarily silent. Please try again.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        { label: 'Symbolism of Fish', icon: '🐠' },
        { label: 'Natural Dye Secrets', icon: '🌿' },
        { label: 'Kachni vs Bharni', icon: '🎨' },
        { label: 'Art for New Homes', icon: '🏠' }
    ];

    return (
        <div className="min-h-screen bg-[#f8f6f2] text-[#241F1A]">
            <div className="relative overflow-hidden">
                <div className="absolute left-[-10rem] top-[-7rem] h-80 w-80 rounded-[1rem] bg-[#7C2020]/10 blur-3xl" />
                <div className="absolute right-[-8rem] top-[20rem] h-80 w-80 rounded-[1rem] bg-[#b36b00]/10 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 md:px-8 md:pt-24">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="mb-0 flex items-center gap-2">
                                <img src="https://res.cloudinary.com/djmbuuz28/image/upload/v1785741761/logo.png" alt="Mithila Chitrakala Store" className="h-8 w-8 rounded-[0.5rem]" />
                                <span className="font-playfair text-[10px] font-black uppercase tracking-[0.25em] text-[#7C2020]">
                                    Mithila Chitrakala Store
                                </span>
                            </div>
                            <h1 className="font-playfair text-2xl font-black leading-none text-[#241F1A] sm:text-3xl">
                                The Mithila <span className="italic text-[#7C2020]">Oracle</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 rounded-[0.5rem] border border-[#E7E0D2] bg-white px-4 py-3 shadow-sm">
                            <Sparkles size={16} className="text-[#7C2020]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#5B5449]">
                                Art Guidance
                            </span>
                        </div>
                    </div>

                    <div className="grid min-h-[620px] grid-cols-1 gap-4 lg:grid-cols-[310px_minmax(0,1fr)]">
                        <aside className="hidden lg:flex lg:flex-col">
                            <div className="flex h-full flex-col rounded-[0.5rem] border border-[#E7E0D2] bg-white p-4 shadow-[0_20px_80px_-40px_rgba(36,31,26,0.45)]">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7C2020] text-white shadow-lg shadow-[#7C2020]/20">
                                        <Sparkles size={22} />
                                    </div>
                                    <div>
                                        <div className="font-playfair text-2xl font-black leading-none text-[#241F1A]">
                                            Digital<br />Guardian
                                        </div>
                                        <div className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#7C2020]">
                                            Mithila Oracle by Taigra Nexus Labs
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[0.5rem] border border-[#E7E0D2] bg-[#fffaf3] p-4">
                                    <p className="font-playfair text-lg font-black italic text-[#241F1A]">
                                        Explore the living language of Mithila.
                                    </p>
                                    <p className="mt-3 text-[12px] leading-6 text-[#71695e]">
                                        Ask about motifs, materials, symbolism, and the perfect artwork for your home.
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Lightbulb size={18} className="text-[#B36B00]" />
                                        <span className="font-playfair text-xl font-black text-[#241F1A]">
                                            Oracle Wisdom
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {suggestions.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setPrompt(item.label)}
                                                className="group flex w-full items-center gap-2 rounded-[0.5rem] border border-[#E7E0D2] bg-[#f8f6f2] px-4 py-3 text-left transition-all duration-300 hover:bg-[#7C2020] hover:text-white"
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base shadow-sm transition-transform duration-300 group-hover:scale-110">
                                                    {item.icon}
                                                </span>
                                                <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#5B5449] transition-colors duration-300 group-hover:text-white">
                                                    {item.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 rounded-[0.5rem] border border-[#E7E0D2] bg-[#000] p-3">
                                    <div className="flex items-center gap-3">
                                        <Leaf size={16} className="text-[#7C2020]" />
                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#fffaf3]">
                                            Heritage Guide <ArrowRight size={12} className="ml-1 inline-block" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[0.5rem] border border-white bg-white shadow-[0_20px_80px_-40px_rgba(36,31,26,0.45)]">
                            <div className="flex items-center justify-between border-b border-[#E7E0D2] bg-[#fffaf3] px-3 py-2 md:px-6">
                                <div className="flex items-center gap-2 md:gap-4">
                                    <div className="relative">
                                        <div className="flex h-8 w-8 md:h-14 md:w-14 items-center justify-center rounded-[1rem] bg-[#241F1A] text-white shadow-lg">
                                            <Quote size={15} md:size={22} />
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-[#4BA24A]" />
                                    </div>
                                    <div>
                                        <div className="font-playfair text-l font-black text-[#241F1A] md:text-xl">
                                            Mithila <span className="italic text-[#7C2020]">Oracle</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#71695e]">
                                            Listening
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#4BA24A] animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="flex rounded-xl bg-[#f8f6f2] p-3 text-[#71695e] transition hover:bg-[#E7E0D2]" title="History">
                                        <History size={18} />
                                    </button>
                                    <button className="rounded-xl bg-[#f8f6f2] p-3 text-[#71695e] transition hover:bg-[#E7E0D2]" title="Info">
                                        <Info size={18} />
                                    </button>
                                </div>
                            </div>

                            <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-4 md:px-4 md:py-2">
                                {chat.length === 0 ? (
                                    <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                                        <div className="relative flex h-15 w-15 md:h-20 md:w-20 items-center justify-center rounded-[2rem] border border-[#E7E0D2] bg-[#fffaf3] shadow-[0_24px_70px_-30px_rgba(36,31,26,0.45)]">
                                            <Sparkles size={30} className="text-[#7C2020]" />
                                        </div>
                                        <div className="mt-4 max-w-md">
                                            <div className="font-playfair text-2xl font-black italic text-[#241F1A]">
                                                Namaste
                                            </div>
                                            <p className="mt-1 text-xs md:text-sm leading-4 text-[#71695e]">
                                                Whisper your question about the sacred threads of tradition. I am here to guide your artistic journey.
                                            </p>
                                        </div>

                                        <div className="mt-4 flex flex-wrap justify-center gap-1 lg:hidden">
                                            {suggestions.map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setPrompt(item.label)}
                                                    className="rounded-full border border-[#E7E0D2] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#5B5449] transition hover:bg-[#7C2020] hover:text-white"
                                                >
                                                    {item.icon} {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {chat.map((msg, i) => (
                                            <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex max-w-[90%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-[#7C2020] text-white' : 'bg-[#241F1A] text-white'}`}>
                                                        {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className={`rounded-[0.5rem] md:rounded-[1.6rem] px-2 py-1 md:px-3 md:py-1 shadow-sm ${msg.role === 'user' ? 'bg-[#7C2020] text-white ' : 'border border-[#E7E0D2] bg-[#fffaf3] text-[#241F1A]'}`}>
                                                            {msg.role === 'ai' ? (
                                                                <div className="text-[12px] leading-4 md:text-[14px]">
                                                                    <ReactMarkdown
                                                                        remarkPlugins={[remarkGfm]}
                                                                        components={{
                                                                            p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
                                                                            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                                                                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                                                                            li: ({node, ...props}) => <li className="pl-2" {...props} />,
                                                                            strong: ({node, ...props}) => <strong className="font-black text-[#7C2020]" {...props} />,
                                                                            h3: ({node, ...props}) => <h3 className="font-playfair text-lg font-black mb-3 mt-6 text-[#7C2020]" {...props} />,
                                                                            h4: ({node, ...props}) => <h4 className="font-playfair text-base font-black mb-2 mt-4 text-[#241F1A]" {...props} />,
                                                                            em: ({node, ...props}) => <em className="italic" {...props} />,
                                                                        }}
                                                                    >
                                                                        {msg.text}
                                                                    </ReactMarkdown>
                                                                </div>
                                                            ) : (
                                                                <div className="text-[13px] font-semibold leading-6 md:text-[14px]">
                                                                    {msg.text}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${msg.role === 'user' ? 'text-right text-[#71695e]' : 'text-left text-[#71695e]'}`}>
                                                            {msg.timestamp}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="flex max-w-[80%] items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#241F1A] text-white">
                                                <Sparkles size={16} className="animate-spin" />
                                            </div>
                                            <div className="flex items-center gap-2 rounded-[1.5rem] border border-[#E7E0D2] bg-[#fffaf3] px-5 py-4">
                                                <span className="h-2 w-2 rounded-full bg-[#7C2020] animate-bounce" />
                                                <span className="h-2 w-2 rounded-full bg-[#7C2020] animate-bounce [animation-delay:-0.15s]" />
                                                <span className="h-2 w-2 rounded-full bg-[#7C2020] animate-bounce [animation-delay:-0.3s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-[#E7E0D2] bg-[#fffaf3] px-2 py-3 md:px-8">
                                <div className="mx-auto flex justify-center max-w-3xl items-center gap-2">
                                    <div className="relative flex-1">
                                        <textarea
                                            className="min-h-[70px] w-full resize-none rounded-[1rem] border border-[#E7E0D2] bg-white px-2.5 py-2 font-medium text-[11px] text-[#241F1A] outline-none transition focus:border-[#7C2020] focus:ring-4 focus:ring-[#7C2020]/10 md:text-[14px]"
                                            placeholder="Ask about symbols, natural dyes, artist stories..."
                                            name="Ai-Prompt-input"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), askGemini())}
                                        />
                                    </div>
                                    <button
                                        onClick={askGemini}
                                        disabled={loading || !prompt.trim()}
                                        className={`flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full transition-all ${loading || !prompt.trim() ? 'cursor-not-allowed bg-[#d8d2ca] text-white' : 'bg-[#7C2020] text-white shadow-lg shadow-[#7C2020]/20 hover:bg-[#241F1A]'}`}
                                        title="Ask the oracle"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>

                                <div className="mt-2 flex items-center justify-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em] text-[#71695e]">
                                    <Sparkles size={15} className="text-[#7C2020]" />
                                    Respectfully connecting tradition and curiosity
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
