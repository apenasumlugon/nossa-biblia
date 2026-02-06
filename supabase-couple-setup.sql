-- PIVOT: Estrutura para App de Casal (Leitor Bíblico)

-- 1. Tabela de Perfis (Profiles)
-- Estende a tabela auth.users automaticamente
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela de Casais (Couples)
-- Conecta dois usuários
create table public.couples (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references public.profiles(id) not null,
  user2_id uuid references public.profiles(id),
  connection_code text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Adicionar coluna partner_id em profiles para acesso rápido
alter table public.profiles 
add column partner_id uuid references public.profiles(id);

-- 3. Tabela de Atividade de Leitura (Reading Activity)
-- Registra o que cada usuário leu
create table public.reading_activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  book_abbrev text not null,
  chapter integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabela de Sincronização de Destaques (Highlights)
create table public.highlights (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  book_abbrev text not null,
  chapter integer not null,
  verse_number integer not null,
  color text not null, -- 'yellow', 'green', 'blue', 'pink'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, book_abbrev, chapter, verse_number)
);

-- 5. Trigger para criar perfil automaticamente ao cadastrar
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Configuração de RLS (Segurança)
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.reading_activity enable row level security;
alter table public.highlights enable row level security;

-- Políticas Simples (MVP)
-- Usuários podem ver seus próprios perfis e do parceiro
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );

-- Leitura e Destaques visíveis para todos (simplificação para MVP de casal, refine depois se quiser privacidade)
create policy "Activity viewable by everyone" on public.reading_activity for all using (true);
create policy "Highlights viewable by everyone" on public.highlights for all using (true);
create policy "Couples viewable by everyone" on public.couples for all using (true);

-- Habilitar Realtime
alter publication supabase_realtime add table public.reading_activity;
alter publication supabase_realtime add table public.highlights;
