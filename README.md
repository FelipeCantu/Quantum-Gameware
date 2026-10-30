<div align="center">

# Quantum Gameware

**Quality gaming gear without the premium price.**
A full-stack e-commerce store for gaming monitors, headsets, mice and keyboards.

[**Live store →**](https://quantum-gameware.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=flat-square&logo=sanity&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

</div>

<!-- Add a screenshot: save one to public/screenshot.png and uncomment the line below -->
<!-- ![Quantum Gameware storefront](public/screenshot.png) -->

## Features

- **Product catalog** — products, categories and brands managed in Sanity CMS, with an embedded Studio for editing
- **Cart & wishlist** — persistent cart drawer and wishlist powered by React context
- **Accounts** — sign up and log in with hashed passwords (bcrypt) and JWT sessions, user data in MongoDB
- **Checkout** — Stripe payments
- **AI shopping assistant** — chat widget that answers product questions and links to items in the store
- **Transactional email** — emails sent with Resend
- **3D touches** — React Three Fiber elements on the storefront
- **Installable** — web manifest and app icons for home-screen install

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS, styled-components |
| CMS | Sanity (`next-sanity`, Portable Text) |
| Database | MongoDB with Mongoose |
| Auth | bcryptjs, jsonwebtoken / jose |
| Payments | Stripe |
| Email | Resend |
| 3D | Three.js, React Three Fiber, Drei |
| Hosting | Vercel |

## Getting started

```bash
git clone https://github.com/FelipeCantu/Quantum-Gameware.git
cd Quantum-Gameware
npm install
```

Create a `.env.local` with your own keys for MongoDB, Stripe, Sanity, Resend and a JWT secret, then:

```bash
npm run setup-db      # set up the database
npm run migrate:all   # load categories and brands into Sanity
npm run dev           # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `start` | Production build and serve |
| `npm run migrate:products` | Import sample products |
| `npm run test-auth` | Smoke-test the auth flow |

## Author

Built by **Felipe Cantu Jr** — [felipecantujr.com](https://felipecantujr.com) · [LinkedIn](https://www.linkedin.com/in/felipe-cantu-jr/) · [GitHub](https://github.com/FelipeCantu)
