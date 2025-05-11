import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, LogOut, Calendar, Hotel, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleLogout } from "./utils";

interface DashboardNavProps {
  setActiveTab: (tab: string) => void;
}

export default function DashboardNav({ setActiveTab }: DashboardNavProps) {
  const router = useRouter();

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Hotel Del Ángel" width={150} height={60} />
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Inicio
          </Link>
          <Link href="/hotels" className="text-sm font-medium hover:underline underline-offset-4">
            Sucursales
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Mi Cuenta
          </Link>
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Menú de usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveTab("profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("reservations")}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Reservaciones</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("favorites")}>
              <Hotel className="mr-2 h-4 w-4" />
              <span>Sucursales Favoritas</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("billing")}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Facturación</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout(router)}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}