import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, X } from 'lucide-react';
import { dbService } from '../services/dbservices';

const CulturalJournalPage = () => {
    const { slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [isImageZoomed, setIsImageZoomed] = useState(false);

    useEffect(() => {
        dbService.getJournalPosts()
            .then((data) => {
                if (data?.length) setPosts(data.filter((item) => item.published !== false));
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!isImageZoomed) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsImageZoomed(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isImageZoomed]);

    const post = slug ? posts.find((item) => item.slug === slug) : null;

    if (slug && !post) {
        return (
            <div className="min-h-screen px-4 pb-24 pt-32 text-center sm:px-6">
                <h1 className="font-playfair text-3xl font-black text-[#241F1A]">Story not found</h1>
                <Link to="/journal" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7C2020]">
                    <ArrowLeft size={15} /> Back to the journal
                </Link>
            </div>
        );
    }

    if (post) {
        return (
            <article className="min-h-screen bg-[#FAF7F2] pb-24 pt-28 sm:pt-36">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <Link to="/journal" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7C2020]">
                        <ArrowLeft size={15} /> Cultural Journal
                    </Link>
                    <div className="mt-6 overflow-hidden rounded-xl border border-[#E7E0D2] bg-white shadow-[0_18px_40px_-24px_rgba(36,31,26,0.3)] sm:rounded-[1.75rem]">
                        <button type="button" onClick={() => setIsImageZoomed(true)} className="group block w-full cursor-zoom-in" aria-label={`View larger image for ${post.title}`}>
                            <img src={post.image} alt={post.title} className="aspect-[16/8] w-full object-contain transition-opacity group-hover:opacity-90" />
                        </button>
                        <div className="p-5 sm:p-10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7C2020]">Mithila Cultural Journal</p>
                            <h1 className="mt-3 font-playfair text-2xl font-black leading-tight text-[#241F1A] sm:text-5xl">{post.title}</h1>
                            <p className="mt-3 max-w-2xl text-[0.875rem] leading-relaxed text-[#5B5449] sm:text-lg">{post.body}</p>
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#8B8378]">{post.excerpt}</p>
                        </div>
                    </div>
                    {isImageZoomed && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={`Enlarged image of ${post.title}`} onClick={() => setIsImageZoomed(false)}>
                        <button type="button" onClick={() => setIsImageZoomed(false)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-800 shadow-lg" aria-label="Close enlarged image"><X size={20} /></button>
                        <img src={post.image} alt={post.title} className="max-h-[90vh] max-w-full object-contain" onClick={(event) => event.stopPropagation()} />
                    </div>}
                    <div className="mt-8 gap-4 flex flex-wrap sm:mt-12">
                        {posts.filter((item) => item.slug !== post.slug).map((item) => (
                            <Link key={item.slug} to={`/journal/${item.slug}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7C2020]">
                                Read {item.title} <ArrowRight size={14} />
                            </Link>
                        ))}
                    </div>
                </div>
            </article>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] pb-24 pt-28 sm:pt-36">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 text-[#7C2020]"><BookOpen size={17} /><span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cultural Journal</span></div>
                    <h1 className="mt-3 font-playfair text-4xl font-black leading-tight text-[#241F1A] sm:text-6xl">Stories &amp; Heritage</h1>
                    <p className="mt-4 text-sm leading-relaxed text-[#5B5449] sm:text-base">Editorial glimpses into Mithila culture, makers, and motifs.</p>
                </div>
                <div className="mt-5 grid gap-1 md:gap-3 grid-cols-3 md:grid-cols-3 sm:mt-12">
                    {posts.map((item) => (
                        <Link key={item.slug} to={`/journal/${item.slug}`} className="group overflow-hidden rounded-[0.5rem] border border-[#E7E0D2] bg-white shadow-[0_14px_32px_-22px_rgba(36,31,26,0.35)]">
                            <img src={item.image} alt="" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="p-2 sm:p-6">
                                <h2 className="font-playfair text-[0.7rem] md:text-[1.25rem] font-black leading-tight line-clamp-2 text-[#241F1A] group-hover:text-[#7C2020]">{item.title}</h2>
                                <p className="mt-1 text-[8.6px] sm:text-sm leading-tight md:leading-relaxed line-clamp-3 text-[#5B5449]">{item.excerpt}</p>
                                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#7C2020]">Read story <ArrowRight size={13} /></span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CulturalJournalPage;
