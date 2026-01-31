import { apiFetch } from "@/lib/api";
import { Comentario, ComentarioCreateDTO } from "@/types";

export const comentariosService = {
    getByDemanda: async (demandaId: number): Promise<Comentario[]> => {
        return await apiFetch(`/api/comentarios/demanda/${demandaId}`);
    },

    create: async (data: ComentarioCreateDTO): Promise<Comentario> => {
        return await apiFetch("/api/comentarios/", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
    },

    delete: async (id: number): Promise<void> => {
        return await apiFetch(`/api/comentarios/${id}`, {
            method: "DELETE",
        });
    },
};
