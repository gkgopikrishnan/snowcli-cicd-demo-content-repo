import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://askoayqdiyhpcpjosvko.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza29heXFkaXlocGNwam9zdmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjI4NjgsImV4cCI6MjA2MzQ5ODg2OH0.tChMFNJe-y2PhwGKL8gbStzK6HgQMs2b4g2cTng-zxM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


