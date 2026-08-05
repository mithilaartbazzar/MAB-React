import React from 'react';

export const SectionHeading = ({ subtitle, title, centered = false }) => (
    <div className={`mb-6 sm:mb-10 ${centered ? 'text-center' : 'text-left'}`}>
        <span className="text-[#5c1111] font-extrabold uppercase tracking-[0.3em] text-[9px] sm:text-[10px] mb-2 sm:mb-3 block">{subtitle}</span>
        <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 leading-tight">{title}</h2>
        {/* Traditional flourish: line · diamond · line */}
        <div className={`mt-4 sm:mt-5 flex items-center gap-2 ${centered ? 'justify-center' : 'justify-start'}`}>
            <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent via-amber-500 to-amber-500"></div>
            <div className="w-1.5 h-1.5 bg-[#5c1111] rotate-45"></div>
            <div className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent via-amber-500 to-amber-500"></div>
        </div>
    </div>
);
