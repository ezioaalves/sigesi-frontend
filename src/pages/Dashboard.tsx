import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, Users as UsersIcon, FileText } from "lucide-react";

const Dashboard = () => {
  // Mock data - in a real app, this would come from an API
  const stats = {
    newSolicitations: 12,
    stagnantDemands: [
      { id: 1, title: "Reparo de calçada - Rua Principal", days: 5 },
      { id: 2, title: "Iluminação pública - Av. Central", days: 4 },
      { id: 3, title: "Coleta de lixo - Bairro Norte", days: 7 },
    ],
    agentWorkload: [
      { name: "João Silva", openDemands: 8 },
      { name: "Maria Santos", openDemands: 12 },
      { name: "Pedro Costa", openDemands: 6 },
      { name: "Ana Oliveira", openDemands: 15 },
    ],
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b bg-background flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-foreground ml-4">Dashboard</h1>
          </header>

          <div className="p-6 space-y-6">
            {/* New Solicitations Card */}
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Novas Solicitações (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold">{stats.newSolicitations}</div>
                <p className="text-sm opacity-90 mt-2">Solicitações recebidas nas últimas 24 horas</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Stagnant Demands */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning">
                    <AlertCircle className="w-5 h-5" />
                    Demandas Estagnadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.stagnantDemands.map((demand) => (
                      <div
                        key={demand.id}
                        className="flex items-start justify-between p-3 rounded-lg bg-muted"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{demand.title}</p>
                        </div>
                        <div className="flex items-center gap-1 text-warning">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-semibold">{demand.days}d</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Demandas sem atualização há mais de 3 dias
                  </p>
                </CardContent>
              </Card>

              {/* Agent Workload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5" />
                    Carga de Trabalho - Agentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.agentWorkload.map((agent, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted"
                      >
                        <span className="font-medium text-sm">{agent.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-secondary rounded-full w-24">
                            <div
                              className="h-2 bg-accent rounded-full transition-all"
                              style={{ width: `${Math.min((agent.openDemands / 20) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold min-w-[3ch] text-right">
                            {agent.openDemands}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Número de demandas abertas por agente
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
