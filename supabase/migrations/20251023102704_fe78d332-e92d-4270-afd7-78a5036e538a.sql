-- Ensure realtime change payloads include full row and table is in publication
ALTER TABLE public.user_notes REPLICA IDENTITY FULL;

-- Add user_notes to realtime publication if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'user_notes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notes;
  END IF;
END
$$;

-- Keep updated_at in sync on updates
DROP TRIGGER IF EXISTS update_user_notes_updated_at ON public.user_notes;
CREATE TRIGGER update_user_notes_updated_at
BEFORE UPDATE ON public.user_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();