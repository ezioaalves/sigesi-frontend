import { apiFetch } from "@/lib/api";
import { Demanda, DemandaCreateDTO, DemandaUpdateDTO } from "@/types";

export const demandasService = {
    getAll: async (): Promise<Demanda[]> => {
        return await apiFetch("/api/demandas/");
    },

    getById: async (id: number): Promise<Demanda> => {
        return await apiFetch(`/api/demandas/${id}`);
    },

    getBySolicitacao: async (solicitacaoId: number): Promise<Demanda[]> => {
        return await apiFetch(`/api/demandas/solicitacao/${solicitacaoId}`);
    },

    getByResponsavel: async (responsavelId: number): Promise<Demanda[]> => {
        return await apiFetch(`/api/demandas/responsavel?responsavelId=${responsavelId}`);
    },

    create: async (data: DemandaCreateDTO): Promise<Demanda> => {
        return await apiFetch("/api/demandas/", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
    },

    update: async (id: number, data: DemandaUpdateDTO): Promise<Demanda> => {
        return await apiFetch(`/api/demandas/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
    },

    delete: async (id: number): Promise<void> => {
        return await apiFetch(`/api/demandas/${id}`, {
            method: "DELETE",
        });
    },
};
