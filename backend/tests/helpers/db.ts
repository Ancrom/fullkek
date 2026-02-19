import { Pool } from "pg";

let pool: Pool | null = null;

export const getPool = () => {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
};

export const closePool = () => pool?.end();

export const resetPool = async () => {
  if (pool) {
    const p = pool;
    pool = null;
    if (!p.ended) {
      await p.end().catch(() => {});
    }
  }
};

export async function truncateAll() {
  const pool = getPool();
  await pool.query(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
      LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);
}
