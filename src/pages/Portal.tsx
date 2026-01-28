import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/use-user";

import { getSolicitacoes } from "@/services/solicitacoes";
import { Solicitacao, SolicitacaoStatus } from "@/types";

// Função para mapear status para rótulos e classes CSS
const getStatusConfig = (status: SolicitacaoStatus) => {
  switch (status) {
    case SolicitacaoStatus.ABERTA:
      return { label: "Aberta", className: "bg-status-pending text-white" };
    case SolicitacaoStatus.EM_ANDAMENTO:
      return { label: "Em Andamento", className: "bg-status-inProgress text-white" };
    case SolicitacaoStatus.CONCLUIDA:
      return { label: "Concluída", className: "bg-status-completed text-white" };
    case SolicitacaoStatus.ENCERRADA:
      return { label: "Encerrada", className: "bg-status-completed text-white" };
    case SolicitacaoStatus.REJEITADA:
      return { label: "Rejeitada", className: "bg-destructive text-white" };
    default:
      return { label: "Desconhecido", className: "bg-muted text-muted-foreground" };
  }
};


import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/services/usuarios";

const Portal = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  // Estado para armazenar as solicitações do usuário
  const [selectedSolicitation, setSelectedSolicitation] = useState<Solicitacao | null>(null);
  // Estado para armazenar as solicitações do usuário
  const [mySolicitations, setMySolicitations] = useState<Solicitacao[]>([]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Invalidate queries and redirect regardless of backend success
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.location.href = "/";
    }
  };

  const getServerAreaPath = (role: string) => {
    if (role === "AGENTE") return "/agente";
    return "/dashboard";
  };

  useEffect(() => {
    getSolicitacoes()
      .then((data) => {
        // Mapeamento defensivo: se o backend não enviar status, assume ABERTA
        const mapped = data.map((item) => ({
          ...item,
          status: item.status || SolicitacaoStatus.ABERTA,
        }));
        // Filtra apenas as solicitações do usuário atual
        setMySolicitations(mapped);
      })
      .catch((err) => console.error("Failed to fetch solicitations", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Minhas Solicitações</h1>
            <p className="text-sm opacity-90">Acompanhe o status das suas solicitações</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/solicitacao">
              <Button variant="secondary" className="gap-2 shadow-sm hover:shadow-md transition-all">
                <FileText className="w-4 h-4" />
                Nova Solicitação
              </Button>
            </Link>
            {user && ["AGENTE", "OPERADOR", "ADMIN"].includes(user.perfil) && (
              <Link to={getServerAreaPath(user.perfil)}>
                <Button
                  variant="secondary"
                  className="gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Área do Servidor
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-4">
          {mySolicitations.map((solicitation) => {
            const statusConfig = getStatusConfig(solicitation.status!);
            return (
              <Card key={solicitation.id} className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{solicitation.assunto}</CardTitle>
                      </div>
                    </div>
                    <Badge className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{solicitation.body}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Enviado em: {new Date(solicitation.data).toLocaleDateString("pt-BR")}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSolicitation(solicitation)}>
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            {selectedSolicitation?.assunto}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">Status</p>
                            {selectedSolicitation && (
                              <Badge className={getStatusConfig(selectedSolicitation.status!).className}>
                                {getStatusConfig(selectedSolicitation.status!).label}
                              </Badge>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">Descrição</p>
                            <p className="text-sm">{selectedSolicitation?.body}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">Local</p>
                            <p className="text-sm">
                              {selectedSolicitation?.local.logradouro}, {selectedSolicitation?.local.numero} - {selectedSolicitation?.local.bairro}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">Data de Envio</p>
                            <p className="text-sm">
                              {selectedSolicitation && new Date(selectedSolicitation.data).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {mySolicitations.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Você ainda não possui solicitações</p>
                <Link to="/solicitacao">
                  <Button className="mt-4">
                    Enviar Nova Solicitação
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Sobre o Status</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe o progresso do seu pedido através das cores e etiquetas. Se tiver dúvidas, entre em contato com a secretaria.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Portal;
