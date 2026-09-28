# Mithila Chitrakala Store Loading Screen

This document describes the current loading-screen design and implementation. Treat it as the source of truth when reproducing or changing the loader; do not replace its timing, artwork, or layout with the earlier simultaneous-entry concept.

## Experience

Show a full-viewport cultural entrance on every initial app load and browser refresh. The warm paper-colored screen frames the official store logo with two copies of the same Madhubani peacock artwork, a thin moving geometric border, a minimal progress line, and two lines of store messaging.

The composition is calm and ornamental rather than a generic spinner. Keep the official logo and peacock artwork unchanged. The right peacock is a CSS mirror of the left artwork.

## Assets and Priority

Use these exact Cloudinary assets:

```js
const PEACOCK_IMAGE_URL = 'https://res.cloudinary.com/djmbuuz28/image/upload/v1790577836/Madhubani_Peacock_and_Floral_Vine_mbespr.png';
const LOGO_IMAGE_URL = 'https://res.cloudinary.com/djmbuuz28/image/upload/v1790219754/LOGO_only_Zoomed_for_search_results_ynpjvm.png';
```

The HTML document preconnects to `res.cloudinary.com` and preloads both images with high fetch priority, before the React bundle runs. The loader images also use `fetchPriority="high"`. Both peacocks share one URL and therefore one browser-cached image request; mirror the right image with `transform: scaleX(-1)`.

Do not create alternate logo or peacock artwork, or introduce second image URLs.

## Composition

- A fixed `inset: 0` overlay fills the viewport, clips overflow, and centers the composition.
- Use warm ivory (`#f3eee4`), charcoal ink (`#302923`), terracotta (`#843b30`), and muted gold (`#a77c36`). A faint repeating texture gives the background a paper-like finish.
- Keep the logo as the focal point, with both peacocks behind it in stacking order.
- The logo image is capped at `70vw` / `420px` and `38vh` high on larger screens. On screens up to 600px wide, use `58vw` / `260px` for the logo and `36vw` / `170px` for each peacock.
- The peacocks use `32vw` / `410px` on larger screens. Their edge offsets are `2vw`, reduced to zero on mobile.
- The official logo image itself remains intact. The separate text line `Mithila Chitrakala Store` appears underneath it, followed by the progress line and `Bringing Mithila Art to Your Home` tagline.
- Do not add a generic spinner, particles, strong glow, flashy gradients, or heavy shadows.

## Animation Sequence

The animations are CSS-driven. Use transforms and opacity rather than layout changes.

1. **Initial reveal:** The ivory overlay and borders are present immediately. The centered content fades in while moving up 12px and scaling from `0.92` to `1` over `1.15s`.
2. **Logo reveal:** The logo independently fades in and scales from `0.84` to `1` over `1.2s` using `cubic-bezier(.22, 1, .36, 1)`.
3. **Sun rotation:** A wrapper makes one full, linear 360-degree turn over `6.8s`, then holds its final orientation. Keep the actual supplied image unchanged.
4. **Peacock entrance:** The left peacock begins offscreen and moves inward first. The mirrored right peacock follows 180ms later. Each has a `6.8s` animation using `cubic-bezier(.22, 1, .36, 1)`.
5. **Framed hold:** Each bird reaches the framing position at 28% of its own animation and remains there through 82%. The left uses `translate3d(-20%, -50%, 0)` and the right uses `translate3d(20%, -50%, 0)`, leaving a small portion beyond the corresponding viewport edge.
6. **Peacock exit:** Both birds fade and travel back out through their original edge by the end of their animation. The logo remains the center focus.
7. **Overlay exit:** At 7 seconds, begin fading the whole overlay to opacity zero over `650ms`. At the same time, shrink the logo to `scale(.82)` and fade it out. Remove the overlay at 7.65 seconds.

The top geometric strip repeats continuously toward the right and the bottom strip moves left. Both loop independently using repeating CSS backgrounds; the 56px pattern cycle takes 2 seconds (about 28px/second), so the loop has no track edge or reset jump.

The progress line is a thin terracotta-to-gold highlight moving across a subtle track. The store-name line and tagline fade upward into place after the logo starts appearing.

## Responsive and Reduced Motion

On mobile, keep the logo readable and clearly dominant while increasing the relative size of the peacocks. Allow the artwork to crop at the screen edges; do not let it cause horizontal page scrolling or stretch it out of aspect ratio.

Respect `prefers-reduced-motion: reduce`:

- Hide the peacocks and stop both border loops and the sun rotation.
- Shorten the center and logo reveal animations to `450ms` and the overlay fade to `250ms`.
- Keep the simple logo fade/scale reveal and progress line; avoid the decorative movement.
- Use the reduced-motion app timers: begin overlay exit after `300ms` and remove it after `1100ms`.

## Lifecycle and Resilience

`components/StoreLoadingScreen.jsx` owns the image URLs and accessible overlay markup. `index.css` owns all visual styling and keyframes. `App.jsx` mounts the loader immediately, applies `inert` to the underlying app while it is visible, and controls its timed exit. The timers are cleared when the app unmounts.

The normal-motion exit timer is independent of product fetching and image load events: start the fade at `7000ms` and remove the overlay at `7650ms`. This keeps slow or failed remote images from trapping visitors. Do not hold the overlay open waiting for database requests or image `onload` callbacks.

Use `role="status"` and the label `Loading Mithila Chitrakala Store`. Mark the borders, peacocks, and progress indicator decorative with `aria-hidden="true"`; provide alt text for the official logo.

## Implementation Checklist

- Preserve the two exact asset URLs and preload them from `index.html` at high priority.
- Use one peacock image twice; mirror only the right instance.
- Preserve the left-first, right-180ms-later entrance, mobile sizing, logo reveal and single sun rotation.
- Keep the top and bottom border loops moving in opposite directions.
- Ensure the overlay blocks interaction and exits even when remote assets or product data are slow.
- Test the production build and check the loader at desktop and mobile widths, including reduced-motion mode.