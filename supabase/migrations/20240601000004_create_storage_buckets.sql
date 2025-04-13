-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('produtos', 'produtos', true),
  ('banners', 'banners', true),
  ('comprovantes', 'comprovantes', false),
  ('qrcodes', 'qrcodes', false),
  ('logos', 'logos', true),
  ('perfis', 'perfis', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies

-- Public access for produtos bucket
DROP POLICY IF EXISTS "Public read access" ON storage.objects FOR SELECT;
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('produtos', 'banners', 'logos', 'perfis'));

-- Authenticated users can upload to produtos bucket
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects FOR INSERT;
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('produtos', 'banners', 'logos', 'perfis') AND auth.role() = 'authenticated');

-- Users can update their own uploads
DROP POLICY IF EXISTS "Users can update their own uploads" ON storage.objects FOR UPDATE;
CREATE POLICY "Users can update their own uploads"
  ON storage.objects FOR UPDATE
  USING (auth.uid() = owner);

-- Users can delete their own uploads
DROP POLICY IF EXISTS "Users can delete their own uploads" ON storage.objects FOR DELETE;
CREATE POLICY "Users can delete their own uploads"
  ON storage.objects FOR DELETE
  USING (auth.uid() = owner);

-- Only authenticated users can access private buckets
DROP POLICY IF EXISTS "Authenticated access to private buckets" ON storage.objects FOR SELECT;
CREATE POLICY "Authenticated access to private buckets"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('comprovantes', 'qrcodes') AND auth.role() = 'authenticated' AND auth.uid() = owner);

-- Only authenticated users can upload to private buckets
DROP POLICY IF EXISTS "Authenticated upload to private buckets" ON storage.objects FOR INSERT;
CREATE POLICY "Authenticated upload to private buckets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('comprovantes', 'qrcodes') AND auth.role() = 'authenticated');
