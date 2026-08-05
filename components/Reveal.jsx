import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal wrapper. Fades/slides children in when they enter the viewport.
 * direction: 'up' (default) | 'left' | 'right' | 'scale'
 * delay: ms transition-delay for staggered entrances
 */
export const Reveal = ({ children, direction = 'up', delay = 0, className = '', as: Tag = 'div' }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const dirClass = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : direction === 'scale' ? 'reveal-scale' : '';

    return (
        <Tag
            ref={ref}
            className={`reveal ${dirClass} ${visible ? 'reveal-visible' : ''} ${className}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </Tag>
    );
};
