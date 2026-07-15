This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure & Best Practices

This project follows modern best practices for React, Next.js, Tailwind CSS, and shadcn/ui. Key conventions:

```
src/
  app/                # Next.js app directory (routes, layouts, pages)
  components/         # Shared React components
    ui/               # shadcn/ui components (unmodified, canonical)
    ...               # Other custom/shared components
  hooks/              # Custom React hooks (e.g., useDebounce)
  lib/                # Utility functions, API clients, helpers
  utils/              # Common types, helpers, and default data
    default-data/     # Static data for tables, charts, etc.
  actions/            # Server actions and business logic
  custom-wrappers/    # Providers and wrappers for context, query, etc.
  middleware.ts       # Next.js middleware
public/               # Static assets
styles/               # Tailwind and global CSS
```

- **shadcn/ui components** are only in `src/components/ui` and should not be modified directly. Extend via wrappers if needed.
- **Custom hooks** go in `src/hooks`.
- **Utilities** and helpers are in `src/lib` or `src/utils`.
- **Feature-specific components** are organized in subfolders under `src/components`.
- **All theming and design tokens** are managed in `tailwind.config.js`.
- **Global styles** are minimal and use Tailwind's recommended base styles.

For more details, see comments in the relevant files.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
