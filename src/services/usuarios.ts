import { apiFetch } from "@/lib/api";
import { Usuario } from "@/types";

export const getCurrentUser = async (): Promise<Usuario> => {
    const data = await apiFetch("/api/usuarios/me");
    // Map API response (name, role) to Usuario type (nome, perfil)
    return {
        id: data.id,
        nome: data.name,
        email: data.email,
        perfil: data.role,
        ativo: true // Default or missing from this endpoint
    } as Usuario;
};

export const getAllUsers = async (): Promise<Usuario[]> => {
    return await apiFetch("/api/usuarios/");
};

export const logoutUser = async (): Promise<void> => {
    await apiFetch("/logout", { method: "POST" });
};
