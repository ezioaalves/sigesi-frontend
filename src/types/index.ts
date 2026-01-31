/**
 * Tipos do Domínio Core - SIGESI
 * Alinhado com as diretrizes de arquitetura e padrão do projeto em Português.
 */

export enum UsuarioPerfil {
  CIDADAO = 'CIDADAO',
  OPERADOR = 'OPERADOR',
  AGENTE = 'AGENTE',
  ADMIN = 'ADMIN'
}

export enum SolicitacaoStatus {
  ABERTA = 'ABERTA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  ENCERRADA = 'ENCERRADA',
  REJEITADA = 'REJEITADA'
}

export enum SolicitacaoTipo {
  BURACO = 'BURACO',
  ESGOTO = 'ESGOTO',
  ILUMINACAO = 'ILUMINACAO',
  LIMPEZA = 'LIMPEZA',
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

export type EnderecoCreateDTO = Omit<Endereco, 'id'>;

export interface Solicitacao {
  id: number;
  assunto: string;
  body: string; // Mantido 'body' para compatibilidade com o backend atual
  tipo?: SolicitacaoTipo;
  status?: SolicitacaoStatus;
  data: string; // ISO DateTime
  local: Endereco;
  autor?: Usuario;
  anexo?: unknown;
}

export interface Demanda {
  id: number;
  solicitacao: Solicitacao;
  responsavel?: Usuario;
  prazo: string; // ISO Date
  status: DemandaStatus;
  materiais: Material[];
}

export interface DemandaCreateDTO {
  solicitacaoId: number;
  responsavelId?: number;
  prazo: string;
  materiaisIds: number[];
}

export interface DemandaUpdateDTO {
  responsavelId?: number;
  prazo?: string;
  status?: DemandaStatus;
  materiaisIds?: number[];
}

export interface Material {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
}

export interface Comentario {
  id: number;
  demandaId: number;
  autor: Usuario;
  texto: string;
  criadoEm: string; // ISO DateTime
}

export interface ComentarioCreateDTO {
  demandaId: number;
  texto: string;
}
