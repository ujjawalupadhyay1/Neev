import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !secretKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

console.log('Testing connection with service role key...');
const admin = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: pools, error: poolError } = await admin.from('wish_pools').select('*').limit(5);
console.log('wish_pools table:', { count: pools?.length, poolError });

const { data: buckets, error: bucketError } = await admin.storage.listBuckets();
console.log('storage buckets:', { buckets: buckets?.map(b => b.name), bucketError });
