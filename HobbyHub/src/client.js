import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const ApiKey = import.meta.env.VITE_SUPABASE_API_KEY;


export const supabase = createClient(URL, ApiKey);