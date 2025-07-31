import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

// Force use of Supabase database connection with pooler port
const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;
if (!SUPABASE_DB_PASSWORD) {
  throw new Error(
    "SUPABASE_DB_PASSWORD must be set. Did you forget to add the secret?",
  );
}

const encodedPassword = encodeURIComponent(SUPABASE_DB_PASSWORD);
const DATABASE_URL = `postgresql://postgres:${encodedPassword}@db.ubxtmbgvibtjtjggjnjm.supabase.co:6543/postgres?sslmode=require&pgbouncer=true`;

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
});
export const db = drizzle(pool, { schema });
