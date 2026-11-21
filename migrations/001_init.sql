create table if not exists accounts (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  display_name text not null,
  role text not null check (role in ('superuser', 'event_manager', 'trainer', 'trainee', 'member')),
  created_at timestamptz not null default now()
);

create table if not exists settings (
  key text primary key,
  value text not null
);

create table if not exists players (
  id text primary key,
  name text not null,
  club text,
  gender text not null check (gender in ('men', 'women')),
  birth_year int not null,
  ranking int not null,
  country text not null default 'Indonesia',
  province text not null,
  city text not null,
  district text,
  subdistrict text,
  postal_code text,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id text primary key,
  type text not null check (type in ('exhibition', 'tournament', 'basecamp')),
  title text not null,
  summary text not null,
  place text not null,
  capacity int not null,
  registration_opens timestamptz not null,
  registration_closes timestamptz not null,
  status text not null check (status in ('draft', 'open', 'qualification', 'elimination', 'completed')),
  duration_weeks int,
  start_date date,
  group_size int default 4,
  advance_count int default 2,
  created_at timestamptz not null default now()
);

create table if not exists entries (
  id text primary key,
  event_id text not null references events(id),
  player_id text not null references players(id),
  status text not null check (status in ('pending', 'confirmed', 'withdrawn')),
  seed_order int,
  created_at timestamptz not null default now(),
  unique (event_id, player_id)
);

create table if not exists event_groups (
  id text primary key,
  event_id text not null references events(id),
  group_index int not null,
  player_id text not null references players(id),
  seed_in_group int not null,
  unique (event_id, group_index, player_id)
);

create table if not exists matches (
  id text primary key,
  event_id text not null references events(id),
  stage text not null check (stage in ('qualification', 'elimination', 'exhibition')),
  group_index int,
  round int,
  slot int,
  player_a_id text references players(id),
  player_b_id text references players(id),
  score_a int,
  score_b int,
  winner_id text references players(id),
  is_bye boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists event_sessions (
  id text primary key,
  event_id text not null references events(id),
  day_index int not null,
  title text not null,
  notes text,
  unique (event_id, day_index)
);

create table if not exists course_sessions (
  id text primary key,
  course_key text not null,
  session_order int not null,
  duration_hours numeric not null,
  drills text not null,
  unique (course_key, session_order)
);

create table if not exists catalog_topics (
  id text primary key,
  title text not null
);

create table if not exists subscriptions (
  id text primary key,
  user_id text not null references accounts(id),
  method text not null check (method in ('monthly', 'one_time')),
  course_shape text not null check (course_shape in ('oyuda', 'custom')),
  status text not null check (status in ('pending', 'active', 'declined', 'completed', 'expired')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists custom_course_requests (
  id text primary key,
  user_id text not null references accounts(id),
  subscription_id text references subscriptions(id),
  goal text not null,
  session_count int not null,
  topic_ids text not null,
  status text not null check (status in ('pending', 'accepted', 'declined')),
  decline_reason text,
  created_at timestamptz not null default now()
);

create table if not exists custom_course_sessions (
  id text primary key,
  request_id text not null references custom_course_requests(id),
  session_order int not null,
  duration_hours numeric not null,
  topic_ids text not null,
  drills text not null,
  unique (request_id, session_order)
);

create table if not exists trainee_progress (
  id text primary key,
  user_id text not null references accounts(id),
  course_key text not null,
  session_order int not null,
  done boolean not null default false,
  done_at timestamptz,
  unique (user_id, course_key, session_order)
);

create table if not exists evaluations (
  id text primary key,
  kind text not null check (kind in ('exercise', 'training', 'match')),
  notes text not null,
  player_a text,
  player_b text,
  score text,
  summary text not null,
  strengths text not null,
  improvements text not null,
  next_session text not null,
  source text not null check (source in ('model', 'rubric')),
  trainee_user_id text references accounts(id),
  session_ref text,
  created_by text references accounts(id),
  created_at timestamptz not null default now()
);

create table if not exists auth_sessions (
  id text primary key,
  account_id text not null references accounts(id),
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

insert into settings (key, value) values
  ('price_monthly', '450000'),
  ('price_one_time', '1500000');

insert into catalog_topics (id, title) values
  ('strategy', 'Strategy'),
  ('tactics', 'Tactics'),
  ('warm-up', 'Warm-up'),
  ('serve', 'Serve'),
  ('spin', 'Spin'),
  ('smash', 'Smash'),
  ('flick', 'Flick'),
  ('loop', 'Loop'),
  ('block', 'Block'),
  ('footwork', 'Footwork'),
  ('placement', 'Placement'),
  ('game-strategy', 'Game strategy');

insert into course_sessions (id, course_key, session_order, duration_hours, drills) values
  ('oyu-1', 'oyuda', 1, 2, '["no-spin forehand","right backspin forehand"]'),
  ('oyu-2', 'oyuda', 2, 2, '["right backspin forehand","left backspin forehand"]'),
  ('oyu-3', 'oyuda', 3, 2, '["right backspin to forehand loop","right topspin to forehand attack","left topspin to backhand drive"]'),
  ('oyu-4', 'oyuda', 4, 1.5, '["expected return","serve choice","return position"]'),
  ('oyu-5', 'oyuda', 5, 2, '["forehand short push","backhand short push","serve-push-attack patterns","right chop to forehand loop"]'),
  ('oyu-6', 'oyuda', 6, 2.5, '["short push choices","backhand drive into forehand loop","backspin and no-spin replies","topspin and chop block"]'),
  ('oyu-7', 'oyuda', 7, 2, '["long drive and attack pattern","loop and attack pattern"]'),
  ('oyu-8', 'oyuda', 8, 2, '["backhand and forehand loop","short push","forehand flick","forehand attack"]'),
  ('oyu-9', 'oyuda', 9, 2, '["long backhand drive into forehand attack","heavy-spin serve","long push","forehand flip"]'),
  ('oyu-10', 'oyuda', 10, 2, '["short serve","long push","attack","sparring"]'),
  ('oyu-11', 'oyuda', 11, 2, '["foot body and hand correction against topspin and backspin"]'),
  ('oyu-12', 'oyuda', 12, 2, '["forehand and backhand against topspin","backhand against backspin"]'),
  ('oyu-13', 'oyuda', 13, 2, '["short and long placement on both sides"]'),
  ('oyu-14', 'oyuda', 14, 2, '["long backspin","forehand loop","attack","pendulum backhand flick","forehand flick"]');

insert into players (id, name, club, gender, birth_year, ranking, province, city, district, subdistrict, postal_code) values
  ('p01', 'Andi Pratama', 'Jakarta Smash', 'men', 1998, 1, 'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Senayan', '12190'),
  ('p02', 'Budi Santoso', 'Surabaya Spin', 'men', 2001, 2, 'Jawa Timur', 'Surabaya', 'Gubeng', 'Airlangga', '60286'),
  ('p03', 'Citra Lestari', 'Bandung Loop', 'women', 2000, 3, 'Jawa Barat', 'Kota Bandung', 'Coblong', 'Dago', '40135'),
  ('p04', 'Dewi Anggraini', 'Medan Drive', 'women', 1997, 4, 'Sumatera Utara', 'Medan', 'Medan Baru', 'Padang Bulan', '20154'),
  ('p05', 'Eko Wijaya', 'Yogya Rally', 'men', 1999, 5, 'DI Yogyakarta', 'Kota Yogyakarta', 'Gondokusuman', 'Terban', '55223'),
  ('p06', 'Farah Putri', 'Semarang Push', 'women', 2002, 6, 'Jawa Tengah', 'Kota Semarang', 'Candisari', 'Jatingaleh', '50254'),
  ('p07', 'Gilang Rahman', 'Makassar Blade', 'men', 1996, 7, 'Sulawesi Selatan', 'Makassar', 'Panakkukang', 'Karampuang', '90231'),
  ('p08', 'Hana Melati', 'Bali Spin Club', 'women', 2003, 8, 'Bali', 'Denpasar', 'Denpasar Selatan', 'Sanur', '80228'),
  ('p09', 'Irwan Saputra', 'Palembang Edge', 'men', 1995, 9, 'Sumatera Selatan', 'Palembang', 'Ilir Timur I', '18 Ilir', '30121'),
  ('p10', 'Juwita Sari', 'Padang Attack', 'women', 1998, 10, 'Sumatera Barat', 'Padang', 'Padang Barat', 'Belakang Tangsi', '25118'),
  ('p11', 'Kevin Gunawan', 'Bekasi Club', 'men', 2000, 11, 'Jawa Barat', 'Kota Bekasi', 'Bekasi Selatan', 'Jakasampurna', '17145'),
  ('p12', 'Lina Kartika', 'Depok Table', 'women', 2001, 12, 'Jawa Barat', 'Kota Depok', 'Beji', 'Beji', '16421'),
  ('p13', 'Mario Tan', 'Tangerang Net', 'men', 1997, 13, 'Banten', 'Kota Tangerang', 'Cipondoh', 'Cipondoh', '15148'),
  ('p14', 'Nadia Rahma', 'Bogor Loop', 'women', 1999, 14, 'Jawa Barat', 'Kota Bogor', 'Bogor Tengah', 'Pabaton', '16121'),
  ('p15', 'Oscar Halim', 'Malang Drive', 'men', 2002, 15, 'Jawa Timur', 'Kota Malang', 'Klojen', 'Klojen', '65111'),
  ('p16', 'Putri Ayu', 'Solo Rally', 'women', 2000, 16, 'Jawa Tengah', 'Surakarta', 'Laweyan', 'Penumping', '57141');

insert into events (id, type, title, summary, place, capacity, registration_opens, registration_closes, status, duration_weeks, start_date, group_size, advance_count) values
  ('ev-tournament', 'tournament', 'Jakarta Open Qualifiers', 'Seeded groups into a single-elimination bracket for Indonesian players.', 'Gelora Senayan, Jakarta', 32, '2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z', 'qualification', null, null, 4, 2),
  ('ev-exhibition', 'exhibition', 'Bandung Night Exhibition', 'Showcase matches with invited Indonesian players.', 'Sabuga Bandung', 16, '2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z', 'open', null, null, null, null),
  ('ev-basecamp', 'basecamp', 'Yogya Two-Week Basecamp', 'Intensive 14-day camp built from the Oyuda session plan.', 'Yogyakarta Training Hall', 12, '2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z', 'open', 2, '2026-06-01', null, null);

insert into entries (id, event_id, player_id, status, seed_order) values
  ('en01', 'ev-tournament', 'p01', 'confirmed', 1),
  ('en02', 'ev-tournament', 'p02', 'confirmed', 2),
  ('en03', 'ev-tournament', 'p03', 'confirmed', 3),
  ('en04', 'ev-tournament', 'p04', 'confirmed', 4),
  ('en05', 'ev-tournament', 'p05', 'confirmed', 5),
  ('en06', 'ev-tournament', 'p06', 'confirmed', 6),
  ('en07', 'ev-tournament', 'p07', 'confirmed', 7),
  ('en08', 'ev-tournament', 'p08', 'confirmed', 8),
  ('en09', 'ev-exhibition', 'p01', 'confirmed', 1),
  ('en10', 'ev-exhibition', 'p03', 'confirmed', 2),
  ('en11', 'ev-basecamp', 'p05', 'confirmed', 1),
  ('en12', 'ev-basecamp', 'p06', 'confirmed', 2);

insert into event_groups (id, event_id, group_index, player_id, seed_in_group) values
  ('g1', 'ev-tournament', 0, 'p01', 0),
  ('g2', 'ev-tournament', 0, 'p08', 1),
  ('g3', 'ev-tournament', 0, 'p04', 2),
  ('g4', 'ev-tournament', 0, 'p05', 3),
  ('g5', 'ev-tournament', 1, 'p02', 0),
  ('g6', 'ev-tournament', 1, 'p07', 1),
  ('g7', 'ev-tournament', 1, 'p03', 2),
  ('g8', 'ev-tournament', 1, 'p06', 3);

insert into matches (id, event_id, stage, group_index, round, slot, player_a_id, player_b_id, score_a, score_b, winner_id, is_bye) values
  ('m1', 'ev-tournament', 'qualification', 0, 0, 0, 'p01', 'p08', 3, 1, 'p01', false),
  ('m2', 'ev-tournament', 'qualification', 0, 1, 0, 'p04', 'p05', 3, 2, 'p04', false),
  ('m3', 'ev-tournament', 'qualification', 0, 2, 0, 'p01', 'p04', 3, 0, 'p01', false),
  ('m4', 'ev-tournament', 'qualification', 1, 0, 0, 'p02', 'p07', 3, 1, 'p02', false),
  ('m5', 'ev-tournament', 'qualification', 1, 1, 0, 'p03', 'p06', 3, 2, 'p03', false),
  ('m6', 'ev-exhibition', 'exhibition', null, 1, 0, 'p01', 'p03', null, null, null, false);

insert into event_sessions (id, event_id, day_index, title, notes) values
  ('es1', 'ev-basecamp', 1, 'Day 1 — Forehand foundations', 'no-spin and backspin forehand'),
  ('es2', 'ev-basecamp', 2, 'Day 2 — Backspin both wings', 'right and left backspin'),
  ('es3', 'ev-basecamp', 3, 'Day 3 — Loop and attack links', 'backspin to loop, topspin to attack');
