import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nxwmwezfttyubyfdvrcs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54d213ZXpmdHR5dWJ5ZmR2cmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTQ0NjUsImV4cCI6MjA5MjgzMDQ2NX0.OhhO8WMsgeoirRJvVflpus0n3remqgI3UHUC3sPaQEQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
