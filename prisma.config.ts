import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Configuration for the Prisma CLI only (db push, db pull, studio, generate).
// The application connects through lib/prisma.ts with DATABASE_URL instead.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Schema changes need a session-mode connection (Supabase session pooler or direct
    // connection, port 5432); the transaction pooler behind DATABASE_URL does not support them.
    // Read from process.env, not env(): `prisma generate` must work without a database URL.
    url: process.env.DIRECT_URL,
  },
});
