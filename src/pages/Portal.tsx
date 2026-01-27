import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { getSolicitacoes } from "@/services/solicitacoes";
import { Solicitacao, SolicitacaoStatus } from "@/types";

const getStatusConfig = (status: SolicitacaoStatus) => {
  switch (status) {
    case SolicitacaoStatus.ABERTA:
      return { label: "Aberta", className: "bg-status-pending text-white" };
    case SolicitacaoStatus.EM_ANALISE:
      return { label: "Em Análise", className: "bg-status-pending text-white" };
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

const PortalSolicitations = () => {
  const [selectedSolicitation, setSelectedSolicitation] = useState<Solicitacao | null>(null);
  const [mySolicitations, setMySolicitations] = useState<Solicitacao[]>([]);

  useEffect(() => {
    getSolicitacoes()
      .then((data) => {
        // Mapeamento defensivo: se o backend não enviar status, assume ABERTA
        const mapped = data.map((item) => ({
          ...item,
          status: item.status || SolicitacaoStatus.ABERTA,
        }));
        setMySolicitations(mapped);
      })
      .catch((err) => console.error("Failed to fetch solicitations", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto">
          <Link to="/portal">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary/90 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Minhas Solicitações</h1>
          <p className="text-sm opacity-90">Acompanhe o status das suas solicitações</p>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-4">
          {mySolicitations.map((solicitation) => {
            const statusConfig = getStatusConfig(solicitation.status!);
            const solicitationNumber = `SOL-${new Date(solicitation.data).getFullYear()}-${String(solicitation.id).padStart(3, "0")}`;
            
            return (
              <Card key={solicitation.id} className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-mono text-sm text-muted-foreground">
                          {solicitationNumber}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{solicitation.assunto}</CardTitle>
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
                            <p className="text-sm font-semibold text-muted-foreground mb-1">Número da Solicitação</p>
                            <p className="font-mono">
                              {selectedSolicitation && `SOL-${new Date(selectedSolicitation.data).getFullYear()}-${String(selectedSolicitation.id).padStart(3, "0")}`}
                            </p>
                          </div>
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
                <p className="text-sm text-muted-foreground mb-4">
                  Não possui cadastro?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-semibold">
                    Cadastre-se aqui
                  </Link>
                </p>
                <Link to="/portal">
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

export default PortalSolicitations;
