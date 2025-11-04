import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL =
	import.meta.env.VITE_SUPABASE_URL ||
	"https://exkmhzdwgiovivncdmtp.supabase.co";
const SUPABASE_KEY =
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4a21oemR3Z2lvdml2bmNkbXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTgzNzUsImV4cCI6MjA3NjYzNDM3NX0.By2dpO-vlwxXEbzJOKCXhh6rzsvkqnPDhR5-Xw6X84Q";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
	auth: {
		persistSession: true,
		storage: localStorage,
		autoRefreshToken: true,
	},
});
