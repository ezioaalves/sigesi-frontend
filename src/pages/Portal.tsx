import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FileText, User, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Portal = () => {
  const { toast } = useToast();
  const [isAuthenticated] = useState(true); // Mock - would use Gov.br auth
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    address: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Alguns arquivos foram ignorados",
        description: "O tamanho máximo por arquivo é 5MB",
        variant: "destructive",
      });
    }
    
    setFiles(prev => [...prev, ...validFiles].slice(0, 10));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to the backend
    toast({
      title: "Solicitação enviada com sucesso!",
      description: "Você receberá atualizações sobre o andamento da sua solicitação.",
    });
    setFormData({ title: "", category: "", description: "", address: "" });
    setFiles([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Building2 className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle>Portal do Cidadão</CardTitle>
            <CardDescription>
              Faça login com sua conta Gov.br para enviar solicitações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg">
              Entrar com Gov.br
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portal do Cidadão</h1>
            <p className="text-sm opacity-90">SEINFRA - Sistema de Solicitações</p>
          </div>
          <Link to="/portal/solicitations">
            <Button variant="secondary" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              Minhas Solicitações
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Nova Solicitação</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo para enviar sua solicitação à SEINFRA
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Assunto da Solicitação</Label>
                <Input
                  id="title"
                  placeholder="Ex: Reparo de calçada, iluminação pública..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iluminacao">Iluminação</SelectItem>
                    <SelectItem value="esgoto">Esgoto</SelectItem>
                    <SelectItem value="buraco">Buraco na via</SelectItem>
                    <SelectItem value="calcada">Calçada</SelectItem>
                    <SelectItem value="limpeza">Limpeza urbana</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Detalhada</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva sua solicitação com o máximo de detalhes possível..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço/Local</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Anexar Arquivos (Opcional)</Label>
                <p className="text-xs text-muted-foreground">Máximo 5MB por arquivo, até 10 arquivos</p>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{(file.size / 1024).toFixed(1)}KB</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {files.length < 10 && (
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" size="lg">
                  Enviar Solicitação
                </Button>
                <Link to="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full" size="lg">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Suas informações são protegidas pela Lei Geral de Proteção de Dados (LGPD)</p>
        </div>
      </div>
    </div>
  );
};

export default Portal;
