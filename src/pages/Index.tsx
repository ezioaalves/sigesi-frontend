import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-primary mb-4">SIGESI</h1>
          <p className="text-xl text-muted-foreground">
            Sistema de Gerenciamento da SEINFRA
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow animate-fade-in">
            <CardHeader>
              <Building2 className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Sistema Operacional</CardTitle>
              <CardDescription>
                Interface para operadores e administradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth?role=operator">
                <Button className="w-full">Acessar Sistema</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow animate-fade-in [animation-delay:100ms]">
            <CardHeader>
              <Smartphone className="w-12 h-12 text-accent mb-4" />
              <CardTitle>Interface Agente</CardTitle>
              <CardDescription>
                Acesso simplificado para agentes em campo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth?role=agent">
                <Button variant="outline" className="w-full">Acessar Interface</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow animate-fade-in [animation-delay:200ms]">
            <CardHeader>
              <Users className="w-12 h-12 text-success mb-4" />
              <CardTitle>Portal do Cidadão</CardTitle>
              <CardDescription>
                Portal público para envio de solicitações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/portal">
                <Button variant="secondary" className="w-full">Acessar Portal</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>SEINFRA - Secretaria de Infraestrutura</p>
          <p className="mt-2">Sistema desenvolvido para gestão eficiente de documentos e demandas</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
