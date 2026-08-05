-- Hero slides table for the homepage banner carousel.
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

create table if not exists hero_slides (
    id text primary key,
    tag text default '',
    title text default '',
    highlight text default '',
    description text default '',
    cta_label text default 'Shop Now',
    cta_link text default '/products',
    image text default '',
    theme text default 'maroon',          -- maroon | charcoal | saffron
    sort_order int default 0,
    active boolean default true,
    created_at timestamptz default now()
);

-- Seed with the current built-in slides so the admin has a starting point.
insert into hero_slides (id, tag, title, highlight, description, cta_label, cta_link, image, theme, sort_order, active)
values
    (
        'h-default-1',
        'Authentic Mithila Art',
        'Color Holds',
        'History',
        'Every pigment is ground from the earth, every motif is a prayer passed down 2,500 years. Own a piece of living heritage.',
        'Shop The Collection',
        '/products',
        'https://res.cloudinary.com/djmbuuz28/image/upload/v1774971793/Shri_Krishna_Leela_-_The_Circular_Chronicles.png',
        'maroon',
        0,
        true
    ),
    (
        'h-default-2',
        'New Arrivals Weekly',
        'Fresh From The',
        'Artisan Studios',
        'Small, numbered batches arrive from village workshops every week. Never printed — always painted by hand.',
        'Explore New Drops',
        '/products?cat=paintings',
        'https://res.cloudinary.com/djmbuuz28/image/upload/v1774970560/The%20Lady%20From%20Mithila.jpg',
        'charcoal',
        1,
        true
    ),
    (
        'h-default-3',
        'Powered By AI',
        'Find Art That',
        'Speaks To You',
        'Tell our AI Art Consultant your story, your space and your taste — it will match you with your perfect piece.',
        'Ask The Oracle',
        '/advice',
        'https://res.cloudinary.com/djmbuuz28/image/upload/v1774971793/Shri_Krishna_Leela_-_The_Circular_Chronicles.png',
        'saffron',
        2,
        true
    )
on conflict (id) do nothing;
