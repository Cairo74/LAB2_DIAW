CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ROLE_CLIENTE', 'ROLE_AGENTE_EMPRESA', 'ROLE_AGENTE_BANCO'))
);

CREATE TABLE IF NOT EXISTS clientes (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    rg VARCHAR(50) NOT NULL,
    cpf VARCHAR(20) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    profissao VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS rendimentos_empregadores (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    entidade_empregadora VARCHAR(255) NOT NULL,
    rendimento_mensal NUMERIC(12,2) NOT NULL CHECK (rendimento_mensal >= 0)
);

CREATE TABLE IF NOT EXISTS automoveis (
    id BIGSERIAL PRIMARY KEY,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    ano INT NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    placa VARCHAR(20) NOT NULL UNIQUE,
    tipo_proprietario VARCHAR(50) NOT NULL CHECK (tipo_proprietario IN ('CLIENTE', 'EMPRESA', 'BANCO')),
    proprietario_nome VARCHAR(255) NOT NULL,
    valor_diaria NUMERIC(10,2) NOT NULL CHECK (valor_diaria > 0),
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    imagem_url TEXT
);

CREATE TABLE IF NOT EXISTS pedidos_aluguel (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    automovel_id BIGINT NOT NULL REFERENCES automoveis(id) ON DELETE RESTRICT,
    data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    valor_total NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDENTE', 'AVALIADO_POSITIVO', 'AVALIADO_NEGATIVO', 'EM_EXECUCAO', 'CANCELADO', 'FINALIZADO')),
    parecer_agente TEXT,
    agente_responsavel VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS contratos_credito (
    id BIGSERIAL PRIMARY KEY,
    pedido_aluguel_id BIGINT NOT NULL UNIQUE REFERENCES pedidos_aluguel(id) ON DELETE CASCADE,
    banco_agente_nome VARCHAR(255) NOT NULL,
    valor_financiado NUMERIC(12,2) NOT NULL,
    numero_parcelas INT NOT NULL,
    taxa_juros_mensal NUMERIC(5,2) NOT NULL,
    status_aprovacao VARCHAR(50) NOT NULL CHECK (status_aprovacao IN ('NAO_SOLICITADO', 'PENDENTE', 'APROVADO', 'REJEITADO'))
);

INSERT INTO automoveis (matricula, ano, marca, modelo, placa, tipo_proprietario, proprietario_nome, valor_diaria, disponivel, imagem_url)
VALUES
('MAT-001-2024', 2024, 'Toyota', 'Corolla Cross XRE', 'BRA2E19', 'EMPRESA', 'Localiza Rent a Car', 190.00, true, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'),
('MAT-002-2023', 2023, 'Jeep', 'Compass Limited 1.3 Turbo', 'PUC4D26', 'BANCO', 'Banco Santander Financiamentos', 230.00, true, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'),
('MAT-003-2025', 2025, 'BYD', 'Song Plus Híbrido', 'DIA9B88', 'EMPRESA', 'Movida Frotas Corporativas', 260.00, true, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'),
('MAT-004-2023', 2023, 'Volkswagen', 'Nivus Highline TSI', 'BHT1A34', 'CLIENTE', 'Gestão Particular Cedida', 145.00, true, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'),
('MAT-005-2024', 2024, 'BMW', '320i M Sport', 'ENG7S25', 'BANCO', 'Banco Itaú Financiamentos', 420.00, true, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (matricula) DO NOTHING;
