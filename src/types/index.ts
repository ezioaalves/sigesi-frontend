/**
 * Tipos do Domínio Core - SIGESI
 * Alinhado com as diretrizes de arquitetura e padrão do projeto em Português.
 */

export enum UsuarioPerfil {
  CIDADAO = 'ROLE_CIDADAO',
  OPERADOR = 'ROLE_OPERADOR',
  AGENTE = 'ROLE_AGENTE',
  ADMIN = 'ROLE_ADMIN'
}

export enum SolicitacaoStatus {
  ABERTA = 'ABERTA',
  EM_ANALISE = 'EM_ANALISE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  ENCERRADA = 'ENCERRADA',
  REJEITADA = 'REJEITADA'
}

export enum SolicitacaoTipo {
  BURACO = 'BURACO',
  ILUMINACAO = 'ILUMINACAO',
  LIXO = 'LIXO',
  OUTROS = 'OUTROS'
}

export enum DemandaStatus {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  BLOQUEADA = 'BLOQUEADA',
  CONCLUIDA = 'CONCLUIDA'
}

export enum DemandaPrioridade {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA'
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: UsuarioPerfil;
  ativo: boolean;
}

export interface Endereco {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  referencia?: string;
}

export interface Solicitacao {
  id: number;
  assunto: string;
  body: string; // Mantido 'body' para compatibilidade com o backend atual
  tipo?: SolicitacaoTipo;
  status?: SolicitacaoStatus;
  data: string; // ISO DateTime
  local: Endereco;
  autor?: Usuario;
  anexo?: any;
}

export interface Demanda {
  id: number;
  solicitacaoId: number;
  status: DemandaStatus;
  prioridade: DemandaPrioridade;
  agenteId?: number;
}
