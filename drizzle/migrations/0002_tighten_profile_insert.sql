DROP POLICY "own profile insert" ON public.profiles;
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated
WITH CHECK (id = auth.uid() AND role = 'student');