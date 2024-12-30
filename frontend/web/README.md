This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).    
Used as template.

It has auth & prisma integration & shadcn/ui already setup.   
And also some default auth login and register pages, including api routes.

Used libraries:
  - [Auth.js](https://authjs.dev/)
  - [shadcn/ui](https://ui.shadcn.com/)
  - [Prisma ORM](https://www.prisma.io/)
  - and some other small libraries, including those, which came with create-next-app

## Getting Started

First, setup environment variables

```bash
cp .env.example .env
```

Second, install dependencies

```bash
npm ci
# or
pnpm install --frozen-lockfile
# or
yarn install --frozen-lockfile
# or 
bun install --frozen-lockfile
```

Third, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- Also check links above to learn more about used libraries.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
