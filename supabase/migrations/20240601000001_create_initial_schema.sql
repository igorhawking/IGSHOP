-- Create enum types
CREATE TYPE user_role AS ENUM ('cliente', 'loja', 'admin');
CREATE TYPE pedido_status AS ENUM ('em_preparo', 'saiu_para_entrega', 'entregue', 'cancelado');
CREATE TYPE carrinho_status AS ENUM ('aberto', 'finalizado', 'cancelado');
CREATE TYPE pagamento_tipo AS ENUM ('pix', 'cartao', 'boleto');
CREATE TYPE pagamento_status AS ENUM ('pendente', 'aprovado', 'recusado');
CREATE TYPE produto_tipo AS ENUM ('comida', 'mercado', 'servico');
CREATE TYPE loja_status AS ENUM ('aberto', 'fechado');

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'cliente',
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  endereco_default JSONB,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enderecos table
CREATE TABLE IF NOT EXISTS enderecos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  apelido TEXT NOT NULL,
  rua TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT NOT NULL,
  geo_location POINT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create restaurantes table
CREATE TABLE IF NOT EXISTS restaurantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  categoria TEXT NOT NULL,
  status loja_status NOT NULL DEFAULT 'fechado',
  tempo_estimado INTEGER, -- em minutos
  taxa_entrega DECIMAL(10, 2),
  geo_location POINT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mercados table
CREATE TABLE IF NOT EXISTS mercados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  status loja_status NOT NULL DEFAULT 'fechado',
  taxa_entrega DECIMAL(10, 2),
  geo_location POINT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create fornecedores_servicos table
CREATE TABLE IF NOT EXISTS fornecedores_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  categoria TEXT NOT NULL,
  status loja_status NOT NULL DEFAULT 'fechado',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create produtos table
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurante_id UUID REFERENCES restaurantes(id) ON DELETE CASCADE,
  mercado_id UUID REFERENCES mercados(id) ON DELETE CASCADE,
  fornecedor_id UUID REFERENCES fornecedores_servicos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  estoque INTEGER,
  categoria TEXT,
  tipo produto_tipo NOT NULL,
  codigo_barras TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT check_only_one_owner CHECK (
    (restaurante_id IS NOT NULL AND mercado_id IS NULL AND fornecedor_id IS NULL) OR
    (restaurante_id IS NULL AND mercado_id IS NOT NULL AND fornecedor_id IS NULL) OR
    (restaurante_id IS NULL AND mercado_id IS NULL AND fornecedor_id IS NOT NULL)
  )
);

-- Create carrinhos table
CREATE TABLE IF NOT EXISTS carrinhos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  itens JSONB NOT NULL DEFAULT '[]'::jsonb,
  status carrinho_status NOT NULL DEFAULT 'aberto',
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  desconto DECIMAL(10, 2) DEFAULT 0,
  forma_pagamento TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expira_em TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours')
);

-- Create pedidos table
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  restaurante_id UUID REFERENCES restaurantes(id),
  mercado_id UUID REFERENCES mercados(id),
  fornecedor_id UUID REFERENCES fornecedores_servicos(id),
  endereco_entrega_id UUID REFERENCES enderecos(id),
  itens JSONB NOT NULL,
  valor_produtos DECIMAL(10, 2) NOT NULL,
  valor_entrega DECIMAL(10, 2) NOT NULL DEFAULT 0,
  valor_desconto DECIMAL(10, 2) NOT NULL DEFAULT 0,
  valor_total DECIMAL(10, 2) NOT NULL,
  status pedido_status NOT NULL DEFAULT 'em_preparo',
  data_pedido TIMESTAMP WITH TIME ZONE DEFAULT now(),
  entrega_prevista TIMESTAMP WITH TIME ZONE,
  entrega_realizada TIMESTAMP WITH TIME ZONE,
  tipo produto_tipo NOT NULL,
  observacoes TEXT,
  CONSTRAINT check_only_one_provider CHECK (
    (restaurante_id IS NOT NULL AND mercado_id IS NULL AND fornecedor_id IS NULL) OR
    (restaurante_id IS NULL AND mercado_id IS NOT NULL AND fornecedor_id IS NULL) OR
    (restaurante_id IS NULL AND mercado_id IS NULL AND fornecedor_id IS NOT NULL)
  )
);

-- Create scan_items table
CREATE TABLE IF NOT EXISTS scan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES produtos(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  escaneado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  carrinho_id UUID REFERENCES carrinhos(id) ON DELETE CASCADE
);

-- Create pagamentos table
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  tipo pagamento_tipo NOT NULL,
  valor_total DECIMAL(10, 2) NOT NULL,
  status pagamento_status NOT NULL DEFAULT 'pendente',
  gateway_id TEXT,
  gateway_data JSONB,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notificacoes table
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT now(),
  lida BOOLEAN DEFAULT false
);

-- Create servicos table
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fornecedor_id UUID NOT NULL REFERENCES fornecedores_servicos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  duracao INTEGER, -- em minutos
  disponibilidade JSONB, -- formato: {"dias": [1,2,3,4,5], "horarios": [{"inicio": "09:00", "fim": "18:00"}]}
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agendamentos table
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado',
  pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create promocoes table
CREATE TABLE IF NOT EXISTS promocoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  codigo TEXT UNIQUE,
  tipo TEXT NOT NULL, -- percentual, valor_fixo
  valor DECIMAL(10, 2) NOT NULL,
  valor_minimo DECIMAL(10, 2),
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  restaurante_id UUID REFERENCES restaurantes(id) ON DELETE CASCADE,
  mercado_id UUID REFERENCES mercados(id) ON DELETE CASCADE,
  fornecedor_id UUID REFERENCES fornecedores_servicos(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create avaliacoes table
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  restaurante_id UUID REFERENCES restaurantes(id) ON DELETE CASCADE,
  mercado_id UUID REFERENCES mercados(id) ON DELETE CASCADE,
  fornecedor_id UUID REFERENCES fornecedores_servicos(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enderecos ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercados ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrinhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE promocoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_enderecos_user_id ON enderecos(user_id);
CREATE INDEX idx_restaurantes_user_id ON restaurantes(user_id);
CREATE INDEX idx_mercados_user_id ON mercados(user_id);
CREATE INDEX idx_fornecedores_user_id ON fornecedores_servicos(user_id);
CREATE INDEX idx_produtos_restaurante_id ON produtos(restaurante_id);
CREATE INDEX idx_produtos_mercado_id ON produtos(mercado_id);
CREATE INDEX idx_produtos_fornecedor_id ON produtos(fornecedor_id);
CREATE INDEX idx_produtos_codigo_barras ON produtos(codigo_barras);
CREATE INDEX idx_carrinhos_user_id ON carrinhos(user_id);
CREATE INDEX idx_pedidos_user_id ON pedidos(user_id);
CREATE INDEX idx_pedidos_restaurante_id ON pedidos(restaurante_id);
CREATE INDEX idx_pedidos_mercado_id ON pedidos(mercado_id);
CREATE INDEX idx_pedidos_fornecedor_id ON pedidos(fornecedor_id);
CREATE INDEX idx_scan_items_user_id ON scan_items(user_id);
CREATE INDEX idx_scan_items_produto_id ON scan_items(produto_id);
CREATE INDEX idx_pagamentos_pedido_id ON pagamentos(pedido_id);
CREATE INDEX idx_notificacoes_user_id ON notificacoes(user_id);
CREATE INDEX idx_servicos_fornecedor_id ON servicos(fornecedor_id);
CREATE INDEX idx_agendamentos_servico_id ON agendamentos(servico_id);
CREATE INDEX idx_agendamentos_user_id ON agendamentos(user_id);
CREATE INDEX idx_avaliacoes_user_id ON avaliacoes(user_id);
CREATE INDEX idx_avaliacoes_pedido_id ON avaliacoes(pedido_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table enderecos;
alter publication supabase_realtime add table restaurantes;
alter publication supabase_realtime add table mercados;
alter publication supabase_realtime add table fornecedores_servicos;
alter publication supabase_realtime add table produtos;
alter publication supabase_realtime add table carrinhos;
alter publication supabase_realtime add table pedidos;
alter publication supabase_realtime add table scan_items;
alter publication supabase_realtime add table pagamentos;
alter publication supabase_realtime add table notificacoes;
alter publication supabase_realtime add table servicos;
alter publication supabase_realtime add table agendamentos;
alter publication supabase_realtime add table promocoes;
alter publication supabase_realtime add table avaliacoes;
