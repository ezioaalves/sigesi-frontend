import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { useEffect } from "react";

const Auth = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/portal");
    }
  }, [user, isLoading, navigate]);

  const handleLogin = () => {
    // Redireciona via proxy para evitar problemas de CORS e garantir compartilhamento de cookies
    window.location.href = '/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full animate-fade-in">
        <CardHeader className="text-center">
          <Building2 className="w-12 h-12 mx-auto text-primary mb-4" />
          <CardTitle className="text-2xl">SIGESI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Use sua conta do Google para acessar o painel.
            </p>
            <Button onClick={handleLogin} className="w-full" size="lg">
              Entrar com Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
