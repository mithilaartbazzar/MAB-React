import React from 'react';
import { BadgeCheck, Mail, ScrollText, ShoppingBag } from 'lucide-react';

const sections = [
    {
        title: 'Using the store',
        body: 'By browsing Mithila Chitrakala Store, creating an account, or placing an order, you agree to these Terms of Service and to use the store lawfully. You must provide accurate information and keep your account details secure.',
    },
    {
        title: 'Products and handmade variation',
        body: 'We aim to show products, colors, dimensions, materials, and availability as accurately as possible. Handmade and artisan-made pieces can have natural variations in texture, line, color, and finish. These details are part of their character and are not defects.',
    },
    {
        title: 'Orders, prices, and payment',
        body: 'Adding an item to your cart does not reserve it. An order is accepted when we confirm it. Prices, availability, taxes, and delivery charges may change before confirmation. Payments are processed through the payment method shown at checkout, and we may contact you if an order needs clarification.',
    },
    {
        title: 'Shipping, delivery, and returns',
        body: 'We prepare orders for delivery to the address you provide. Delivery times can vary because of destination, carrier conditions, customs, weather, and the care required for an artwork. Please inspect your order when it arrives and contact us promptly about damage, incorrect items, or a return request so we can review the next step.',
    },
    {
        title: 'Artwork, content, and permissions',
        body: 'Product photographs, descriptions, logos, illustrations, journal posts, and other store content belong to Mithila Chitrakala Store or their respective creators. You may not copy, resell, modify, or commercially use them without written permission. Buying an artwork does not transfer copyright in its image or design.',
    },
    {
        title: 'Accounts and responsible use',
        body: 'Do not misuse the store, interfere with its operation, attempt unauthorized access, submit harmful code, impersonate another person, or use the service to violate another person’s rights. We may suspend access when necessary to protect the store, our community, or our partners.',
    },
    {
        title: 'Third-party services and liability',
        body: 'The store relies on third-party services for payments, hosting, analytics, and delivery. Their terms may also apply. To the extent allowed by law, Mithila Chitrakala Store is not responsible for interruptions or losses caused by services outside our reasonable control.',
    },
    {
        title: 'Updates and contact',
        body: 'We may update these terms as our store, products, or services change. The latest version will be posted here with its revision date. Questions about an order or these terms can be sent to hello@mithilachitrakalastore.com.np.',
    },
];

export const TermsOfService = () => (
    <div className="min-h-screen bg-[#f8f6f2] text-[#241F1A]">
        <div className="relative overflow-hidden border-b border-[#e7e0d2] bg-[#fffaf3]">
            <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-[#b36b00]/10 blur-3xl" />
            <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
                <div className="flex items-center gap-3 text-[#7c2020]"><ScrollText size={18} /><span className="text-[10px] font-black uppercase tracking-[0.3em]">The fine print</span></div>
                <h1 className="mt-5 max-w-3xl font-playfair text-4xl font-black leading-[1.05] sm:text-6xl">A clear agreement for thoughtful collecting.</h1>
                <p className="mt-6 max-w-2xl text-sm leading-7 text-[#71695e] sm:text-base sm:leading-8">These terms set out how the Mithila Chitrakala Store works, from browsing and ordering to delivery, returns, and the care of our artists’ work.</p>
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.25em] text-[#7c2020]">Last updated · September 24, 2026</p>
            </div>
        </div>

        <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-20 lg:px-8">
            <aside className="h-fit rounded-[0.5rem] border border-[#e7e0d2] bg-white p-5 shadow-[0_20px_80px_-50px_rgba(36,31,26,0.45)] lg:sticky lg:top-28">
                <div className="flex items-center gap-3 text-[#7c2020]"><ShoppingBag size={18} /><span className="text-xs font-black uppercase tracking-[0.18em]">Before you buy</span></div>
                <p className="mt-4 text-sm leading-6 text-[#71695e]">Please review product details and delivery information before placing an order. Handmade pieces may vary naturally.</p>
                <div className="mt-5 flex items-center gap-2 text-xs font-black text-[#7c2020]"><BadgeCheck size={14} /> Honest collecting, always</div>
            </aside>

            <article className="max-w-3xl space-y-10">
                <p className="border-l-2 border-[#b36b00] pl-5 font-playfair text-xl font-bold leading-8 text-[#3d352c] sm:text-2xl">Every piece carries an artist’s time and intention. These terms help protect that relationship while keeping your shopping experience straightforward.</p>
                {sections.map((section, index) => (
                    <section key={section.title} className="border-t border-[#e7e0d2] pt-7">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b36b00]">0{index + 1}</p>
                        <h2 className="mt-2 font-playfair text-2xl font-black text-[#241F1A]">{section.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-[#5f574d] sm:text-base sm:leading-8">{section.body}</p>
                    </section>
                ))}
                <a href="mailto:hello@mithilachitrakalastore.com.np" className="flex items-center gap-2 text-sm font-black text-[#7c2020] hover:text-[#241F1A]"><Mail size={16} /> Contact the store</a>
            </article>
        </main>
    </div>
);