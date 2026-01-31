import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Eye, Plus, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { materiaisService } from "@/services/materiais";
import { getSolicitacoes } from "@/services/solicitacoes";
import { getAllUsers } from "@/services/usuarios";
import { Demanda, UsuarioPerfil, SolicitacaoStatus } from "@/types";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useDemands, useCreateDemand, useUpdateDemand, useDemandComments } from "@/hooks/use-demands";
import { DemandStatusBadge } from "@/components/DemandStatusBadge";

const Demands = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDemand, setSelectedDemand] = useState<Demanda | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState<string>("");
    const [selectedAgentId, setSelectedAgentId] = useState<string>("");
    const [deadline, setDeadline] = useState("");
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]); // Array of IDs

    // Custom Hooks
    const { data: demands = [], isLoading: isLoadingDemands } = useDemands();
    const createDemandMutation = useCreateDemand();
    const updateDemandMutation = useUpdateDemand();

    // Query comments only when a demand is selected
    const { data: demandComments = [] } = useDemandComments(selectedDemand?.id);

    // Other data sources (Candidates for further hook encapsulation if desired)
    const { data: solicitacoes = [] } = useQuery({
        queryKey: ["solicitacoes", "abertas"],
        queryFn: async () => {
            const all = await getSolicitacoes();
            return all.filter(s => s.status === SolicitacaoStatus.ABERTA);
        },
    });

    const { data: users = [] } = useQuery({
        queryKey: ["usuarios"],
        queryFn: getAllUsers,
    });

    const { data: materials = [] } = useQuery({
        queryKey: ["materiais"],
        queryFn: materiaisService.getAll,
    });

    const agents = users.filter(u => u.perfil === UsuarioPerfil.AGENTE);


    const filteredDemands = demands.filter(
        (demand) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                demand.id.toString().includes(searchLower) ||
                demand.solicitacao?.assunto?.toString().toLowerCase().includes(searchLower) ||
                demand.solicitacao?.local?.logradouro.toLowerCase().includes(searchLower)
            );
        }
    );

    const handleOpenForm = () => {
        // Reset form
        setSelectedSolicitacaoId("");
        setSelectedAgentId("");
        setDeadline("");
        setSelectedMaterials([]);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    const handleCreateDemand = () => {
        if (!selectedSolicitacaoId || !deadline) {
            // Fix: removed variant: "secondary" as it caused a type error. Using default or destructive.
            toast({ title: "Atenção", description: "Preencha os campos obrigatórios." });
            return;
        }
        createDemandMutation.mutate(
            {
                solicitacaoId: Number(selectedSolicitacaoId),
                responsavelId: selectedAgentId ? Number(selectedAgentId) : undefined,
                prazo: deadline,
                materiaisIds: selectedMaterials.map(Number),
            },
            {
                onSuccess: () => handleCloseForm()
            }
        );
    };

    const handleAssignAgent = (demand: Demanda, agentId: string) => {
        updateDemandMutation.mutate({
            id: demand.id,
            data: { responsavelId: Number(agentId) }
        });
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto bg-background">
                    <header className="h-16 border-b bg-background flex items-center px-6 sticky top-0 z-10">
                        <SidebarTrigger />
                        <h1 className="text-2xl font-bold text-foreground ml-4">Gerenciamento de Demandas</h1>
                    </header>

                    <div className="p-6 space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar por número, título ou endereço..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button className="gap-2" onClick={handleOpenForm}>
                                        <Plus className="w-4 h-4" />
                                        Nova Demanda
                                    </Button>
                                </div>

                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Número</TableHead>
                                                <TableHead>Assunto</TableHead>
                                                <TableHead>Local</TableHead>
                                                <TableHead>Responsável</TableHead>
                                                <TableHead>Prazo</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoadingDemands ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center h-24">Carregando...</TableCell>
                                                </TableRow>
                                            ) : filteredDemands.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center h-24">Nenhuma demanda encontrada.</TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredDemands.map((demand) => (
                                                    <TableRow key={demand.id}>
                                                        <TableCell className="font-medium">DEM-{demand.id}</TableCell>
                                                        <TableCell>{demand.solicitacao?.assunto}</TableCell>
                                                        <TableCell className="max-w-[200px] truncate" title={`${demand.solicitacao?.local?.logradouro}, ${demand.solicitacao?.local?.numero}`}>
                                                            {demand.solicitacao?.local?.logradouro}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                value={demand.responsavel?.id?.toString() || ""}
                                                                onValueChange={(val) => handleAssignAgent(demand, val)}
                                                            >
                                                                <SelectTrigger className="w-[180px] h-8 text-xs">
                                                                    <SelectValue placeholder="Selecione Agente" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {agents.map(agent => (
                                                                        <SelectItem key={agent.id} value={agent.id.toString()}>
                                                                            {agent.nome}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>{demand.prazo ? format(new Date(demand.prazo), "dd/MM/yyyy") : "-"}</TableCell>
                                                        <TableCell>
                                                            <DemandStatusBadge status={demand.status} />
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setSelectedDemand(demand)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Create Demand Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Nova Demanda</DialogTitle>
                        <DialogDescription>
                            Crie uma demanda a partir de uma solicitação em aberto.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="solicitacao">Solicitação (Obrigatório)</Label>
                            <Select value={selectedSolicitacaoId} onValueChange={setSelectedSolicitacaoId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma solicitação..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {solicitacoes.length === 0 ? (
                                        <SelectItem value="none" disabled>Nenhuma solicitação em aberto</SelectItem>
                                    ) : (
                                        solicitacoes.map(s => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                #{s.id} - {s.assunto} ({s.local.bairro})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="agent">Responsável</Label>
                                <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um agente..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map(a => (
                                            <SelectItem key={a.id} value={a.id.toString()}>{a.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Prazo (Obrigatório)</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    value={deadline}
                                    onChange={e => setDeadline(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Materiais Iniciais</Label>
                            <div className="border rounded-md p-2 h-32 overflow-y-auto">
                                {materials.map(m => (
                                    <div key={m.id} className="flex items-center space-x-2 py-1">
                                        <input
                                            type="checkbox"
                                            id={`mat-${m.id}`}
                                            checked={selectedMaterials.includes(m.id.toString())}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedMaterials([...selectedMaterials, m.id.toString()]);
                                                } else {
                                                    setSelectedMaterials(selectedMaterials.filter(id => id !== m.id.toString()));
                                                }
                                            }}
                                            className="h-4 w-4"
                                        />
                                        <label htmlFor={`mat-${m.id}`} className="text-sm">{m.nome} (R$ {m.preco})</label>
                                    </div>
                                ))}
                                {materials.length === 0 && <p className="text-sm text-muted-foreground">Nenhum material cadastrado.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCloseForm}>Cancelar</Button>
                        <Button onClick={handleCreateDemand} disabled={createDemandMutation.isPending}>
                            {createDemandMutation.isPending ? "Criando..." : "Criar Demanda"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Details Dialog */}
            <Dialog open={!!selectedDemand} onOpenChange={() => setSelectedDemand(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Demanda #{selectedDemand?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedDemand && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-muted-foreground">Assunto</Label>
                                    <p className="font-medium">{selectedDemand.solicitacao?.assunto}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <p><DemandStatusBadge status={selectedDemand.status} /></p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Responsável</Label>
                                    <p className="font-medium">{selectedDemand.responsavel?.nome || "Não atribuído"}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Prazo</Label>
                                    <p className="font-medium">{selectedDemand.prazo ? format(new Date(selectedDemand.prazo), "dd/MM/yyyy") : "-"}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-2">Descrição da Solicitação</h3>
                                <p className="text-sm bg-muted p-3 rounded-md">{selectedDemand.solicitacao?.body}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-muted-foreground">Endereço</Label>
                                    <p>{selectedDemand.solicitacao?.local?.logradouro}, {selectedDemand.solicitacao?.local?.numero}</p>
                                    <p>{selectedDemand.solicitacao?.local?.bairro}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Data da Solicitação</Label>
                                    <p>{selectedDemand.solicitacao?.data ? format(new Date(selectedDemand.solicitacao.data), "dd/MM/yyyy") : "-"}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-2">Materiais</h3>
                                {selectedDemand.materiais && selectedDemand.materiais.length > 0 ? (
                                    <ul className="list-disc pl-5 text-sm">
                                        {selectedDemand.materiais.map(m => (
                                            <li key={m.id}>{m.nome} (R$ {m.preco.toFixed(2)})</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Nenhum material.</p>
                                )}
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-3">Comentários</h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {demandComments.length > 0 ? demandComments.map(c => (
                                        <div key={c.id} className="bg-muted p-3 rounded-md text-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold">{c.autor?.nome || "Usuário"}</span>
                                                <span className="text-xs text-muted-foreground">{format(new Date(c.criadoEm), "dd/MM/yyyy HH:mm")}</span>
                                            </div>
                                            <p>{c.texto}</p>
                                        </div>
                                    )) : <p className="text-sm text-muted-foreground">Nenhum comentário.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    );
};

export default Demands;