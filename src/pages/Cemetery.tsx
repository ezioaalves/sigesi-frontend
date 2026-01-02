import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Gaveta {
  id: number;
  number: string;
  occupied: boolean;
  occupant?: string;
}

interface Jazigo {
  id: number;
  number: string;
  largura: number;
  comprimento: number;
  quadra: string;
  rua: string;
  lote: string;
  gavetas: Gaveta[];
}

const Cemetery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJazigo, setSelectedJazigo] = useState<Jazigo | null>(null);

  // Mock data
  const jazigos: Jazigo[] = [
    {
      id: 1,
      number: "JAZ-001",
      largura: 2.5,
      comprimento: 2.0,
      quadra: "A",
      rua: "1",
      lote: "10",
      gavetas: [
        { id: 1, number: "G1", occupied: true, occupant: "João Silva" },
        { id: 2, number: "G2", occupied: true, occupant: "Maria Silva" },
        { id: 3, number: "G3", occupied: false },
      ],
    },
    {
      id: 2,
      number: "JAZ-002",
      largura: 2.5,
      comprimento: 2.0,
      quadra: "A",
      rua: "1",
      lote: "11",
      gavetas: [
        { id: 4, number: "G1", occupied: true, occupant: "Pedro Costa" },
        { id: 5, number: "G2", occupied: false },
        { id: 6, number: "G3", occupied: false },
      ],
    },
  ];

  const filteredJazigos = jazigos.filter((jazigo) =>
    jazigo.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jazigo.quadra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jazigo.rua.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b bg-background flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-foreground ml-4">Gerenciamento de Cemitério</h1>
          </header>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Jazigos List */}
              <Card>
                <CardHeader>
                  <CardTitle>Jazigos</CardTitle>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar jazigo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredJazigos.map((jazigo) => (
                      <button
                        key={jazigo.id}
                        onClick={() => setSelectedJazigo(jazigo)}
                        className={`w-full p-4 rounded-lg border text-left transition-colors ${
                          selectedJazigo?.id === jazigo.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {jazigo.number}
                            </div>
                            <div className="text-sm opacity-90 mt-1">
                              Quadra {jazigo.quadra} - Rua {jazigo.rua} - Lote {jazigo.lote}
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {jazigo.gavetas.filter(g => g.occupied).length}/{jazigo.gavetas.length} ocupadas
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Jazigo Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Jazigo</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedJazigo ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Número</label>
                          <p className="text-lg font-semibold">{selectedJazigo.number}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Dimensões</label>
                          <p className="text-lg font-semibold">{selectedJazigo.largura}m × {selectedJazigo.comprimento}m</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Quadra</label>
                          <p className="text-lg font-semibold">{selectedJazigo.quadra}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Rua</label>
                          <p className="text-lg font-semibold">{selectedJazigo.rua}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Lote</label>
                          <p className="text-lg font-semibold">{selectedJazigo.lote}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Gavetas</h3>
                        <div className="space-y-2">
                          {selectedJazigo.gavetas.map((gaveta) => (
                            <div
                              key={gaveta.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted"
                            >
                              <div>
                                <div className="font-medium">{gaveta.number}</div>
                                {gaveta.occupied && gaveta.occupant && (
                                  <div className="text-sm text-muted-foreground">{gaveta.occupant}</div>
                                )}
                              </div>
                              <Badge variant={gaveta.occupied ? "default" : "secondary"}>
                                {gaveta.occupied ? "Ocupada" : "Livre"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      Selecione um jazigo para ver os detalhes
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Cemetery;
