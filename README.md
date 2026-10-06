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

## Database Migrations

Add database changes as SQL statements in a numbered file under `database/migrations/`, then run:

```bash
npm run migrate:check
npm run migrate
```

The migration runner records each SQL statement checksum as well as the migration filename. If a new statement is appended to a migration file that has already run, the next `npm run migrate` applies only the statement(s) it has not recorded. Each migration file runs transactionally, so a failed statement rolls back its pending statements and can be retried after fixing the issue. Existing filename-only migration records are baselined on the first run with this runner; their current statements are assumed to already exist in the database.

Prefer additive changes such as `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` when evolving existing tables. A changed statement is considered new SQL and will run again; editing a `CREATE TABLE IF NOT EXISTS` definition does not alter a table that already exists. Never edit or remove migration ledger rows manually to force a rerun.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Consultation Email Notifications

Consultation requests are saved to the admin inbox and emailed to `manasagravat.adv@gmail.com` using Resend. Resend's free transactional-email plan currently includes 3,000 emails per month, with a limit of 100 per day.

1. Create a free account at [Resend](https://resend.com/).
2. Add and verify a domain you control in Resend. Publish the DNS records Resend provides; the sender address must use that verified domain.
3. Create a Resend API key.
4. Add these server-side environment variables to `.env.local` for local development and to your hosting provider's environment settings for deployment:

```env
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL="Manas Agravat Website <contact@your-verified-domain.com>"
```

Replace the example sender address with an address at your verified domain, then restart the development server or redeploy. Never expose the API key in a `NEXT_PUBLIC_` variable or commit it to source control. If email configuration is missing or Resend is temporarily unavailable, the request is still retained in the admin inbox and the server logs the mail failure.
