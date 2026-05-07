-- Correção de Permissões (RLS) para a tabela reservations

-- Opção 1: Desativar temporariamente o RLS para permitir que o backend funcione
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;

-- Se o Storage (bucket "proofs") estiver a dar erro também no upload de comprovativos, certifique-se de que correu:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('proofs', 'proofs', true) ON CONFLICT (id) DO NOTHING;
-- E permita acessos (as políticas abaixo resolvem o RLS no storage):
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'proofs');
-- CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'proofs');
-- CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'proofs');
