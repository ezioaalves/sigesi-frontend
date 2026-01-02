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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Trash2, Edit, Pencil } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type DemandStatus = "pending" | "in-progress" | "completed" | "cancelled";

interface Comment {
  id: number;
  title: string;
  text: string;
  author: string;
  createdAt: string;
}

interface Material {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Demand {
  id: number;
  number: string;
  title: string;
  requester: string;
  agent: string;
  status: DemandStatus;
  createdAt: string;
  description?: string;
  comments?: Comment[];
  materials?: Material[];
}

const Demands = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [newCommentTitle, setNewCommentTitle] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [newMaterial, setNewMaterial] = useState({ name: "", quantity: 0, price: 0 });
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDemand, setEditingDemand] = useState<Demand | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requester: "",
    agent: "",
    status: "pending" as DemandStatus,
  });

  // Mock data
  const demands: Demand[] = [
    { 
      id: 1, 
      number: "DEM-2025-001", 
      title: "Reparo de calçada - Rua Principal", 
      requester: "João Silva", 
      agent: "Maria Santos", 
      status: "in-progress", 
      createdAt: "10/01/2025",
      description: "Necessário reparar calçada danificada na Rua Principal, altura do número 123.",
      comments: [
        { id: 1, title: "Vistoria inicial", text: "Área inspecionada, danos confirmados.", author: "Maria Santos", createdAt: "11/01/2025" }
      ],
      materials: [
        { id: 1, name: "Cimento", quantity: 10, price: 25.50 },
        { id: 2, name: "Areia", quantity: 5, price: 15.00 }
      ]
    },
    { id: 2, number: "DEM-2025-002", title: "Iluminação pública - Av. Central", requester: "Ana Costa", agent: "Pedro Costa", status: "pending", createdAt: "12/01/2025", description: "Poste sem iluminação.", comments: [], materials: [] },
    { id: 3, number: "DEM-2025-003", title: "Coleta de lixo - Bairro Norte", requester: "Carlos Souza", agent: "Ana Oliveira", status: "in-progress", createdAt: "08/01/2025", description: "Lixo acumulado.", comments: [], materials: [] },
    { id: 4, number: "DEM-2025-004", title: "Poda de árvores - Praça Central", requester: "Maria Lima", agent: "João Silva", status: "completed", createdAt: "05/01/2025", description: "Poda realizada.", comments: [], materials: [] },
  ];

  const getStatusBadge = (status: DemandStatus) => {
    const variants: Record<DemandStatus, { label: string; className: string }> = {
      pending: { label: "Pendente", className: "bg-status-pending text-white" },
      "in-progress": { label: "Em Andamento", className: "bg-status-inProgress text-white" },
      completed: { label: "Concluída", className: "bg-status-completed text-white" },
      cancelled: { label: "Cancelada", className: "bg-status-cancelled text-white" },
    };
    return variants[status];
  };

  const filteredDemands = demands.filter(
    (demand) =>
      demand.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.requester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddComment = () => {
    if (!newCommentTitle.trim() || !newCommentText.trim()) return;
    // In real app, this would call an API
    console.log("Adding comment:", { title: newCommentTitle, text: newCommentText });
    setNewCommentTitle("");
    setNewCommentText("");
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name.trim() || newMaterial.quantity <= 0 || newMaterial.price <= 0) return;
    // In real app, this would call an API
    console.log("Adding material:", newMaterial);
    setNewMaterial({ name: "", quantity: 0, price: 0 });
  };

  const handleUpdateMaterial = () => {
    if (!editingMaterial) return;
    // In real app, this would call an API
    console.log("Updating material:", editingMaterial);
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (materialId: number) => {
    // In real app, this would call an API
    console.log("Deleting material:", materialId);
  };

  const handleOpenForm = (demand?: Demand) => {
    if (demand) {
      setEditingDemand(demand);
      setFormData({
        title: demand.title,
        description: demand.description || "",
        requester: demand.requester,
        agent: demand.agent,
        status: demand.status,
      });
    } else {
      setEditingDemand(null);
      setFormData({
        title: "",
        description: "",
        requester: "",
        agent: "",
        status: "pending",
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDemand(null);
    setFormData({
      title: "",
      description: "",
      requester: "",
      agent: "",
      status: "pending",
    });
  };

  const handleSaveDemand = () => {
    // In real app, this would call an API
    console.log(editingDemand ? "Updating demand:" : "Creating demand:", formData);
    handleCloseForm();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b bg-background flex items-center px-6">
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
                      placeholder="Buscar por número, título ou solicitante..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button className="gap-2" onClick={() => handleOpenForm()}>
                    <Plus className="w-4 h-4" />
                    Nova Demanda
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Agente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDemands.map((demand) => {
                        const badge = getStatusBadge(demand.status);
                        return (
                          <TableRow key={demand.id}>
                            <TableCell className="font-medium">{demand.number}</TableCell>
                            <TableCell>{demand.title}</TableCell>
                            <TableCell>{demand.requester}</TableCell>
                            <TableCell>{demand.agent}</TableCell>
                            <TableCell>
                              <Badge className={badge.className}>{badge.label}</Badge>
                            </TableCell>
                            <TableCell>{demand.createdAt}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleOpenForm(demand)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedDemand(demand)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingDemand ? "Editar Demanda" : "Nova Demanda"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título da demanda"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada da demanda"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requester">Solicitante</Label>
                <Input
                  id="requester"
                  value={formData.requester}
                  onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                  placeholder="Nome do solicitante"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent">Agente</Label>
                <Input
                  id="agent"
                  value={formData.agent}
                  onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                  placeholder="Nome do agente"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as DemandStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in-progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button onClick={handleSaveDemand}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!selectedDemand} onOpenChange={() => setSelectedDemand(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDemand?.number} - {selectedDemand?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedDemand && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Detalhes</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Solicitante:</span>
                    <p className="font-medium">{selectedDemand.requester}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Agente:</span>
                    <p className="font-medium">{selectedDemand.agent}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p><Badge className={getStatusBadge(selectedDemand.status).className}>{getStatusBadge(selectedDemand.status).label}</Badge></p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data de Criação:</span>
                    <p className="font-medium">{selectedDemand.createdAt}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-muted-foreground">Descrição:</span>
                  <p className="mt-1">{selectedDemand.description}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Materiais Utilizados</h3>
                
                {selectedDemand.materials && selectedDemand.materials.length > 0 && (
                  <div className="mb-4 border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead>Preço Unitário</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDemand.materials.map((material) => (
                          <TableRow key={material.id}>
                            <TableCell>{material.name}</TableCell>
                            <TableCell>{material.quantity}</TableCell>
                            <TableCell>R$ {material.price.toFixed(2)}</TableCell>
                            <TableCell>R$ {(material.quantity * material.price).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingMaterial(material)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteMaterial(material.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {editingMaterial ? "Editar Material" : "Adicionar Material"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="material-name">Nome</Label>
                        <Input
                          id="material-name"
                          value={editingMaterial ? editingMaterial.name : newMaterial.name}
                          onChange={(e) => editingMaterial 
                            ? setEditingMaterial({ ...editingMaterial, name: e.target.value })
                            : setNewMaterial({ ...newMaterial, name: e.target.value })
                          }
                          placeholder="Ex: Cimento"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="material-quantity">Quantidade</Label>
                        <Input
                          id="material-quantity"
                          type="number"
                          min="0"
                          value={editingMaterial ? editingMaterial.quantity : newMaterial.quantity}
                          onChange={(e) => editingMaterial
                            ? setEditingMaterial({ ...editingMaterial, quantity: Number(e.target.value) })
                            : setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="material-price">Preço Unitário (R$)</Label>
                        <Input
                          id="material-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingMaterial ? editingMaterial.price : newMaterial.price}
                          onChange={(e) => editingMaterial
                            ? setEditingMaterial({ ...editingMaterial, price: Number(e.target.value) })
                            : setNewMaterial({ ...newMaterial, price: Number(e.target.value) })
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {editingMaterial ? (
                        <>
                          <Button onClick={handleUpdateMaterial}>Salvar</Button>
                          <Button variant="outline" onClick={() => setEditingMaterial(null)}>Cancelar</Button>
                        </>
                      ) : (
                        <Button onClick={handleAddMaterial}>
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Material
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Comentários</h3>
                
                {selectedDemand.comments && selectedDemand.comments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {selectedDemand.comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{comment.title}</h4>
                            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                          </div>
                          <p className="text-sm mb-2">{comment.text}</p>
                          <p className="text-xs text-muted-foreground">Por: {comment.author}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Adicionar Comentário</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="comment-title">Título</Label>
                      <Input
                        id="comment-title"
                        value={newCommentTitle}
                        onChange={(e) => setNewCommentTitle(e.target.value)}
                        placeholder="Título do comentário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comment-text">Comentário</Label>
                      <Textarea
                        id="comment-text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Escreva seu comentário..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddComment}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Comentário
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Demands;
