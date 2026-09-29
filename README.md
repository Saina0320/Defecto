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

## Database

The data lives in a PostgreSQL database hosted on Supabase. The app reads and writes it with [Prisma ORM 7](https://www.prisma.io/docs/orm/v7), always on the server: the browser never talks to the database.

| File | Purpose |
| --- | --- |
| `prisma/schema.prisma` | Tables, columns, defaults, keys and indexes. |
| `prisma/sql/post-db-push.sql` | What Prisma cannot describe: CHECK and UNIQUE constraints, row level security, time zone. |
| `prisma.config.ts` | Settings for the Prisma CLI. |
| `lib/prisma.ts` | The Prisma Client used by the app. |
| `services/` | The queries. Server-only. |
| `generated/prisma/` | Generated client. Not committed; `npm install` creates it. |

### Setup

1. Copy `.env.example` to `.env` and fill in the two connection strings. Both are in the Supabase dashboard under **Connect > ORMs > Prisma**.
2. Run `npm install`. It also generates the Prisma Client.
3. Run `npm run dev`.

| Variable | Used by | Supabase connection |
| --- | --- | --- |
| `DATABASE_URL` | The app | Transaction pooler, port 6543, ending in `?pgbouncer=true` |
| `DIRECT_URL` | The Prisma CLI | Session pooler, port 5432 |

### Commands

| Command | What it does |
| --- | --- |
| `npm run db:generate` | Regenerates the Prisma Client. Run it after editing the schema. |
| `npm run db:diff` | Lists what `db:push` would change. Changes nothing. |
| `npm run db:push` | Applies the schema to the database. |
| `npm run db:studio` | Opens Prisma Studio to browse the data. |

### Changing the schema

1. Edit `prisma/schema.prisma`.
2. Run `npm run db:diff` and read the list.
3. Run `npm run db:push`, then `npm run db:generate`.

`db:push` makes the database match the schema. It removes any table or column of the `public` schema that the schema file does not describe, after asking for confirmation. Check `db:diff` first.

A new CHECK constraint, trigger, function or policy goes in `prisma/sql/post-db-push.sql`.

### Rebuilding the database from scratch

1. Run `npm run db:push`.
2. Run `prisma/sql/post-db-push.sql` by hand, in the Supabase SQL Editor or with `psql -f`.

The second step is needed because `db:push` alone leaves out the CHECK constraints and leaves the tables open to the Supabase Data API.

### Things to know

- **Prisma version.** The project uses Prisma 7. `npm install prisma@latest` installs Prisma 8, which does not read `schema.prisma` and has no `db push`. Keep `prisma`, `@prisma/client` and `@prisma/adapter-pg` on `^7`.
- **Time zone.** The database must stay in UTC, the Supabase default. Prisma's PostgreSQL adapter reads dates wrongly in any other zone.
- **Dedicated role (optional).** Supabase recommends connecting Prisma with its own database role instead of `postgres`. The SQL to create it is in the [Supabase guide for Prisma](https://supabase.com/docs/guides/database/prisma). Use that role as `[USER]` in both connection strings.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
