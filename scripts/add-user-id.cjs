const { Client } = require('pg');

const client = new Client({
  host: 'db.biwkwatcfdemrepbjjjz.supabase.co',
  port: 5432,
  user: 'postgres',
  password: process.env.SUPABASE_SERVICE_ROLE_KEY,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  family: 4,
});

(async () => {
  try {
    await client.connect();
    
    // Add user_id column if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'bookings' AND column_name = 'user_id'
        ) THEN
          ALTER TABLE public.bookings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);
    
    console.log('Migration applied: user_id column added to bookings table');
    
    // Verify
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name = 'user_id'
    `);
    console.log('Column info:', res.rows);
    
    await client.end();
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
})();
