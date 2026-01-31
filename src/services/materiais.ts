import { apiFetch } from "@/lib/api";
import { Material } from "@/types";

export const materiaisService = {
    getAll: async (): Promise<Material[]> => {
        return await apiFetch("/api/materiais/");
    },
};
