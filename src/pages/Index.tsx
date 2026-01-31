import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useUser } from "@/hooks/use-user";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/portal");
    }
  }, [user, isLoading, navigate]);

  const handleLogin = () => {
    window.location.href = '/oauth2/authorization/google';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-primary mb-4">SIGESI</h1>
          <p className="text-xl text-muted-foreground">
            Sistema de Gerenciamento da SEINFRA
          </p>
        </div>

        <div className="max-w-md mx-auto animate-fade-in">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building2 className="w-12 h-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
              <CardDescription className="text-center">
                Faça login com sua conta institucional ou pessoal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2" size="lg" onClick={handleLogin}>
                <Users className="w-5 h-5" />
                Entrar com Google
              </Button>
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
