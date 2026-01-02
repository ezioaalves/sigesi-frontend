import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type DemandStatus = "pending" | "in-progress" | "completed";

interface Comment {
  id: number;
  author: string;
  title: string;
  text: string;
  date: string;
}

interface Demand {
  id: number;
  number: string;
  title: string;
  description: string;
  status: DemandStatus;
  comments: Comment[];
}

const Agent = () => {
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newCommentTitle, setNewCommentTitle] = useState("");
  const [newStatus, setNewStatus] = useState<DemandStatus | "">("");

  // Mock data - in a real app, this would be filtered by the logged-in agent
  const myDemands: Demand[] = [
    {
      id: 1,
      number: "DEM-2025-001",
      title: "Reparo de calçada - Rua Principal",
      description: "Solicitação de reparo de calçada na Rua Principal, nº 123. A calçada apresenta buracos e irregularidades que dificultam a passagem de pedestres.",
      status: "in-progress",
      comments: [
        { id: 1, author: "Operador", title: "Registro Inicial", text: "Demanda registrada e atribuída ao agente.", date: "10/01/2025 09:00" },
        { id: 2, author: "Maria Santos", title: "Vistoria Realizada", text: "Realizei vistoria no local. Materiais necessários solicitados.", date: "11/01/2025 14:30" },
      ],
    },
    {
      id: 2,
      number: "DEM-2025-003",
      title: "Coleta de lixo - Bairro Norte",
      description: "Moradores relatam que a coleta de lixo não está sendo realizada há 3 dias no Bairro Norte.",
      status: "pending",
      comments: [
        { id: 3, author: "Operador", title: "Criação da Demanda", text: "Demanda criada a partir de solicitação do cidadão.", date: "08/01/2025 10:00" },
      ],
    },
  ];

  const getStatusBadge = (status: DemandStatus) => {
    const variants: Record<DemandStatus, { label: string; className: string }> = {
      pending: { label: "Pendente", className: "bg-status-pending text-white" },
      "in-progress": { label: "Em Andamento", className: "bg-status-inProgress text-white" },
      completed: { label: "Concluída", className: "bg-status-completed text-white" },
    };
    return variants[status];
  };

  const handleAddComment = () => {
    if (newComment.trim() && newCommentTitle.trim()) {
      // In a real app, this would send the comment to the backend
      console.log("Adding comment:", { title: newCommentTitle, text: newComment });
      setNewComment("");
      setNewCommentTitle("");
    }
  };

  const handleStatusChange = () => {
    if (newStatus) {
      // In a real app, this would update the status in the backend
      console.log("Changing status to:", newStatus);
      setNewStatus("");
    }
  };

  if (selectedDemand) {
    const badge = getStatusBadge(selectedDemand.status);

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
          <div className="container mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDemand(null)}
              className="text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold">{selectedDemand.number}</h1>
              <p className="text-sm opacity-90">{selectedDemand.title}</p>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4 space-y-4 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Descrição</CardTitle>
                <Badge className={badge.className}>{badge.label}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{selectedDemand.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Comentários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDemand.comments.map((comment) => (
                <div key={comment.id} className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{comment.author}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {comment.date}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{comment.title}</h4>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atualizar Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as DemandStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione novo status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in-progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleStatusChange} disabled={!newStatus} className="w-full">
                Atualizar Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Comentário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Título</label>
                <input
                  type="text"
                  placeholder="Título do comentário..."
                  value={newCommentTitle}
                  onChange={(e) => setNewCommentTitle(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Comentário</label>
                <Textarea
                  placeholder="Digite seu comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleAddComment} disabled={!newComment.trim() || !newCommentTitle.trim()} className="w-full gap-2">
                <Send className="w-4 h-4" />
                Enviar Comentário
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Minhas Demandas</h1>
          <p className="text-sm opacity-90">Interface do Agente</p>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-3 max-w-2xl">
        {myDemands.map((demand) => {
          const badge = getStatusBadge(demand.status);
          return (
            <Card
              key={demand.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedDemand(demand)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-primary">{demand.number}</div>
                    <h3 className="font-medium mt-1">{demand.title}</h3>
                  </div>
                  <Badge className={badge.className}>{badge.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{demand.description}</p>
              </CardContent>
            </Card>
          );
        })}

        {myDemands.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma demanda atribuída</p>
            </CardContent>
          </Card>
        )}

        <div className="pt-4">
          <Link to="/">
            <Button variant="outline" className="w-full">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Agent;
