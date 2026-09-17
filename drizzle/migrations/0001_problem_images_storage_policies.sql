CREATE POLICY "students upload own problem images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'problem-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "students read own problem images" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'problem-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "admins read all problem images" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'problem-images' AND public.has_role(auth.uid(),'admin'));