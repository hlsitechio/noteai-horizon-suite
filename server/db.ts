import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

// Use Replit's DATABASE_URL or fallback to Supabase if provided
const DATABASE_URL = process.env.DATABASE_URL || (() => {
  const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;
  if (SUPABASE_DB_PASSWORD) {
    const encodedPassword = encodeURIComponent(SUPABASE_DB_PASSWORD);
    return `postgresql://postgres:${encodedPassword}@db.ubxtmbgvibtjtjggjnjm.supabase.co:5432/postgres?sslmode=require`;
  }
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
})();

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
});
export const db = drizzle(pool, { schema });
