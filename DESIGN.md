# Quantum Gameware: design system

Redesign of the live store, in place. Stack, data (Sanity), cart, checkout, auth and API
routes are unchanged. This file is the source of truth for every later design pass.

## Brief

- **Subject:** Quantum Gameware, an online store for gaming and streaming gear (12 categories,
  47 products in Sanity).
- **Audience:** gamers and streamers building or upgrading a desk setup, many on a budget or
  starting out.
- **Job:** sell. Get a visitor from "what is this" to a product page in two clicks, and make the
  price feel trustworthy.
- **Assets:** product photos from Sanity (about half the products have none), the circuit-swirl
  logo, the Ethnocentric wordmark font, the axolotl mascot, 12 category videos (5 to 33 MB each,
  too heavy for the home page), a headphones GLB.
- **Voice anchor (the owner's words, from /about):** "We price our products fairly from day one."

### Assumptions to confirm (also in src/data/site.ts)
- Shipping copy follows checkout ("free shipping on all orders"). The old about page said "over
  $50", and the help copy gives both 30 and 14 days for returns. The owner must pick one; the home
  page quotes no return window.
- "15K+ happy customers" was unverified and is no longer shown on the home page.
- The catalog has sale prices (`originalPrice`), so copy never claims "no discounts". It says sales
  show the before and after price, with no countdown timers.
- Every count on screen (products, brands, categories) is computed from Sanity at build time.

## Concept (Phase 1)

| | A. Observed (name) | B. The loadout (process) | C. Regrowth (mascot) |
|---|---|---|---|
| Idea | Gear sits in superposition, ghosted and uncertain, until you look at it; observing collapses it into one sharp object with one price | The site is a desk you fill slot by slot; a setup total tracks your build | The axolotl regrows limbs: gear that grows with your setup |
| Anchor | the name "Quantum" and the owner's promise of one fair price | the audience builds setups | the mascot |
| Signature | hero product and headline exist as offset ghosts that collapse on scroll; the price's last digits flicker, then lock | items fly into slots | parts assemble |
| O / F / Fe / P | 4 / 5 / 4 / 2 | 2 / 4 / 3 / 3 (too close to a running-total idea) | 3 / 2 / 3 / 2 |

**Pick A.** It ties the name to what the owner says makes them different (one fair price) and gives
a full rule system: ghosts, collapse, readouts. Borrowed from C for a detail: the axolotl's two
colours (cobalt body, pink gills) are the two ghost colours.

### Concept Card
```
Idea:        Every piece of gear is uncertain until you look at it; looking settles it into one object at one price.
Metaphor:    a quantum measurement: superposition, observation, collapse, a readout.
Signature:   the hero collapse. Headline and product start as cobalt and gill ghosts offset from the true
             position; the pointer stirs them, scroll (observation) pulls them together, and the price
             readout's last digits flicker before locking on the real number. Driver: src/motion/observe.ts.
Emotion:     a flicker of uncertainty, then a satisfying snap into focus.
Motion verb: collapse. Things arrive as offset ghosts and snap together into one sharp state.
Screenshot:  the hero halfway: the headline doubled in cobalt and pink, the headset settling, the price locking.
```

The concept survives past the hero:
- **Product cards:** photos arrive as ghosts that collapse on reveal; hover re-excites them (the
  ghosts split a few pixels). Prices are tabular mono readouts.
- **Page transition:** cobalt and gill bands arrive offset and fold into one ink panel that names the
  destination path, then lift.
- **Products without a photo:** honest "Not photographed yet" plates set from the product's
  initials, ghosted like the photos. No fake renders.
- **Footer:** the wordmark in superposition across the full width, collapsing in view.
- **404:** "Nothing here was observed." The number never collapses.

## Art direction (Phase 2)

### Palette (light; dark below)
| Role | Hex | Use |
|---|---|---|
| ground | `#ECEEF2` | page background: instrument-panel grey, cool, not cream |
| ink | `#0A0C14` | text, rules, the curtain |
| muted | `#4F5566` | secondary text (6.6:1 on ground) |
| line | `rgb(10 12 20 / 0.12)` | hairlines |
| quantum (accent) | `#2633FF` | cobalt from the logo, deepened: CTAs, links, first ghost (6:1 on ground) |
| gill | `#FF4F9A` | axolotl gill pink: second ghost, observed marker, sale chips. Never text on ground |
| plate | `#FFFFFF` | product plates; stay white in dark mode because the photos are shot on white |

Dark (`.dark`, the signed-in user's preference): ground `#07080D`, ink `#E8EAF0`, muted `#9AA0B2`,
quantum `#7C86FF`, paper `#11131B`.

Tailwind's blues, indigos, purples, cyans and greys are remapped onto these roles in `@theme`
(globals.css), and radii, blurs and soft shadows collapse to the shape rule, so pages that are not
hand-redesigned still sit in the system.

### Type
- **Archivo** (Google, variable weight and width 62 to 125): display and text. Display is 800 at
  width 100 with tracking -0.045em. The headline ghosts use width 125 and width 75 of the same
  words, so the superposition is literally the same word at two widths.
- **JetBrains Mono** (Google): prices, ratings, counts and readouts only (real data).
- **Ethnocentric** (existing file): the wordmark only.

### Grid, shape, motion
- 12 columns, fluid gutter; text hangs from column lines 1 and 7. Rhythm alternates full viewport
  (hero), tight (index, grid) and airy (statement).
- One radius rule: **2 px**.
- Eases from the engine (`expo.out`, `expo.inOut`); ghost collapse 0.9 s; hover re-excite 0.35 s.
  Lenis smooth scroll on one GSAP clock. No loader (a store earns no theatre before the goods).
- Reduced motion: no ghosts, no flicker, the observed state at once, native scroll.

### Interaction treatments (one per role)
- Primary buttons: a cobalt fill floods in (from the pointer's side on the hero CTA).
- Product cards: the photo's ghosts split and recombine; the name's underline draws.
- Nav links: underline draws; the current page keeps it.
- Inline links: underline at rest. Utility links: colour only.

### Composition (home)
```
1 HERO (sticky stage, 180svh)    headline at mega size + ghosts | white plate, headset + ghosts
                                  promise, two CTAs              | readout: name / price / state
2 CATEGORY INDEX (index list)     full-width rows, live counts, floating photo preview on hover
3 PICKED BY THE TEAM (grid)       featured products, 4 / 3 / 2 columns
4 STATEMENT + FACTS               pricing sentence at t-l over 8 columns, four computed facts
5 FOOTER FINALE                   promise, real links, wordmark in superposition
```

### Genericness test
- A generic model would ship a dark RGB "gamer" site with neon gradients and a 3D hero. Changed: a
  light instrument-grey ground, two exact colours from the mascot, and the three.js headphone hero
  (7 fps scroll on desktop in the baseline) replaced by the collapse built from real product photos.
- A generic model would put three feature cards under the hero. Changed: an index of real
  categories with real counts.
- The old home's glassmorphism, blobs and parallax orbs are gone site-wide.

### Idle state
The hero ghosts keep a small drift (1 to 6 px) on the GSAP ticker while the hero is on screen; it
shrinks as the hero is observed and stops off screen and under reduced motion.

## Catalog structure (pass 2, 2026-11-19)

Taxonomy lives in `src/data/taxonomy.ts`; leaf data in `src/data/categories.ts`. Products are
normalised in `src/sanity/lib/queries.ts`, so every consumer reads `product.category` (leaf name),
`product.categorySlug` and `product.department`. Empty leaves are hidden everywhere until stocked.

| Department | Leaves |
|---|---|
| Control | Mice, Keyboards, Controllers, Mouse pads & desk mats |
| Audio | Headsets, Speakers, Microphones |
| Display | Monitors, VR headsets (hidden, 0) |
| Setup & Stream | Chairs, Stream gear, Webcams (hidden, 0), Accessories |

Fixes applied in code until the owner makes them in Studio: the photo-less ASUS PG27AQDM duplicate
is hidden, the Corsair desk pad moves to Mouse pads, the Stream Deck moves to Stream gear.

URLs: `/categories/<department>` and `/categories/<leaf>` share one route. Leaves keep their old
slugs, so no links break.

### Composition (catalog pages, each a different layout family)
```
HOME INDEX (grouped index list)   department label in mono at column 1 | leaf rows with counts
/categories (sticky split atlas)  per department: sticky left [name at t-xl, count, blurb]
                                   | right: leaf rows (index treatment) + a strip of 4 plates
/categories/<department>          page head, leaf rail (chips: All + leaves), Catalog scoped
/categories/<leaf>                page head with Home / Department / Leaf crumbs, spec readout
                                   strip (live price span, brand count, platforms) in mono,
                                   sibling rail, Catalog with the leaf's own filters
/products                         page head, department rail, Catalog over everything
/products/<slug>                  gallery | sticky buy column; mobile: sticky buy bar
```

### Catalog component (`src/components/catalog/`)
One client component for every listing. Toolbar: search, sort, filter toggle, a result readout
whose digits flicker and lock when the count changes (the collapse verb, applied to data).
Desktop: sticky filter column. Phone: a bottom-sheet dialog. Active filters are removable chips.
State is mirrored to the query string, so filtered views can be shared and survive back/forward.
When the result set changes, cards collapse into their new positions (GSAP Flip); under reduced
motion the grid just swaps.

## About page (pass 3, 2026-11-19)

The old /about was the pre-redesign glass page: invented team members (Alex Chen, Sarah Johnson,
Marcus Rodriguez), unverified stats (15K+ customers, 4.8 stars, 75+ products) and "free shipping
over $50", which contradicts checkout. All of it is gone. Every number on the new page is
computed from Sanity at build time; the only owner claims kept are the owner's own words from the
old page (fair price from day one, no inflated list prices, gamers and streamers ourselves).

### Concept (Phase 1, inside the site concept "Observed")
| | A. Two slits (name, physics) | B. The receipt (formal) | C. Regrowth (mascot) |
|---|---|---|---|
| Idea | Two waves, cobalt and gill, interfere across the hero; observing collapses every fringe but the one where both agree, which becomes the rule under the headline | The page is one itemised receipt of what you pay for | The axolotl regrows limbs; a setup grows one piece at a time |
| Anchor | the name "Quantum" and the owner's "one fair price" | the pricing promise | the mascot |
| O / F / Fe / P | 5 / 5 / 4 / 2 | 3 / 4 / 4 / 3 (needs a cost breakdown we don't have) | 3 / 3 / 4 / 2 |

**Pick A.** It is the most literal quantum image there is (the double slit), and the collapse lands
on exactly one line: one price. C becomes the mascot section.

```
Idea:        Other stores show a price in superposition (list price, sale, timer, shipping); here it collapses to one.
Metaphor:    the double-slit experiment: two waves, interference fringes, a measurement.
Signature:   the hero field (WebGL, src/motion/fringes.ts). Two ring sets, cobalt and gill, ripple in from
             sources off the right edge and form a moire of fringes. The pointer shifts their phase; scroll
             (observation) fades every fringe but the central one, the line where both waves agree, and that
             line draws in as the rule under the headline. A readout counts the fringes down to 1.
Emotion:     a busy, shimmering field, then calm: one line.
Motion verb: collapse (site-wide).
Screenshot:  the hero halfway: the moire thinning toward one bright band, the rule half drawn, "Fringes 5".
```

### Composition (each section a different layout family)
```
1 HERO (scene, sticky stage 170svh)  crumbs / h1 at mega size above the agreement line / lede, readout
                                      GL field full-bleed behind; the line is a DOM rule the driver draws
2 OWNER'S WORDS (statement)           the quote at t-xl in superposition (wdth 125 / 75 ghosts), collapsing
                                      in view; a short story paragraph hung from column 7
3 ELSEWHERE / HERE (ledger, sticky)   sticky title left | rows: a common store trick, ghosted and struck,
                                      collapsing into what this store does instead
4 EVERY PRICE ON ONE LINE (data)      a log-scale spectrum of all prices: one tick per product, sale items
                                      show a ghost tick at the before price; pointer scrubs a readout.
                                      Four computed facts below, digits flicker then lock in view
5 WHY AN AXOLOTL (asymmetric pair)    mascot plate with cobalt and gill ghosts | text offset down
6 ON THE SHELF (index list)           every brand with its count, two columns, photo preview on hover,
                                      each row opens the catalog filtered to that brand
7 FINALE (poster)                     "Start with one piece." CTAs and the real phone line
```

### Idle and reduced motion
The field's rings travel outward continuously (the wave itself is the idle state), on the GSAP ticker,
paused off screen and in hidden tabs. Reduced motion or no WebGL: no canvas, the observed state at
once (the rule drawn, "Fringes 1"), and every ghost collapsed.

## Menu (pass 4, 2026-11-20)

Below 1024px the header's menu trigger and panel carry the collapse verb.
- **Trigger** (`.menu-btn`, site.css): two ink bars, each with a cobalt and a gill ghost a hair off
  it at rest. Hover or focus splits the ghosts further and evens the short bar; press merges them;
  open crosses the bars into an X and the ghosts collapse into it. The label rolls Menu to Close.
- **Panel** (`MobileMenu.tsx`, atlas.css): a cobalt band, a gill band, then the panel sweep in from
  the trigger's edge 70 ms apart (clip-path, expo.inOut): the page transition at menu scale.
  Primary links sit at display size with their destination path in mono; their cobalt and gill
  ghosts collapse in on open and split again under the finger or pointer, and the other rows dim.
  A readout at the top names the current path. Closing plays the sweep in reverse.
- **Geometry:** full screen under the header on phones; from 640px a 32rem right sidebar over a
  scrim that closes on tap.
- **Reduced motion:** no sweep, no ghosts; the panel appears and leaves at once.

## Forms, account and info pages (pass 5, 2026-11-20)

Every page that still used the old dark glass cards moves onto the system, batch by batch.
- **Shared form primitives** (`styles/forms.css`): `.field`, `.field__input` (focus shows the cobalt and
  gill ghosts as offset outlines: the collapse verb on every input), `.check`, `.alert`, `.meter`
  (password strength in five cells), `PasswordField` (Show/Hide toggle, aria wired).
- **Auth frame** (`components/auth/AuthFrame.tsx`): an ink slate with the title in superposition and a
  live Status readout (Waiting for you / Checking / Needs a fix / Confirmed); the ghosts are keyed on
  the state, so an error makes the title flicker and settle again. Phones: the slate is a band.
- **Info blocks** (`styles/pages.css`): `DocPage` + `DocToc` (contents rail that marks the section
  being read; a folded disclosure on phones), `.readout`, `.steps`, `.pair`, `.qa`, `.rows`, `.table`,
  `.tiers` (membership ladder, each tier a step higher), `Closer` (ink end band with real contacts).
- **Account** (`AccountNav`): one tab rail for every account page, gill underline on the current tab.
- **Header** (`UserMenu`): "Sign in" link + "Create account" line button; signed in, an initials badge.

### Content fixed while restyling (owner to confirm)
- Removed invented or broken content: the placeholder phone (123) 456-7890 and "123 Gaming Street"
  address on contact and help, social links to "#", live chat buttons that did nothing, 24/7 and
  30-second response claims, six help "articles" that did not exist, links to /support and
  /warranty/claim (no such pages), a contact newsletter checkbox that was never sent.
- FAQ, help and contact answers now match the policy pages (shipping 5 to 15 US / 10 to 25
  international business days, 30-day returns, reset by 6-digit code). Affirm/Klarna and Shop Pay
  were removed: `src/config/payment.ts` enables cards, PayPal, Apple Pay and Google Pay only.
- Still contradictory, left for the owner: shipping says processing is 1-3 days in one place and
  1-2 in another, and Express (7 to 12 days) is slower than Standard's lower bound; membership's
  Silver tier lists free standard shipping, which every order already gets; terms still show the
  "123 Gaming Street" legal address.
