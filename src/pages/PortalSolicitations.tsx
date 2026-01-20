import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { getSolicitacoes } from "@/services/solicitacoes";
import { useEffect } from "react";

interface Solicitation {
  id: number;
  number: string;
  title: string;
  description: string;
  date: string;
  status: "in-progress";
}

const PortalSolicitations = () => {
  const [selectedSolicitation, setSelectedSolicitation] = useState<Solicitation | null>(null);
  const [mySolicitations, setMySolicitations] = useState<Solicitation[]>([]);

  useEffect(() => {
    getSolicitacoes()
      .then((data: any[]) => {
        const mapped = data.map((item) => ({
          id: item.id,
          number: `SOL-${new Date(item.data).getFullYear()}-${String(item.id).padStart(3, "0")}`,
          title: item.assunto,
          description: item.body,
          date: new Date(item.data).toLocaleDateString("pt-BR"),
          status: "in-progress" as const,
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
          {mySolicitations.map((solicitation) => (
            <Card key={solicitation.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-mono text-sm text-muted-foreground">
                        {solicitation.number}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{solicitation.title}</CardTitle>
                  </div>
                  <Badge className="bg-status-inProgress text-white">
                    Em Andamento
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{solicitation.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Enviado em: {solicitation.date}</span>
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
                          {selectedSolicitation?.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Número da Solicitação</p>
                          <p className="font-mono">{selectedSolicitation?.number}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Status</p>
                          <Badge className="bg-status-inProgress text-white">Em Andamento</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Descrição</p>
                          <p className="text-sm">{selectedSolicitation?.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Data de Envio</p>
                          <p className="text-sm">{selectedSolicitation?.date}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}

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
            Quando sua solicitação estiver "Em Andamento", significa que nossa equipe já recebeu e está trabalhando
            para resolver sua demanda. Você será notificado quando houver atualizações importantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalSolicitations;
