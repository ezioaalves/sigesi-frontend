import { apiFetch } from "@/lib/api";
import { Solicitacao } from "@/types";

export type SolicitacaoCreateDTO = {
  assunto: string;
  body: string;
  anexoId?: number | null;
  autorId: number;
  localId: number;
};

export type SolicitacaoResponse = Solicitacao;

export const getSolicitacoes = (): Promise<SolicitacaoResponse[]> =>
  apiFetch("/api/solicitacoes/");

export const createSolicitacao = (dto: SolicitacaoCreateDTO): Promise<SolicitacaoResponse> =>
  apiFetch("/api/solicitacoes/", {
    method: "POST",
    body: JSON.stringify(dto),
  });

export const getSolicitacaoById = (id: number): Promise<SolicitacaoResponse> =>
  apiFetch(`/api/solicitacoes/${id}`);

export const updateSolicitacao = (id: number, dto: Partial<SolicitacaoCreateDTO>): Promise<SolicitacaoResponse> =>
  apiFetch(`/api/solicitacoes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });

export const deleteSolicitacao = (id: number) =>
  fetch((import.meta.env.VITE_API_BASE || "http://localhost:8080") + `/api/solicitacoes/${id}`, {
    method: "DELETE",
  }).then((r) => {
    if (!r.ok) throw new Error(r.statusText);
    return null;
  });
