-- CLEAN & REBUILD - Script Seguro
-- Use este script para reiniciar o banco de dados e garantir a estrutura correta.

-- 1. Limpeza (Opcional - mas resolve o erro "relation already exists")
-- AVISO: Isso apaga dados existentes dessas tabelas. Se for um banco novo, não tem problema.
DROP TABLE IF EXISTS public.highlights;
DROP TABLE IF EXISTS public.reading_activity;
DROP TABLE IF EXISTS public.favorites; -- Tabela antiga, vamos remover para não confundir
DROP TABLE IF EXISTS public.couples;
DROP TABLE IF EXISTS public.profiles;

-- 2. Tabela de Perfis (Profiles)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabela de Casais (Couples)
create table public.couples (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references public.profiles(id) not null,
  user2_id uuid references public.profiles(id),
  connection_code text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Adicionar coluna partner_id em profiles DEPOIS de criar a tabela couples para evitar dependência circular imediata
alter table public.profiles 
add column partner_id uuid references public.profiles(id);

-- 4. Tabela de Atividade de Leitura (Reading Activity)
create table public.reading_activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  book_abbrev text not null,
  chapter integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Tabela de Sincronização de Destaques (Highlights)
create table public.highlights (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  book_abbrev text not null,
  chapter integer not null,
  verse_number integer not null,
  color text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, book_abbrev, chapter, verse_number)
);

-- 6. Trigger para criar perfil automaticamente (Automagia do Supabase Auth)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Remove trigger antigo se existir para evitar duplicação
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Configuração de RLS (Segurança)
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.reading_activity enable row level security;
alter table public.highlights enable row level security;

-- Políticas
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );
create policy "Activity viewable by everyone" on public.reading_activity for all using (true);
create policy "Highlights viewable by everyone" on public.highlights for all using (true);
create policy "Couples viewable by everyone" on public.couples for all using (true);

-- 8. Realtime (Para ver o status "Lendo agora...")
-- Remove publicação antiga se existir para evitar erro
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
