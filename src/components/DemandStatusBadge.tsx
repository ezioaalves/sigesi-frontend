import { Badge } from "@/components/ui/badge";
import { DemandaStatus } from "@/types";

interface DemandStatusBadgeProps {
    status: DemandaStatus;
    className?: string; // Allow overriding/merging classes if needed
}

export const DemandStatusBadge = ({ status, className }: DemandStatusBadgeProps) => {
    const variants: Record<DemandaStatus, { label: string; className: string }> = {
        [DemandaStatus.PENDENTE]: { label: "Pendente", className: "bg-yellow-500 text-white" },
        [DemandaStatus.EM_ANDAMENTO]: { label: "Em Andamento", className: "bg-blue-500 text-white" },
        [DemandaStatus.CONCLUIDA]: { label: "Concluída", className: "bg-green-500 text-white" },
        [DemandaStatus.BLOQUEADA]: { label: "Bloqueada", className: "bg-red-500 text-white" },
    };

    const variant = variants[status] || { label: status, className: "bg-gray-500 text-white" };

    return (
        <Badge className={`${variant.className} ${className || ""}`}>
            {variant.label}
        </Badge>
    );
};
