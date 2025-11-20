import {createClient} from "@supabase/supabase-js";

const url = "https://smhvcspigkhonzmznkxb.supabase.co";
const anon_key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtaHZjc3BpZ2tob256bXpua3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwOTE0NzcsImV4cCI6MjA3ODY2NzQ3N30.9N_lq3a52jfWclqVG2eMMbonxj3XQaXqkSXz6sOVriM";
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = url;
const supabaseKey = anon_key;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
