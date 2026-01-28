import { apiFetch } from "@/lib/api";
import { Endereco, EnderecoCreateDTO } from "@/types";

export const createEndereco = (dto: EnderecoCreateDTO): Promise<Endereco> =>
    apiFetch("/api/enderecos/", {
        method: "POST",
        body: JSON.stringify(dto),
    });
