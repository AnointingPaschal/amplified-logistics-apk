import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const memoryStorage = {
  _s: {},
  getItem:    (k)   => Promise.resolve(memoryStorage._s[k] ?? null),
  setItem:    (k,v) => { memoryStorage._s[k]=v; return Promise.resolve(); },
  removeItem: (k)   => { delete memoryStorage._s[k]; return Promise.resolve(); },
};

export const supabase = createClient(
  'https://nlrvkcebwzremhksjzwp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scnZrY2Vid3pyZW1oa3NqendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjA2MTksImV4cCI6MjEwMjYzNjYxOX0.hBZ_WAXl1Q-NWmRQJ6nAiueQR_Cv8ZDqquQELN-6kVc',
  { auth: { storage: memoryStorage, autoRefreshToken:true, persistSession:false, detectSessionInUrl:false } }
);
