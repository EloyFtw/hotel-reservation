'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Hotel, User, FileText, LogOut } from "lucide-react";
import { Usuario } from "./types";
import { handleLogout } from "./utils";
import { useRouter } from "next/navigation";

interface DashboardSidebarProps {
  user: Usuario | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardSidebar({ user, activeTab, setActiveTab }: DashboardSidebarProps) {
  const router = useRouter();

  const navItems = [
    { label: "Mis Reservaciones", tab: "reservations", icon: Calendar },
    { label: "Sucursales Favoritas", tab: "favorites", icon: Hotel },
    { label: "Perfil", tab: "profile", icon: User },
    { label: "Facturación", tab: "billing", icon: FileText },
  ];

  return (
    <div className="md:w-64 shrink-0">
      <Card>
        <CardHeader>
          <CardTitle>
            {user?.huesped?.persona
              ? `${user.huesped.persona.Nombre} ${user.huesped.persona.Apellido_Paterno}`
              : "Usuario"}
          </CardTitle>
          <CardDescription>{user?.Mail || "No registrado"}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <button
                key={item.tab}
                className={`flex items-center gap-2 px-4 py-2 text-sm ${
                  activeTab === item.tab ? "bg-muted font-medium" : ""
                }`}
                onClick={() => setActiveTab(item.tab)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </CardContent>
       <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => handleLogout(router)}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}