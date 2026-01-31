import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, Clock, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { Demanda, DemandaStatus } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAgentDemands, useDemandComments, useAddComment, useUpdateDemand } from "@/hooks/use-demands";
import { DemandStatusBadge } from "@/components/DemandStatusBadge";

const Agent = () => {
    const { data: user, isLoading: isLoadingUser } = useUser();
    const [selectedDemand, setSelectedDemand] = useState<Demanda | null>(null);
    const [newComment, setNewComment] = useState("");
    const [newStatus, setNewStatus] = useState<DemandaStatus | "">("");

    // Custom Hooks
    const { data: demands = [], isLoading: isLoadingDemands } = useAgentDemands(user?.id);
    const { data: comments = [] } = useDemandComments(selectedDemand?.id);
    const addCommentMutation = useAddComment(selectedDemand?.id);
    const updateStatusMutation = useUpdateDemand();

    const handleAddComment = () => {
        if (newComment.trim() && selectedDemand) {
            addCommentMutation.mutate(
                { demandaId: selectedDemand.id, texto: newComment },
                {
                    onSuccess: () => setNewComment("")
                }
            );
        }
    };

    const handleStatusChange = () => {
        if (newStatus && selectedDemand) {
            updateStatusMutation.mutate(
                { id: selectedDemand.id, data: { status: newStatus as DemandaStatus } },
                {
                    onSuccess: (_, variables) => {
                        // Update local state to reflect change immediately in UI (optional, but good UX)
                        if (variables.data.status) {
                            setSelectedDemand({ ...selectedDemand, status: variables.data.status });
                        }
                        setNewStatus("");
                    }
                }
            );
        }
    };

    if (isLoadingUser || isLoadingDemands) {
        return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
    }

    if (!user) {
        return <div className="flex justify-center items-center min-h-screen">Acesso negado. Faça login.</div>;
    }

    if (selectedDemand) {
        return (
            <div className="min-h-screen bg-background pb-10">
                <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
                    <div className="container mx-auto flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDemand(null)}
                            className="text-primary-foreground hover:bg-primary/90"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="font-bold">DEM-{selectedDemand.id}</h1>
                            <p className="text-sm opacity-90">{selectedDemand.solicitacao.assunto}</p>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto p-4 space-y-4 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Descrição</CardTitle>
                                <DemandStatusBadge status={selectedDemand.status} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground">{selectedDemand.solicitacao.body}</p>
                            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                                <p className="font-semibold text-foreground mb-1">Localização:</p>
                                <p>{selectedDemand.solicitacao.local.logradouro}, {selectedDemand.solicitacao.local.numero}</p>
                                <p>{selectedDemand.solicitacao.local.bairro}</p>
                                {selectedDemand.solicitacao.local.referencia && <p className="italic">{selectedDemand.solicitacao.local.referencia}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Materiais</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedDemand.materiais && selectedDemand.materiais.length > 0 ? (
                                <ul className="list-disc pl-5">
                                    {selectedDemand.materiais.map(m => (
                                        <li key={m.id}>{m.nome} (R$ {m.preco.toFixed(2)})</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">Nenhum material registrado.</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2 italic">
                                * Nota: Edição de quantidade indisponível no momento.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Histórico de Comentários</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-muted p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-sm flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {comment.autor?.nome || "Usuário"}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {format(new Date(comment.criadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{comment.texto}</p>
                                </div>
                            ))}
                            {comments.length === 0 && <p className="text-sm text-muted-foreground">Nenhum comentário.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Atualizar Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as DemandaStatus)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione novo status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={DemandaStatus.PENDENTE}>Pendente</SelectItem>
                                    <SelectItem value={DemandaStatus.EM_ANDAMENTO}>Em Andamento</SelectItem>
                                    <SelectItem value={DemandaStatus.CONCLUIDA}>Concluída</SelectItem>
                                    <SelectItem value={DemandaStatus.BLOQUEADA}>Bloqueada</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleStatusChange}
                                disabled={!newStatus || updateStatusMutation.isPending}
                                className="w-full"
                            >
                                {updateStatusMutation.isPending ? "Atualizando..." : "Atualizar Status"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Adicionar Comentário</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Textarea
                                    placeholder="Digite seu comentário..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <Button
                                onClick={handleAddComment}
                                disabled={!newComment.trim() || addCommentMutation.isPending}
                                className="w-full gap-2"
                            >
                                <Send className="w-4 h-4" />
                                {addCommentMutation.isPending ? "Enviando..." : "Enviar Comentário"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-xl font-bold">Minhas Demandas</h1>
                    <p className="text-sm opacity-90">Olá, {user.nome} (Agente)</p>
                </div>
            </header>

            <div className="container mx-auto p-4 space-y-3 max-w-2xl">
                {demands.length > 0 ? (
                    demands.map((demand) => (
                        <Card
                            key={demand.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedDemand(demand)}
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="font-semibold text-primary">DEM-{demand.id}</div>
                                        <h3 className="font-medium mt-1">{demand.solicitacao.assunto}</h3>
                                    </div>
                                    <DemandStatusBadge status={demand.status} />
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{demand.solicitacao.body}</p>
                                <div className="mt-2 text-xs text-muted-foreground flex gap-2">
                                    <span>Prazo: {demand.prazo ? format(new Date(demand.prazo), "dd/MM/yyyy") : "N/A"}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-muted-foreground">Nenhuma demanda atribuída a você.</p>
                        </CardContent>
                    </Card>
                )}

                <div className="pt-4">
                    <Link to="/">
                        <Button variant="outline" className="w-full">
                            Voltar ao Início
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Agent;