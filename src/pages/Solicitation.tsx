import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FileText, User, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { createSolicitacao } from "@/services/solicitacoes";
import { createEndereco } from "@/services/enderecos";
import { apiFetch } from "@/lib/api";

// OAuth popup helper is defined inside the component so it can use hooks like `useToast`.

const Solicitacao = () => {
  const { toast } = useToast();
  const BACKEND_OAUTH_PATH = import.meta.env.VITE_API_BASE
    ? `${import.meta.env.VITE_API_BASE}/oauth2/authorization/google`
    : "/oauth2/authorization/google";

  const loginWithPopup = () => {
    const popup = window.open(BACKEND_OAUTH_PATH, "oauth", "width=600,height=700");
    if (!popup) {
      toast({ title: "Erro", description: "Não foi possível abrir janela de login.", variant: "destructive" });
      return;
    }

    const start = Date.now();
    const timeout = 2 * 60 * 1000; // 2 minutes

    const check = async () => {
      try {
        // We only care whether the endpoint responds without redirect/500.
        await apiFetch("/api/solicitacoes/");
        try { popup.close(); } catch { }
        toast({ title: "Logado", description: "Login concluído com sucesso." });
        clearInterval(interval);
      } catch (err: any) {
        // If server responds 500 or unauthenticated, keep polling until popup closes or timeout.
        if (popup.closed) {
          clearInterval(interval);
          toast({ title: "Login cancelado", description: "Janela de login foi fechada." });
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          try { popup.close(); } catch { }
          toast({ title: "Tempo esgotado", description: "Login não foi concluído a tempo.", variant: "destructive" });
        } else {
          // Optional: log error detail for debugging (do not spam user)
          console.debug("login check error", err?.status, err?.responseBody);
        }
      }
    };

    const interval = setInterval(check, 1500);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    apiFetch("/api/usuarios/me")
      .then((data) => {
        if (data && data.id) {
          setIsAuthenticated(true);
          setUser(data);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    logradouro: "",
    numero: "",
    bairro: "",
    referencia: "",
  });
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Create Address first
      const enderecoDto = {
        logradouro: formData.logradouro,
        numero: formData.numero,
        bairro: formData.bairro,
        referencia: formData.referencia,
      };

      const enderecoCriado = await createEndereco(enderecoDto);

      // 2. Create Solicitation with the new Address ID
      const dto = {
        assunto: formData.title,
        body: formData.description,
        anexoId: null,
        autorId: user?.id, // Real authenticated user id
        localId: enderecoCriado.id,
      };

      console.debug("createSolicitacao dto:", dto);
      await createSolicitacao(dto);

      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Você receberá atualizações sobre o andamento da sua solicitação.",
      });
      setFormData({
        title: "",
        category: "",
        description: "",
        logradouro: "",
        numero: "",
        bairro: "",
        referencia: ""
      });
      setFiles([]);
    } catch (err: any) {
      toast({
        title: "Erro ao enviar solicitação",
        description: err?.message || "Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
          <Link to="/portal">
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

              <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                <Label className="text-lg font-semibold">Endereço do Local</Label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logradouro">Logradouro (Rua, Av, etc)</Label>
                    <Input
                      id="logradouro"
                      placeholder="Ex: Rua das Flores"
                      value={formData.logradouro}
                      onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      placeholder="Ex: 123"
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    placeholder="Ex: Centro"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referencia">Ponto de Referência (Opcional)</Label>
                  <Input
                    id="referencia"
                    placeholder="Ex: Próximo ao mercado..."
                    value={formData.referencia}
                    onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Anexar Arquivos (Opcional)</Label>
                <p className="text-xs text-muted-foreground">Máximo 5MB por arquivo, até 10 arquivos</p>

                <div className="grid gap-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md border">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{(file.size / 1024).toFixed(1)}KB</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {files.length < 10 && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                      multiple
                    />
                    <Label
                      htmlFor="file-upload"
                      className="flex items-center gap-2 cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors w-full justify-center border border-dashed border-primary/20 hover:border-primary"
                    >
                      <Upload className="w-4 h-4" />
                      Selecionar Arquivos
                    </Label>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" size="lg" disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar Solicitação"}
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
      </div>
    </div>
  );
};

export default Solicitacao;
