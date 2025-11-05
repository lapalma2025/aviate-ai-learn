import { Home, BookOpen, FileQuestion, BarChart3, LogOut, Upload, Plane, StickyNote, CloudRain } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import planeIcon from "@/assets/plane-icon.png";

const mainItems = [
  { title: "Strona główna", url: "/dashboard", icon: Home },
  { title: "Tryb nauki", url: "/learn", icon: BookOpen },
  { title: "Egzamin próbny", url: "/exam", icon: FileQuestion },
  { title: "METAR Quiz", url: "/metar-quiz", icon: CloudRain },
  { title: "Statystyki", url: "/stats", icon: BarChart3 },
  { title: "Części samolotu", url: "/aircraft-parts", icon: Plane },
  { title: "Notatki", url: "/notes", icon: StickyNote },
];

const adminItems = [
  { title: "Panel admina", url: "/admin", icon: Upload },
];

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCollapsed = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Wylogowano pomyślnie",
      description: "Do zobaczenia!",
    });
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon">
      <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
        <img src={planeIcon} alt="Logo" className="h-8 w-8" />
        {!isCollapsed && <span className="font-bold text-sidebar-foreground">PPLA Academy</span>}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administracja</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span>Wyloguj</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
