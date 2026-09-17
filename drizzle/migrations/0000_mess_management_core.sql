-- ROLES
CREATE TYPE public.app_role AS ENUM ('student','admin');
CREATE TYPE public.occupancy_status AS ENUM ('IN','OUT');
CREATE TYPE public.problem_status AS ENUM ('Pending','In Progress','Resolved','Rejected');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL,
  role public.app_role NOT NULL DEFAULT 'student',
  student_id text UNIQUE,
  qr_code uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admin roles read" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "admin profile read" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles p WHERE p.id = auth.uid()));

-- SESSIONS
CREATE TABLE public.mess_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  reset_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mess_sessions TO authenticated;
GRANT INSERT, UPDATE ON public.mess_sessions TO authenticated;
GRANT ALL ON public.mess_sessions TO service_role;
ALTER TABLE public.mess_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions read" ON public.mess_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin sessions write" ON public.mess_sessions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin sessions update" ON public.mess_sessions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- OCCUPANCY
CREATE TABLE public.student_occupancy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_status public.occupancy_status NOT NULL DEFAULT 'OUT',
  entered_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.student_occupancy TO authenticated;
GRANT INSERT, UPDATE ON public.student_occupancy TO authenticated;
GRANT ALL ON public.student_occupancy TO service_role;
ALTER TABLE public.student_occupancy ENABLE ROW LEVEL SECURITY;
CREATE POLICY "occupancy read" ON public.student_occupancy FOR SELECT TO authenticated USING (true);
CREATE POLICY "own occupancy row create" ON public.student_occupancy FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin occupancy update" ON public.student_occupancy FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- TRANSACTIONS
CREATE TABLE public.qr_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.mess_sessions(id) ON DELETE SET NULL,
  action public.occupancy_status NOT NULL,
  performed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  performed_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.qr_transactions TO authenticated;
GRANT ALL ON public.qr_transactions TO service_role;
ALTER TABLE public.qr_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin tx read" ON public.qr_transactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "own tx read" ON public.qr_transactions FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "admin tx insert" ON public.qr_transactions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));

-- SETTINGS
CREATE TABLE public.mess_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_seats int NOT NULL DEFAULT 100,
  very_low_max int NOT NULL DEFAULT 10,
  low_max int NOT NULL DEFAULT 30,
  medium_max int NOT NULL DEFAULT 60,
  high_max int NOT NULL DEFAULT 80,
  breakfast_start time NOT NULL DEFAULT '07:00',
  breakfast_end time NOT NULL DEFAULT '09:30',
  lunch_start time NOT NULL DEFAULT '12:00',
  lunch_end time NOT NULL DEFAULT '14:30',
  snacks_start time NOT NULL DEFAULT '16:30',
  snacks_end time NOT NULL DEFAULT '18:00',
  dinner_start time NOT NULL DEFAULT '19:30',
  dinner_end time NOT NULL DEFAULT '21:30',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT, UPDATE ON public.mess_settings TO authenticated;
GRANT ALL ON public.mess_settings TO service_role;
ALTER TABLE public.mess_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings read" ON public.mess_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin settings update" ON public.mess_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PROBLEMS
CREATE TABLE public.problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  status public.problem_status NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT, INSERT, UPDATE ON public.problems TO authenticated;
GRANT ALL ON public.problems TO service_role;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own problems read" ON public.problems FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "admin problems read" ON public.problems FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "own problems insert" ON public.problems FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "admin problems update" ON public.problems FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- MENU
CREATE TABLE public.menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL,
  meal_period text NOT NULL,
  items text[] NOT NULL DEFAULT '{}',
  default_items text[] NOT NULL DEFAULT '{}',
  is_default boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (day, meal_period)
);
GRANT SELECT, UPDATE ON public.menu TO authenticated;
GRANT ALL ON public.menu TO service_role;
ALTER TABLE public.menu ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu read" ON public.menu FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin menu update" ON public.menu FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ADMIN ACCESS (service role only; no grants to anon/authenticated)
CREATE TABLE public.admin_access (
  id int PRIMARY KEY DEFAULT 1,
  shared_password text NOT NULL
);
GRANT ALL ON public.admin_access TO service_role;
ALTER TABLE public.admin_access ENABLE ROW LEVEL SECURITY;
INSERT INTO public.admin_access (id, shared_password) VALUES (1, 'rguktsklmmess@2016');

INSERT INTO public.mess_settings (total_seats) VALUES (100);
INSERT INTO public.mess_sessions DEFAULT VALUES;

INSERT INTO public.menu (day, meal_period, items, default_items) VALUES
('Monday','Breakfast', ARRAY['Idly','Sambar','Chutney','Milk/Coffee'], ARRAY['Idly','Sambar','Chutney','Milk/Coffee']),
('Monday','Lunch', ARRAY['Rice','Thotakura Pappu','Alu Dum Fry (Curry)','Rasam','Curd'], ARRAY['Rice','Thotakura Pappu','Alu Dum Fry (Curry)','Rasam','Curd']),
('Monday','Snacks', ARRAY['Boiled Sanagulu/Guggillu','Tea and Milk'], ARRAY['Boiled Sanagulu/Guggillu','Tea and Milk']),
('Monday','Dinner', ARRAY['Rice','Lady''s Finger Curry','Sambar','Banana','Curd'], ARRAY['Rice','Lady''s Finger Curry','Sambar','Banana','Curd']),
('Tuesday','Breakfast', ARRAY['Uthappam','Palli Chutney','Egg/Fruit','Coffee & Milk'], ARRAY['Uthappam','Palli Chutney','Egg/Fruit','Coffee & Milk']),
('Tuesday','Lunch', ARRAY['Rice','Tomato Pappu','Cabbage 65','Rasam','Curd'], ARRAY['Rice','Tomato Pappu','Cabbage 65','Rasam','Curd']),
('Tuesday','Snacks', ARRAY['Biscuit Contains Fibres','Tea & Milk'], ARRAY['Biscuit Contains Fibres','Tea & Milk']),
('Tuesday','Dinner', ARRAY['Jeera Rice','Potato Curry','Rice','Majjiga Charu','Sweet'], ARRAY['Jeera Rice','Potato Curry','Rice','Majjiga Charu','Sweet']),
('Wednesday','Breakfast', ARRAY['Upma','Chutney','Coffee/Milk','Egg for Non-Vegetarians','Fruit for Vegetarians'], ARRAY['Upma','Chutney','Coffee/Milk','Egg for Non-Vegetarians','Fruit for Vegetarians']),
('Wednesday','Lunch', ARRAY['Rice','Mulakaya Tomato Curry','Gongura Chutney','Rasam','Curd'], ARRAY['Rice','Mulakaya Tomato Curry','Gongura Chutney','Rasam','Curd']),
('Wednesday','Snacks', ARRAY['Pakodi','Tea and Milk'], ARRAY['Pakodi','Tea and Milk']),
('Wednesday','Dinner', ARRAY['Rice','Veg Pulav','Mixed Vegetable Paneer Curry','Rasam','Banana','Curd'], ARRAY['Rice','Veg Pulav','Mixed Vegetable Paneer Curry','Rasam','Banana','Curd']),
('Thursday','Breakfast', ARRAY['Vada','Chutney','Sambar','Egg','Milk/Coffee'], ARRAY['Vada','Chutney','Sambar','Egg','Milk/Coffee']),
('Thursday','Lunch', ARRAY['Rice','Pappu','Guttu Vankay Curry','Tomato Chutney','Rasam','Curd'], ARRAY['Rice','Pappu','Guttu Vankay Curry','Tomato Chutney','Rasam','Curd']),
('Thursday','Snacks', ARRAY['Groundnut Chikki','Tea/Milk'], ARRAY['Groundnut Chikki','Tea/Milk']),
('Thursday','Dinner', ARRAY['Rice','Carrot Deep Fry','Sambar','Curd','Banana'], ARRAY['Rice','Carrot Deep Fry','Sambar','Curd','Banana']),
('Friday','Breakfast', ARRAY['Idly','Chutney','Sambar','Coffee/Milk'], ARRAY['Idly','Chutney','Sambar','Coffee/Milk']),
('Friday','Lunch', ARRAY['Rice','Chukka/Thota/Pala Kura Pappu','Gobi Curry','Rasam','Curd'], ARRAY['Rice','Chukka/Thota/Pala Kura Pappu','Gobi Curry','Rasam','Curd']),
('Friday','Snacks', ARRAY['Boiled Groundnut','Tea & Milk'], ARRAY['Boiled Groundnut','Tea & Milk']),
('Friday','Dinner', ARRAY['Rice','Dondakaya Fry','Sambar','Curd','Banana'], ARRAY['Rice','Dondakaya Fry','Sambar','Curd','Banana']),
('Saturday','Breakfast', ARRAY['Bonda (Without Maida)','Chutney','Milk/Coffee'], ARRAY['Bonda (Without Maida)','Chutney','Milk/Coffee']),
('Saturday','Lunch', ARRAY['Rice','Mudda Pappu','Ghee','Sweet','Avakay','Curd'], ARRAY['Rice','Mudda Pappu','Ghee','Sweet','Avakay','Curd']),
('Saturday','Snacks', ARRAY['Millet Chikki/Popcorn','Tea and Milk'], ARRAY['Millet Chikki/Popcorn','Tea and Milk']),
('Saturday','Dinner', ARRAY['Rice','Alu 65','Sambar','Curd','Banana'], ARRAY['Rice','Alu 65','Sambar','Curd','Banana']),
('Sunday','Breakfast', ARRAY['Dosa','Palli Chutney','Tomato Chutney','Milk & Coffee'], ARRAY['Dosa','Palli Chutney','Tomato Chutney','Milk & Coffee']),
('Sunday','Lunch', ARRAY['Veg Pulav','Paneer for Vegetarians and Chicken Curry for Non-Vegetarians','Rasam','Curd'], ARRAY['Veg Pulav','Paneer for Vegetarians and Chicken Curry for Non-Vegetarians','Rasam','Curd']),
('Sunday','Snacks', ARRAY['Biscuit','Tea & Coffee'], ARRAY['Biscuit','Tea & Coffee']),
('Sunday','Dinner', ARRAY['Pulihora','Alu Kurma','Curd Rice','Banana'], ARRAY['Pulihora','Alu Kurma','Curd Rice','Banana']);

ALTER PUBLICATION supabase_realtime ADD TABLE public.student_occupancy;
ALTER PUBLICATION supabase_realtime ADD TABLE public.qr_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.problems;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mess_settings;
