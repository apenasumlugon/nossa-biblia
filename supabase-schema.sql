# SQL para criar as tabelas no Supabase
# Execute isso no SQL Editor do seu projeto Supabase

-- Tabela de casais (códigos únicos)
CREATE TABLE couples (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(6) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de favoritos compartilhados
CREATE TABLE favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_code VARCHAR(6) NOT NULL REFERENCES couples(code) ON DELETE CASCADE,
    verse_id VARCHAR(100) NOT NULL,
    book_abbrev VARCHAR(10) NOT NULL,
    book_name VARCHAR(50) NOT NULL,
    chapter INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    text TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    added_by VARCHAR(50) DEFAULT 'Anônimo',
    UNIQUE(couple_code, verse_id)
);

-- Índices para melhor performance
CREATE INDEX idx_favorites_couple_code ON favorites(couple_code);
CREATE INDEX idx_couples_code ON couples(code);

-- Habilitar RLS (Row Level Security) para segurança
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (simplificado para facilidade de uso)
-- Em produção, você pode querer políticas mais restritivas

-- Qualquer um pode criar e ver casais
CREATE POLICY "Allow all operations on couples" ON couples
    FOR ALL USING (true) WITH CHECK (true);

-- Qualquer um pode gerenciar favoritos
CREATE POLICY "Allow all operations on favorites" ON favorites
    FOR ALL USING (true) WITH CHECK (true);

-- Habilitar Realtime para a tabela favorites
ALTER PUBLICATION supabase_realtime ADD TABLE favorites;
