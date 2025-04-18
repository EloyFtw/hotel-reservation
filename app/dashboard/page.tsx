"use client"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, CreditCard, FileText, Hotel, LogOut, MapPin, Settings, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for user reservations
const reservations = [
  {
    id: "123",
    status: "confirmed",
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    hotel: {
      name: "203 - Habitacion Sencilla, Hotel Del Ángel Centro",
      location: "La Paz, México",
      image: "/images/logo.png?height=300&width=500",
    },
    room: {
      name: "Habitación Sencilla Estándar",
      price: 850,
    },
    totalAmount: 6438, // 3 nights with taxes
  },
  {
    id: "RES-789012",
    status: "upcoming",
    checkIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    checkOut: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
    hotel: {
      name: "210 - Habitacion Doble, Hotel Del Ángel Abasolo",
      location: "La Paz, México",
      image: "/images/logo.png?height=300&width=500",
    },
    room: {
      name: "Doble Estándar",
      price: 1200,
    },
    totalAmount: 14210, // 5 nights with taxes
  },
  {
    id: "RES-345678",
    status: "completed",
    checkIn: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    checkOut: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    hotel: {
      name: "215 - Habitacion Triple, Hotel Del Ángel Cabo",
      location: "La Paz, México",
      image: "/images/logo.png?height=300&width=500",
    },
    room: {
      name: "Habitación Triple Estándar",
      price: 1400,
    },
    totalAmount: 4176, // 3 nights with taxes
  },
]

// Mock data for favorite hotels
const favoriteHotels = [
  {
    id: 1,
    name: "Hotel Del Ángel Centro",
    location: "La Paz, Baja California Sur, México",
    image: "/images/logo.png?height=300&width=500",
    price: 850,
    rating: 4.8,
  },
  {
    id: 4,
    name: "Del Angel Cabo",
    location: "Los Cabos, Baja California Sur, México",
    image: "/images/logo.png?height=300&width=500",
    price: 1200,
    rating: 4.9,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("reservations")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmada</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Próxima</Badge>
      case "completed":
        return <Badge variant="outline">Completada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleLogout = () => {
    // In a real app, this would handle the logout process
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
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
            <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline underline-offset-4">
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
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Reservaciones</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Pagos</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="container py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0">
            <Card>
              <CardHeader>
                <CardTitle>Juan Pérez</CardTitle>
                <CardDescription>juan@ejemplo.com</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      activeTab === "reservations" ? "bg-muted font-medium" : ""
                    }`}
                    onClick={() => setActiveTab("reservations")}
                  >
                    <Calendar className="h-4 w-4" />
                    Mis Reservaciones
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      activeTab === "favorites" ? "bg-muted font-medium" : ""
                    }`}
                    onClick={() => setActiveTab("favorites")}
                  >
                    <Hotel className="h-4 w-4" />
                    Sucursales Favoritas
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      activeTab === "profile" ? "bg-muted font-medium" : ""
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      activeTab === "billing" ? "bg-muted font-medium" : ""
                    }`}
                    onClick={() => setActiveTab("billing")}
                  >
                    <FileText className="h-4 w-4" />
                    Facturación
                  </button>
                </nav>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "reservations" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Mis Reservaciones</h1>

                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                    <TabsTrigger value="completed">Completadas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {reservations.map((reservation) => (
                      <Card key={reservation.id}>
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-48 h-40 md:h-auto">
                            <Image
                              src={reservation.hotel.image || "/placeholder.svg"}
                              alt={reservation.hotel.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-xl font-bold">{reservation.hotel.name}</h3>
                                  {getStatusBadge(reservation.status)}
                                </div>
                                <div className="flex items-center text-muted-foreground text-sm mt-1">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  {reservation.hotel.location}
                                </div>
                                <div className="mt-4 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {reservation.checkIn.toLocaleDateString()} -{" "}
                                      {reservation.checkOut.toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{reservation.room.name}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Total pagado</p>
                                <p className="text-xl font-bold">${reservation.totalAmount} MXN</p>
                                <div className="flex gap-2 mt-4 justify-end">
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-1" />
                                    Factura
                                  </Button>
                                  <Link href={`/reservation/${reservation.id}`}>
                                    <Button size="sm">Ver Detalles</Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="upcoming" className="space-y-4">
                    {reservations
                      .filter((res) => res.status === "confirmed" || res.status === "upcoming")
                      .map((reservation) => (
                        <Card key={reservation.id}>
                          <div className="flex flex-col md:flex-row">
                            <div className="relative w-full md:w-48 h-40 md:h-auto">
                              <Image
                                src={reservation.hotel.image || "/placeholder.svg"}
                                alt={reservation.hotel.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold">{reservation.hotel.name}</h3>
                                    {getStatusBadge(reservation.status)}
                                  </div>
                                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                                    <MapPin className="h-3.5 w-3.5 mr-1" />
                                    {reservation.hotel.location}
                                  </div>
                                  <div className="mt-4 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span>
                                        {reservation.checkIn.toLocaleDateString()} -{" "}
                                        {reservation.checkOut.toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-muted-foreground" />
                                      <span>{reservation.room.name}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Total pagado</p>
                                  <p className="text-xl font-bold">${reservation.totalAmount} MXN</p>
                                  <div className="flex gap-2 mt-4 justify-end">
                                    <Button variant="outline" size="sm">
                                      Modificar
                                    </Button>
                                    <Link href={`/reservation/${reservation.id}`}>
                                      <Button size="sm">Ver Detalles</Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    {reservations
                      .filter((res) => res.status === "completed")
                      .map((reservation) => (
                        <Card key={reservation.id}>
                          <div className="flex flex-col md:flex-row">
                            <div className="relative w-full md:w-48 h-40 md:h-auto">
                              <Image
                                src={reservation.hotel.image || "/placeholder.svg"}
                                alt={reservation.hotel.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold">{reservation.hotel.name}</h3>
                                    {getStatusBadge(reservation.status)}
                                  </div>
                                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                                    <MapPin className="h-3.5 w-3.5 mr-1" />
                                    {reservation.hotel.location}
                                  </div>
                                  <div className="mt-4 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span>
                                        {reservation.checkIn.toLocaleDateString()} -{" "}
                                        {reservation.checkOut.toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-muted-foreground" />
                                      <span>{reservation.room.name}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Total pagado</p>
                                  <p className="text-xl font-bold">${reservation.totalAmount} MXN</p>
                                  <div className="flex gap-2 mt-4 justify-end">
                                    <Button variant="outline" size="sm">
                                      <FileText className="h-4 w-4 mr-1" />
                                      Factura
                                    </Button>
                                    <Link href={`/reservation/${reservation.id}`}>
                                      <Button size="sm">Ver Detalles</Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Sucursales Favoritas</h1>

                <div className="grid md:grid-cols-2 gap-6">
                  {favoriteHotels.map((hotel) => (
                    <Card key={hotel.id} className="overflow-hidden">
                      <div className="relative">
                        <Image
                          src={hotel.image || "/placeholder.svg"}
                          alt={hotel.name}
                          width={500}
                          height={300}
                          className="object-cover w-full h-48"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">{hotel.name}</h3>
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {hotel.location}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Desde</p>
                          <p className="text-lg font-bold">
                            ${hotel.price} <span className="text-sm font-normal">MXN/noche</span>
                          </p>
                        </div>
                        <Link href={`/hotels/${hotel.id}`}>
                          <Button size="sm">Ver Detalles</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Actualiza tu información personal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input id="firstName" defaultValue="Juan" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input id="lastName" defaultValue="Pérez" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input id="email" type="email" defaultValue="juan@ejemplo.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" defaultValue="+52 123 456 7890" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input id="address" defaultValue="Calle Principal #123" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Guardar Cambios</Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "billing" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Facturación</h1>
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Facturas</CardTitle>
                    <CardDescription>Consulta y descarga tus facturas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-4 p-3 bg-muted font-medium">
                          <div>Reserva</div>
                          <div>Fecha</div>
                          <div>Monto</div>
                          <div className="text-right">Acciones</div>
                        </div>
                        <div className="divide-y">
                          {reservations.map((reservation) => (
                            <div key={reservation.id} className="grid grid-cols-4 p-3 items-center">
                              <div>{reservation.id}</div>
                              <div>{reservation.checkIn.toLocaleDateString()}</div>
                              <div>${reservation.totalAmount} MXN</div>
                              <div className="text-right">
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Descargar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
