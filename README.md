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

## Consultation Email

Consultation requests are emailed through [Resend](https://resend.com). Copy `.env.example` to `.env.local` and set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONSULTATION_NOTIFICATION_EMAIL`. The sender address must use a domain verified in Resend. Keep the API key on the server and out of `NEXT_PUBLIC_*` variables.

## Admin Website Editor

The `/admin` workspace is protected by one server-side password. Set `ADMIN_PASSWORD` to a unique password of at least 12 characters and `ADMIN_SESSION_SECRET` to a random secret of at least 32 characters. Never use `NEXT_PUBLIC_*` for either value. Generate a session secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`, then add both values to `.env.local` and your deployment's server environment.

Homepage edits are stored in Supabase so they persist on serverless hosting. Create a Supabase project, run [`supabase-schema.sql`](supabase-schema.sql) in its SQL editor, then set `SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and your deployment environment. Never expose the service-role key to the browser. Until these settings are present, the public homepage uses its built-in defaults and edits cannot be published. Restart the local dev server after changing `.env.local`.

After configuration, sign in at `/admin`, open **Website content**, edit the homepage sections, and choose **Publish changes**. The admin session expires after eight hours.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
