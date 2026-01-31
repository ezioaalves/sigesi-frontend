import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demandasService } from "@/services/demandas";
import { comentariosService } from "@/services/comentarios";
import { DemandaStatus, DemandaCreateDTO, ComentarioCreateDTO } from "@/types";
import { toast } from "@/hooks/use-toast";

export const useDemands = () => {
    return useQuery({
        queryKey: ["demandas"],
        queryFn: demandasService.getAll,
    });
};

export const useAgentDemands = (userId?: number) => {
    return useQuery({
        queryKey: ["demandas", "responsavel", userId],
        queryFn: () => {
            if (!userId) return [];
            return demandasService.getByResponsavel(userId);
        },
        enabled: !!userId,
    });
};

export const useDemandComments = (demandId?: number) => {
    return useQuery({
        queryKey: ["comentarios", demandId],
        queryFn: () => {
            if (!demandId) return [];
            return comentariosService.getByDemanda(demandId);
        },
        enabled: !!demandId,
    });
};

export const useCreateDemand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: demandasService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["demandas"] });
            queryClient.invalidateQueries({ queryKey: ["solicitacoes"] });
            toast({ title: "Sucesso", description: "Demanda criada com sucesso." });
        },
        onError: () => {
            toast({ title: "Erro", description: "Falha ao criar demanda.", variant: "destructive" });
        },
    });
};

export const useUpdateDemand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { responsavelId?: number; status?: DemandaStatus } }) =>
            demandasService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["demandas"] });
            toast({ title: "Sucesso", description: "Demanda atualizada." });
        },
        onError: () => {
            toast({ title: "Erro", description: "Falha ao atualizar demanda.", variant: "destructive" });
        },
    });
};

export const useAddComment = (demandId?: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ComentarioCreateDTO) => comentariosService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comentarios", demandId] });
            toast({ title: "Sucesso", description: "Comentário adicionado." });
        },
        onError: () => {
            toast({ title: "Erro", description: "Falha ao adicionar comentário.", variant: "destructive" });
        },
    });
};
