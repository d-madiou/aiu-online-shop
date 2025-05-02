import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://jfcryqngtblpjdudbcyn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmY3J5cW5ndGJscGpkdWRiY3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTM5OTksImV4cCI6MjA2MTEyOTk5OX0.ych96b7dAwIGunRACoGOvmpG8rAlsmK1sSasbIFpc_M"
)

