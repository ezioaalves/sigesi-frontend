import { useUser } from "@/hooks/use-user";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    allowedRoles?: string[];
    redirectPath?: string;
    children?: React.ReactNode;
}

const ProtectedRoute = ({
    allowedRoles,
    redirectPath = "/",
    children,
}: ProtectedRouteProps) => {
    const { data: user, isLoading, isError } = useUser();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground animate-pulse">Verificando credenciais...</p>
                </div>
            </div>
        );
    }

    // Not logged in or error fetching user -> Redirect to Login
    if (!user || isError) {
        // Optional: Pass the intended location to redirect back after login
        // For now, simple redirect
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // Role Base Access Control (RBAC)
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.perfil)) {
        // User is logged in but doesn't have permission
        // Redirect to Portal (safe default) or a 403 page
        return <Navigate to="/portal" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
