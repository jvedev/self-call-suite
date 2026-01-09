/**
 * Jest setup file for Supabase tests
 * Configures environment variables for integration testing
 */

// Load environment variables from .env.test or .env
const dotenv = require('dotenv');
const path = require('path');

// Try to load from .env.test first, then .env
const envPath = path.resolve(__dirname, '.env.test');
const envLocalPath = path.resolve(__dirname, '.env.local');
const envDefaultPath = path.resolve(__dirname, '.env');

try {
  dotenv.config({ path: envPath });
  console.log('✓ Loaded .env.test');
} catch (e) {
  console.log('⚠ .env.test not found');
}

try {
  if (!process.env.VITE_SUPABASE_URL) {
    dotenv.config({ path: envLocalPath });
    console.log('✓ Loaded .env.local');
  }
} catch (e) {
  console.log('⚠ .env.local not found');
}

try {
  if (!process.env.VITE_SUPABASE_URL) {
    dotenv.config({ path: envDefaultPath });
    console.log('✓ Loaded .env');
  }
} catch (e) {
  console.log('⚠ .env not found');
}

// Validate required environment variables for Supabase
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_KEY) {
  console.error(
    'ERROR: Missing Supabase environment variables!\n' +
    'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set in your .env or .env.test file'
  );
  process.exit(1);
}

console.log(`✓ Supabase URL configured: ${process.env.VITE_SUPABASE_URL}`);
console.log(`✓ Supabase Key configured: ${process.env.VITE_SUPABASE_KEY?.substring(0, 10)}...`);

// Mock window object for browser APIs
global.window = {
  location: {
    origin: 'http://localhost:3000',
  } as any,
} as any;

// Mock import.meta.env for Vite in Node environment
// This allows the supabaseClient.ts to work in test environment
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_KEY: process.env.VITE_SUPABASE_KEY,
    },
  },
} as any;

