import React from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

const sections = [
    {
        title: 'Information we collect',
        body: 'When you create an account, place an order, contact us, or subscribe to the journal, we may collect your name, email address, phone number, delivery details, account details, and messages. Payment details are handled by our payment partners and are not stored by us in full.',
    },
    {
        title: 'How we use your information',
        body: 'We use information to process and deliver orders, provide support, manage your account and wishlist, send service updates, improve the store, prevent misuse, and share journal or collection news when you have chosen to receive it.',
    },
    {
        title: 'When information is shared',
        body: 'We do not sell your personal information. We share only what is needed with service providers such as payment processors, delivery partners, hosting providers, analytics tools, and customer-support services. They may use the information only to provide their services to us.',
    },
    {
        title: 'Cookies and analytics',
        body: 'The store may use cookies or similar technologies to keep sessions working, remember preferences, understand site performance, and improve your experience. You can manage cookies through your browser settings, although some store features may not work as intended when they are disabled.',
    },
    {
        title: 'Your choices and rights',
        body: 'You may unsubscribe from marketing messages at any time, update account details, or ask us to access, correct, or delete personal information we hold about you. Some information may need to be retained to complete an order, meet legal obligations, or resolve disputes.',
    },
    {
        title: 'Security and retention',
        body: 'We use reasonable administrative and technical safeguards, but no internet transmission or storage system can be guaranteed completely secure. We keep information only for as long as it is needed for the purposes described here or as required by applicable law.',
    },
    {
        title: 'Third-party services and links',
        body: 'The store may link to services we do not operate. Their own privacy policies apply when you leave our site. We encourage you to review those policies before sharing personal information with a third party.',
    },
    {
        title: 'Changes and contact',
        body: 'We may update this policy as the store develops. The latest version will always be posted here with its revision date. For privacy questions or requests, email hello@mithilachitrakalastore.com.np and include enough detail for us to identify your request.',
    },
];

export const PrivacyPolicy = () => (
    <div className="min-h-screen bg-[#f8f6f2] text-[#241F1A]">
        <div className="relative overflow-hidden border-b border-[#e7e0d2] bg-[#fffaf3]">
            <div className="absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#7c2020]/10 blur-3xl" />
            <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
                <div className="flex items-center gap-3 text-[#7c2020]">
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Trust &amp; transparency</span>
                </div>
                <h1 className="mt-5 max-w-3xl font-playfair text-4xl font-black leading-[1.05] sm:text-6xl">Privacy, with respect for your story.</h1>
                <p className="mt-6 max-w-2xl text-sm leading-7 text-[#71695e] sm:text-base sm:leading-8">This policy explains what Mithila Chitrakala Store collects, why we need it, and the choices you have when you explore, shop, or join our journal.</p>
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.25em] text-[#7c2020]">Last updated · September 24, 2026</p>
            </div>
        </div>

        <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-20 lg:px-8">
            <aside className="h-fit rounded-[0.5rem] border border-[#e7e0d2] bg-white p-5 shadow-[0_20px_80px_-50px_rgba(36,31,26,0.45)] lg:sticky lg:top-28">
                <div className="flex items-center gap-3 text-[#7c2020]"><LockKeyhole size={18} /><span className="text-xs font-black uppercase tracking-[0.18em]">Your privacy</span></div>
                <p className="mt-4 text-sm leading-6 text-[#71695e]">We collect what helps us serve your order and keep the store useful. We do not sell your personal information.</p>
                <a href="mailto:hello@mithilachitrakalastore.com.np" className="mt-5 flex items-center gap-2 text-xs font-black text-[#7c2020] hover:text-[#241F1A]"><Mail size={14} /> Ask a privacy question</a>
            </aside>

            <article className="max-w-3xl space-y-10">
                <p className="border-l-2 border-[#b36b00] pl-5 font-playfair text-xl font-bold leading-8 text-[#3d352c] sm:text-2xl">Our store is built around trust: in the artists who share their work and in the people who bring it home.</p>
                {sections.map((section, index) => (
                    <section key={section.title} className="border-t border-[#e7e0d2] pt-7">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b36b00]">0{index + 1}</p>
                        <h2 className="mt-2 font-playfair text-2xl font-black text-[#241F1A]">{section.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-[#5f574d] sm:text-base sm:leading-8">{section.body}</p>
                    </section>
                ))}
            </article>
        </main>
    </div>
);