import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const handleLogin = () => {
    // Redireciona via proxy para evitar problemas de CORS e garantir compartilhamento de cookies
    window.location.href = '/oauth2/authorization/google';
  };

  const getTitle = () => {
    if (role === "agent") return "Interface do Agente";
    return "Sistema Operacional";
  };

  const getDescription = () => {
    if (role === "agent") return "Acesso para agentes de campo";
    return "Acesso para operadores e administradores";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full animate-fade-in">
        <CardHeader className="text-center">
          <Building2 className="w-12 h-12 mx-auto text-primary mb-4" />
          <CardTitle className="text-2xl">SIGESI</CardTitle>
          <CardDescription className="text-base">
            {getTitle()}
          </CardDescription>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Use sua conta do Google para acessar o painel.
            </p>
            <Button onClick={handleLogin} className="w-full" size="lg">
              Entrar com Google
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/")}
              className="text-sm"
            >
              Voltar ao início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
