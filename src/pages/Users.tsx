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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type UserRole = "admin" | "operator" | "agent";

interface User {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

interface UserFormData {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  role: UserRole;
  active: boolean;
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    cpf: "",
    phone: "",
    email: "",
    role: "agent",
    active: true,
  });

  // Mock data
  const users: User[] = [
    { id: 1, name: "Admin Principal", cpf: "12345678901", phone: "(11) 98765-4321", email: "admin@seinfra.gov.br", role: "admin", active: true, createdAt: "01/01/2025" },
    { id: 2, name: "João Operador", cpf: "23456789012", phone: "(11) 98765-4322", email: "joao@seinfra.gov.br", role: "operator", active: true, createdAt: "05/01/2025" },
    { id: 3, name: "Maria Santos", cpf: "34567890123", phone: "(11) 98765-4323", email: "maria@seinfra.gov.br", role: "agent", active: true, createdAt: "10/01/2025" },
    { id: 4, name: "Pedro Costa", cpf: "45678901234", phone: "(11) 98765-4324", email: "pedro@seinfra.gov.br", role: "agent", active: true, createdAt: "10/01/2025" },
    { id: 5, name: "Ana Oliveira", cpf: "56789012345", phone: "(11) 98765-4325", email: "ana@seinfra.gov.br", role: "agent", active: false, createdAt: "12/01/2025" },
  ];

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        cpf: user.cpf,
        phone: user.phone,
        email: user.email,
        role: user.role,
        active: user.active,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        cpf: "",
        phone: "",
        email: "",
        role: "agent",
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = () => {
    console.log("Saving user:", formData);
    // Here you would typically save to a database
    handleCloseModal();
  };

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<UserRole, { label: string; className: string }> = {
      admin: { label: "Administrador", className: "bg-destructive text-destructive-foreground" },
      operator: { label: "Operador", className: "bg-primary text-primary-foreground" },
      agent: { label: "Agente", className: "bg-accent text-accent-foreground" },
    };
    return variants[role];
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b bg-background flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-foreground ml-4">Gerenciamento de Usuários</h1>
          </header>

          <div className="p-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button className="gap-2" onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4" />
                    Novo Usuário
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const badge = getRoleBadge(user.role);
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={badge.className}>{badge.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.active ? "default" : "secondary"}>
                                {user.active ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.createdAt}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(user)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                maxLength={11}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@seinfra.gov.br"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="operator">Operador</SelectItem>
                  <SelectItem value="agent">Agente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Usuário Ativo</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? "Salvar Alterações" : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Users;
