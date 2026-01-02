import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, Pencil } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DocumentType = "protocolo" | "memorando" | "oficio" | "guia" | "translado";

interface Cemetery {
  id: number;
  name: string;
}

interface Jazigo {
  id: number;
  number: string;
  quadra: string;
  rua: string;
  lote: string;
}

interface Document {
  id: number;
  number: string;
  type: DocumentType;
  title: string;
  date: string;
  status: string;
  // Burial guide specific fields
  mae?: string;
  pai?: string;
  naturalidade?: string;
  causa?: string;
  data_morte?: string;
  data_sepultamento?: string;
  local?: Cemetery;
  jazigo?: Jazigo;
  falecido?: string;
  cpf?: string;
  sexo?: string;
  // Transfer document specific fields
  cemiterio_destino?: Cemetery;
}

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    type: "protocolo" as DocumentType,
    title: "",
    date: "",
    status: "Ativo",
    mae: "",
    pai: "",
    naturalidade: "",
    causa: "",
    data_morte: "",
    data_sepultamento: "",
    local: undefined as Cemetery | undefined,
    jazigo: undefined as Jazigo | undefined,
    falecido: "",
    cpf: "",
    sexo: "",
    cemiterio_destino: undefined as Cemetery | undefined,
  });

  // Mock data for cemeteries and jazigos
  const cemeteries: Cemetery[] = [
    { id: 1, name: "Cemitério Central" },
    { id: 2, name: "Cemitério Municipal" },
    { id: 3, name: "Cemitério Jardim da Paz" },
  ];

  const jazigos: Jazigo[] = [
    { id: 1, number: "JAZ-001", quadra: "A", rua: "1", lote: "10" },
    { id: 2, number: "JAZ-002", quadra: "A", rua: "1", lote: "11" },
    { id: 3, number: "JAZ-003", quadra: "B", rua: "2", lote: "15" },
  ];

  // Mock data
  const documents: Document[] = [
    { id: 1, number: "PROT-2025-001", type: "protocolo", title: "Solicitação de Infraestrutura", date: "15/01/2025", status: "Ativo" },
    { id: 2, number: "MEM-2025-042", type: "memorando", title: "Parecer Técnico - Obra Av. Principal", date: "14/01/2025", status: "Ativo" },
    { id: 3, number: "OF-2025-123", type: "oficio", title: "Comunicado ao Departamento de Obras", date: "13/01/2025", status: "Arquivado" },
    { id: 4, number: "GUIA-2025-008", type: "guia", title: "Guia de Sepultamento - Cemitério Central", date: "12/01/2025", status: "Ativo" },
  ];

  const getDocumentTypeBadge = (type: DocumentType) => {
    const variants: Record<DocumentType, { label: string; className: string }> = {
      protocolo: { label: "Protocolo", className: "bg-primary text-primary-foreground" },
      memorando: { label: "Memorando", className: "bg-accent text-accent-foreground" },
      oficio: { label: "Ofício", className: "bg-success text-success-foreground" },
      guia: { label: "Guia", className: "bg-warning text-warning-foreground" },
      translado: { label: "Translado", className: "bg-secondary text-secondary-foreground" },
    };
    return variants[type];
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (document?: Document) => {
    if (document) {
      setEditingDocument(document);
      setFormData({
        number: document.number,
        type: document.type,
        title: document.title,
        date: document.date,
        status: document.status,
        mae: document.mae || "",
        pai: document.pai || "",
        naturalidade: document.naturalidade || "",
        causa: document.causa || "",
        data_morte: document.data_morte || "",
        data_sepultamento: document.data_sepultamento || "",
        local: document.local,
        jazigo: document.jazigo,
        falecido: document.falecido || "",
        cpf: document.cpf || "",
        sexo: document.sexo || "",
        cemiterio_destino: document.cemiterio_destino,
      });
    } else {
      setEditingDocument(null);
      setFormData({
        number: "",
        type: "protocolo",
        title: "",
        date: "",
        status: "Ativo",
        mae: "",
        pai: "",
        naturalidade: "",
        causa: "",
        data_morte: "",
        data_sepultamento: "",
        local: undefined,
        jazigo: undefined,
        falecido: "",
        cpf: "",
        sexo: "",
        cemiterio_destino: undefined,
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDocument(null);
    setFormData({
      number: "",
      type: "protocolo",
      title: "",
      date: "",
      status: "Ativo",
      mae: "",
      pai: "",
      naturalidade: "",
      causa: "",
      data_morte: "",
      data_sepultamento: "",
      local: undefined,
      jazigo: undefined,
      falecido: "",
      cpf: "",
      sexo: "",
      cemiterio_destino: undefined,
    });
  };

  const handleSaveDocument = () => {
    // In real app, this would call an API
    console.log(editingDocument ? "Updating document:" : "Creating document:", formData);
    handleCloseForm();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b bg-background flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-foreground ml-4">Gerenciamento de Documentos</h1>
          </header>

          <div className="p-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por número ou título..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button className="gap-2" onClick={() => handleOpenForm()}>
                    <Plus className="w-4 h-4" />
                    Novo Documento
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => {
                        const badge = getDocumentTypeBadge(doc.type);
                        return (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.number}</TableCell>
                            <TableCell>
                              <Badge className={badge.className}>{badge.label}</Badge>
                            </TableCell>
                            <TableCell>{doc.title}</TableCell>
                            <TableCell>{doc.date}</TableCell>
                            <TableCell>
                              <Badge variant={doc.status === "Ativo" ? "default" : "secondary"}>
                                {doc.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleOpenForm(doc)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="w-4 h-4" />
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
            <DialogTitle>{editingDocument ? "Editar Documento" : "Novo Documento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="Ex: PROT-2025-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as DocumentType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protocolo">Protocolo</SelectItem>
                  <SelectItem value="memorando">Memorando</SelectItem>
                  <SelectItem value="oficio">Ofício</SelectItem>
                  <SelectItem value="guia">Guia de Sepultamento</SelectItem>
                  <SelectItem value="translado">Translado de Corpo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do documento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Burial Guide Specific Fields */}
            {formData.type === "guia" && (
              <>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Dados do Falecido</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="falecido">Nome do Falecido</Label>
                      <Input
                        id="falecido"
                        value={formData.falecido}
                        onChange={(e) => setFormData({ ...formData, falecido: e.target.value })}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sexo">Sexo</Label>
                        <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Feminino">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mae">Nome da Mãe</Label>
                        <Input
                          id="mae"
                          value={formData.mae}
                          onChange={(e) => setFormData({ ...formData, mae: e.target.value })}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pai">Nome do Pai</Label>
                        <Input
                          id="pai"
                          value={formData.pai}
                          onChange={(e) => setFormData({ ...formData, pai: e.target.value })}
                          placeholder="Nome completo"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="naturalidade">Naturalidade</Label>
                      <Input
                        id="naturalidade"
                        value={formData.naturalidade}
                        onChange={(e) => setFormData({ ...formData, naturalidade: e.target.value })}
                        placeholder="Cidade - Estado"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="causa">Causa da Morte</Label>
                      <Input
                        id="causa"
                        value={formData.causa}
                        onChange={(e) => setFormData({ ...formData, causa: e.target.value })}
                        placeholder="Causa da morte"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="data_morte">Data do Óbito</Label>
                        <Input
                          id="data_morte"
                          type="datetime-local"
                          value={formData.data_morte}
                          onChange={(e) => setFormData({ ...formData, data_morte: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="data_sepultamento">Data do Sepultamento</Label>
                        <Input
                          id="data_sepultamento"
                          type="datetime-local"
                          value={formData.data_sepultamento}
                          onChange={(e) => setFormData({ ...formData, data_sepultamento: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Local do Sepultamento</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="local">Cemitério</Label>
                      <Select 
                        value={formData.local?.id.toString()} 
                        onValueChange={(value) => {
                          const cemetery = cemeteries.find(c => c.id.toString() === value);
                          setFormData({ ...formData, local: cemetery });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cemitério" />
                        </SelectTrigger>
                        <SelectContent>
                          {cemeteries.map((cemetery) => (
                            <SelectItem key={cemetery.id} value={cemetery.id.toString()}>
                              {cemetery.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jazigo">Jazigo</Label>
                      <Select 
                        value={formData.jazigo?.id.toString()} 
                        onValueChange={(value) => {
                          const selectedJazigo = jazigos.find(j => j.id.toString() === value);
                          setFormData({ ...formData, jazigo: selectedJazigo });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o jazigo" />
                        </SelectTrigger>
                        <SelectContent>
                          {jazigos.map((jazigo) => (
                            <SelectItem key={jazigo.id} value={jazigo.id.toString()}>
                              {jazigo.number} - Quadra {jazigo.quadra}, Rua {jazigo.rua}, Lote {jazigo.lote}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Transfer Document Specific Fields */}
            {formData.type === "translado" && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Translado de Corpo</h3>
                <div className="space-y-2">
                  <Label htmlFor="cemiterio_destino">Cemitério de Destino</Label>
                  <Select 
                    value={formData.cemiterio_destino?.id.toString()} 
                    onValueChange={(value) => {
                      const cemetery = cemeteries.find(c => c.id.toString() === value);
                      setFormData({ ...formData, cemiterio_destino: cemetery });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cemitério de destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {cemeteries.map((cemetery) => (
                        <SelectItem key={cemetery.id} value={cemetery.id.toString()}>
                          {cemetery.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button onClick={handleSaveDocument}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Documents;
