import { Home, FileText, ClipboardList, MapPin, Users, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { logoutUser } from "@/services/usuarios";

const operatorItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Documentos", url: "/documents", icon: FileText },
  { title: "Demandas", url: "/demands", icon: ClipboardList },
  { title: "Cemitério", url: "/cemetery", icon: MapPin },
];

const adminItems = [
  ...operatorItems,
  { title: "Usuários", url: "/users", icon: Users },
];

export function AppSidebar() {
  const { data: user } = useUser();
  const userRole = user?.perfil || 'CIDADAO';

  // Show admin items for ADMIN, operator items for OPERADOR
  // Adjust logic as needed. If AGENTE needs specific items, add here.
  const items = userRole === 'ADMIN' ? adminItems : operatorItems;

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Force refresh or redirect
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <h2 className="text-lg font-bold text-sidebar-foreground">SIGESI</h2>
        <p className="text-xs text-sidebar-foreground/70">Sistema Operacional</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
