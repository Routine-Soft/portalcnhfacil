# Portal CNH Fácil — Frontend (website)

Website of **Portal CNH Fácil**, an online store of specialized courses for Brazilian drivers (CNH), such as heavy indivisible cargo, passenger transport, emergency vehicles, school transport and dangerous goods (MOPP), in both initial training and refresher versions.

![Next.js](https://img.shields.io/badge/next.js-16-000000?logo=next.js)
![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/typescript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

## Demo

- **Website:** https://www.portalcnhfacil.com
- **API:** https://api.portalcnhfacil.com/api (backend in [`portalcnhfacil-backend`](../portalcnhfacil-backend))

## Features

- **Home page** with the course catalog (initial training and refresher courses).
- **Course page** (`/cursos/[slug]`) with target audience, what you will learn, instructor, course details and a "Buy" button.
- **Checkout** with Mercado Pago and a success page.
- **Sign-up, login and "My account"** with the purchased courses.
- **About us** and **contact** pages, plus a floating WhatsApp button.
- **Admin dashboard** (only for users with access): paid purchases with total and the list of users with their courses.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Language | TypeScript |
| Icons | lucide-react |
| Payments | Mercado Pago (through the API) |
| Hosting | Vercel |

## Prerequisites

- **Node.js 26.13.1** (see `.nvmrc`; with nvm, run `nvm use`)
- **npm**
- The API running locally, or the URL of a test API

## Installation

```bash
git clone <repository-url> portalcnhfacil
cd portalcnhfacil
nvm use
npm install
```

Create a `.env.local` file (see the next section) and start the dev server:

```bash
npm run dev
```

The website opens at `http://localhost:3000`.

## Configuration (environment variables)

Only public values go here: everything starting with `NEXT_PUBLIC_` ends up in the browser bundle.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | API base URL, including `/api` |

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Usage

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js dev server |
| `npm run build` | Builds for production |
| `npm start` | Serves the production build |
| `npm run lint` | Runs ESLint |

Quick check before pushing:

```bash
npx tsc --noEmit -p .
npx eslint .
```

### Courses

The course list is **static**, in `app/lib/courses.ts` (title, price, product ID, slug, details). To add or change a course, edit that file.

## Folder structure

```
portalcnhfacil/
├── app/
│   ├── page.tsx          # Home page with the catalog
│   ├── cursos/[slug]/    # Course page
│   ├── pagamento/        # Checkout and success page
│   ├── cadastro/ login/ minhaconta/
│   ├── sobrenos/ contato/
│   ├── dashboard/        # Admin dashboard
│   ├── components/       # Header, Footer, WhatsappButton, Usuarios
│   └── lib/              # courses.ts (catalog) and payments.ts (payment labels)
├── types/                # TypeScript types
└── public/               # Images
```

## Deployment

- Hosted on **Vercel**. Every push to `main` publishes automatically.
- Set `NEXT_PUBLIC_API_URL` in the Vercel project settings.

## Contributing

1. Create a branch from `main`: `feature/<name>` (or `fix/<name>`).
2. Keep the existing structure (Tailwind, TypeScript); don't migrate to another pattern without agreement.
3. Run `npx tsc --noEmit -p .` and ESLint before opening a pull request.
4. Write commit messages in Portuguese and open a pull request to `main`.

## License and author

**Private and proprietary.** All rights reserved. Developed for Portal CNH Fácil.

Developed by **Stanley Andrade**.
