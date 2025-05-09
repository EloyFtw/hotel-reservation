"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, CreditCard, FileText, Hotel, LogOut, MapPin, Settings, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Configuración de la URL del backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Interfaces basadas en las estructuras de Hospedaje, Reservacion, y Persona
interface Huesped {
  Id_Huesped: number
  nombre?: string
  email?: string
}

interface Hotel {
  Id_Hotel: number
  Nombre: string
  Direccion: string
  URL_Imagen_Hotel?: string | null
}

interface Habitacion {
  ID_Habitacion: number
  Numero: string
  FK_Hotel: number
}

interface Hospedaje {
  ID_Hospedaje: number
  FK_Huesped: number
  FK_Habitacion: number
  CostoNoche: string
  CostoTotal: string
  Check_in: string
  Check_out: string | null
  FK_Reservacion: number | null
  Habitacion: Habitacion
  Huesped: Huesped
  Estatus: { Id_Estatus: number; Estatus: string }
}

interface Reservacion {
  ID_Reservacion: number
  FK_Huesped: number
  FK_Hotel: number
  HoraDeLlegada: string
  Fecha: string
  FK_Estatus: number
  Monto_Usado: string
  Hotel: Hotel
  Huesped: Huesped
  Estatus: { Id_Estatus: number; Estatus: string }
}

interface Persona {
  Id_Persona: number
  Nombre: string
  SegundoNombre?: string
  Apellido_Paterno: string
  Apellido_Materno?: string
  Fecha_Nacimiento: string
  Celular?: string
  Correo?: string
  Direccion?: string
  FK_Ciudad: number
}

interface User {
  Id_Usuario: number
  Nombre_Usuario: string
  Mail?: string
  huesped?: {
    Id_Huesped: number
    FK_Persona: number
    persona: Persona
  }
}

interface Reservation {
  id: string
  status: string
  checkIn: Date
  checkOut: Date
  hotel: {
    name: string
    location: string
    image?: string
  }
  room: {
    name: string
    price: number
  }
  totalAmount: number
}

interface FavoriteHotel {
  id: number
  name: string
  location: string
  image?: string
  price: number
  rating: number
}

interface Ciudad {
  Id_Ciudad: number
  Nombre: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("reservations")
  const [huespedId, setHuespedId] = useState<string>("3") // Valor inicial para pruebas
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [favoriteHotels, setFavoriteHotels] = useState<FavoriteHotel[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [formData, setFormData] = useState({
    Nombre: "",
    SegundoNombre: "",
    Apellido_Paterno: "",
    Apellido_Materno: "",
    Fecha_Nacimiento: "",
    Celular: "",
    Correo: "",
    Direccion: "",
    FK_Ciudad: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof formData, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Obtener token JWT de localStorage
  const getToken = () => localStorage.getItem("token")

  // Validaciones del formulario
  const validateForm = () => {
    const errors: Partial<Record<keyof typeof formData, string>> = {}
    if (!formData.Nombre.trim()) {
      errors.Nombre = "El nombre es obligatorio"
    } else if (!/^[A-Za-z\s]+$/.test(formData.Nombre)) {
      errors.Nombre = "El nombre solo puede contener letras"
    }
    if (!formData.Apellido_Paterno.trim()) {
      errors.Apellido_Paterno = "El apellido paterno es obligatorio"
    } else if (!/^[A-Za-z\s]+$/.test(formData.Apellido_Paterno)) {
      errors.Apellido_Paterno = "El apellido paterno solo puede contener letras"
    }
    if (!formData.Fecha_Nacimiento) {
      errors.Fecha_Nacimiento = "La fecha de nacimiento es obligatoria"
    } else {
      const birthDate = new Date(formData.Fecha_Nacimiento)
      const age = new Date().getFullYear() - birthDate.getFullYear()
      if (age < 18) {
        errors.Fecha_Nacimiento = "Debes ser mayor de 18 años"
      }
    }
    if (!formData.FK_Ciudad) {
      errors.FK_Ciudad = "La ciudad es obligatoria"
    }
    if (formData.Celular && !/^\d{10}$/.test(formData.Celular)) {
      errors.Celular = "El celular debe tener 10 dígitos"
    }
    if (formData.Correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Correo)) {
      errors.Correo = "El correo no es válido"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Cargar datos del usuario
  const fetchUser = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }
      const response = await fetch(`${API_BASE_URL}/api/usuarios/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`)
      }
      const userData: User = await response.json()
      setUser(userData)
      if (userData.huesped?.persona) {
        setFormData({
          Nombre: userData.huesped.persona.Nombre || "",
          SegundoNombre: userData.huesped.persona.SegundoNombre || "",
          Apellido_Paterno: userData.huesped.persona.Apellido_Paterno || "",
          Apellido_Materno: userData.huesped.persona.Apellido_Materno || "",
          Fecha_Nacimiento: userData.huesped.persona.Fecha_Nacimiento || "",
          Celular: userData.huesped.persona.Celular || "",
          Correo: userData.huesped.persona.Correo || "",
          Direccion: userData.huesped.persona.Direccion || "",
          FK_Ciudad: userData.huesped.persona.FK_Ciudad?.toString() || "",
        })
      }
    } catch (err: any) {
      console.error("Error al cargar usuario:", err)
      setError(err.message || "Error al cargar los datos del usuario")
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar ciudades
  const fetchCiudades = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ciudades`)
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`)
      }
      const ciudadesData: Ciudad[] = await response.json()
      setCiudades(ciudadesData)
    } catch (err: any) {
      console.error("Error al cargar ciudades:", err)
      setError(err.message || "Error al cargar las ciudades")
    }
  }

  // Guardar cambios del perfil
  const handleSaveProfile = async () => {
    if (!validateForm()) return
    setIsLoading(true)
    setError(null)
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }
      const response = await fetch(`${API_BASE_URL}/api/usuarios/me`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`)
      }
      const updatedUser: User = await response.json()
      setUser(updatedUser)
      // Actualizar huespedId si el usuario ahora tiene un Huesped
      if (updatedUser.huesped?.Id_Huesped) {
        setHuespedId(updatedUser.huesped.Id_Huesped.toString())
      }
    } catch (err: any) {
      console.error("Error al guardar perfil:", err)
      setError(err.message || "Error al guardar los cambios")
    } finally {
      setIsLoading(false)
    }
  }

  // Mapear estatus de la API a los del Dashboard
  const mapStatus = (estatus: string, checkIn: Date, checkOut?: Date): string => {
    const now = new Date()
    if (estatus.toLowerCase().includes("in-activo")) {
      return "completed"
    }
    if (estatus.toLowerCase().includes("activo")) {
      if (checkIn > now) {
        return "upcoming"
      }
      if (checkOut && checkOut < now) {
        return "completed"
      }
      return "confirmed"
    }
    return "completed"
  }

  // Cargar reservas
  const fetchReservations = async (huespedId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      // Obtener reservas
      const resResponse = await fetch(`${API_BASE_URL}/api/reservaciones/huesped/${huespedId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!resResponse.ok) {
        throw new Error(`Error ${resResponse.status}: ${await resResponse.text()}`)
      }
      const reservaciones: Reservacion[] = await resResponse.json()

      // Obtener hospedajes para complementar
      const hosResponse = await fetch(`${API_BASE_URL}/api/hospedajes/huesped/${huespedId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!hosResponse.ok) {
        throw new Error(`Error ${hosResponse.status}: ${await hosResponse.text()}`)
      }
      const hospedajes: Hospedaje[] = await hosResponse.json()

      // Mapear reservas al formato del Dashboard
      const mappedReservations: Reservation[] = reservaciones.map((res) => {
        const checkIn = new Date(res.HoraDeLlegada)
        // Estimar checkOut (1 noche por defecto si no hay hospedaje)
        const checkOut = new Date(checkIn)
        checkOut.setDate(checkIn.getDate() + 1)

        // Buscar hospedaje correspondiente
        const hospedaje = hospedajes.find((h) => h.FK_Reservacion === res.ID_Reservacion)
        const isHospedado = hospedaje && res.Estatus.Estatus.toLowerCase().includes("activo")

        return {
          id: res.ID_Reservacion.toString(),
          status: isHospedado ? "confirmed" : mapStatus(res.Estatus.Estatus, checkIn, hospedaje?.Check_out ? new Date(hospedaje.Check_out) : undefined),
          checkIn,
          checkOut: hospedaje?.Check_out ? new Date(hospedaje.Check_out) : checkOut,
          hotel: {
            name: res.Hotel.Nombre,
            location: res.Hotel.Direccion,
            image: res.Hotel.URL_Imagen_Hotel || "/images/logo.png",
          },
          room: {
            name: hospedaje ? `Habitación ${hospedaje.Habitacion.Numero}` : "Habitación Estándar",
            price: hospedaje ? parseFloat(hospedaje.CostoNoche) : 0,
          },
          totalAmount: hospedaje ? parseFloat(hospedaje.CostoTotal) : parseFloat(res.Monto_Usado) || 0,
        }
      })

      setReservations(mappedReservations)
    } catch (err: any) {
      console.error("Error al cargar reservas:", err)
      setError(err.message || "Error al cargar las reservas")
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar hoteles favoritos
  const fetchFavoriteHotels = async (huespedId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      const response = await fetch(`${API_BASE_URL}/api/hospedajes/huesped/${huespedId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`)
      }
      const hospedajes: Hospedaje[] = await response.json()

      // Agrupar hoteles únicos por FK_Hotel
      const hotelMap = new Map<number, { id: number; name: string; location: string; price: number; count: number }>()
      for (const hospedaje of hospedajes) {
        const hotelId = hospedaje.Habitacion.FK_Hotel
        if (!hotelMap.has(hotelId)) {
          // Obtener datos del hotel
          const hotelResponse = await fetch(`${API_BASE_URL}/api/hoteles/${hotelId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          if (!hotelResponse.ok) continue
          const hotel: Hotel = await hotelResponse.json()

          hotelMap.set(hotelId, {
            id: hotelId,
            name: hotel.Nombre,
            location: hotel.Direccion,
            price: parseFloat(hospedaje.CostoNoche),
            count: 1,
          })
        } else {
          const existing = hotelMap.get(hotelId)!
          existing.price = (existing.price * existing.count + parseFloat(hospedaje.CostoNoche)) / (existing.count + 1)
          existing.count += 1
        }
      }

      const mappedHotels: FavoriteHotel[] = Array.from(hotelMap.values()).map((h) => ({
        id: h.id,
        name: h.name,
        location: h.location,
        image: "/images/logo.png",
        price: Math.round(h.price),
        rating: 4.8,
      }))

      setFavoriteHotels(mappedHotels)
    } catch (err: any) {
      console.error("Error al cargar hoteles favoritos:", err)
      setError(err.message || "Error al cargar los hoteles favoritos")
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    fetchUser()
    fetchCiudades()
  }, [])

  // Cargar reservas y hoteles favoritos al cambiar huespedId
  useEffect(() => {
    if (huespedId) {
      fetchReservations(huespedId)
      fetchFavoriteHotels(huespedId)
    }
  }, [huespedId])

  // Manejar logout
  const handleLogout = async () => {
    try {
      const token = getToken()
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      }
      localStorage.removeItem("token")
      router.push("/")
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
    }
  }

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
                <CardTitle>{user?.huesped?.persona ? `${user.huesped.persona.Nombre} ${user.huesped.persona.Apellido_Paterno}` : "Usuario"}</CardTitle>
                <CardDescription>{user?.Mail || "No registrado"}</CardDescription>
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
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Seleccionar Huésped</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="huespedId">ID del Huésped</Label>
                  <Input
                    id="huespedId"
                    type="number"
                    value={huespedId}
                    onChange={(e) => setHuespedId(e.target.value)}
                    placeholder="Ingresa el ID del huésped"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "reservations" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Mis Reservaciones</h1>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {isLoading ? (
                  <p>Cargando reservas...</p>
                ) : (
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
                                      <Button variant="outline" size="sm" disabled>
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
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Sucursales Favoritas</h1>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {isLoading ? (
                  <p>Cargando hoteles favoritos...</p>
                ) : (
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
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Actualiza tu información personal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="Nombre">Nombre *</Label>
                        <Input
                          id="Nombre"
                          value={formData.Nombre}
                          onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                          placeholder="Nombre"
                        />
                        {formErrors.Nombre && <p className="text-red-500 text-sm">{formErrors.Nombre}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="SegundoNombre">Segundo Nombre</Label>
                        <Input
                          id="SegundoNombre"
                          value={formData.SegundoNombre}
                          onChange={(e) => setFormData({ ...formData, SegundoNombre: e.target.value })}
                          placeholder="Segundo Nombre"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="Apellido_Paterno">Apellido Paterno *</Label>
                        <Input
                          id="Apellido_Paterno"
                          value={formData.Apellido_Paterno}
                          onChange={(e) => setFormData({ ...formData, Apellido_Paterno: e.target.value })}
                          placeholder="Apellido Paterno"
                        />
                        {formErrors.Apellido_Paterno && (
                          <p className="text-red-500 text-sm">{formErrors.Apellido_Paterno}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="Apellido_Materno">Apellido Materno</Label>
                        <Input
                          id="Apellido_Materno"
                          value={formData.Apellido_Materno}
                          onChange={(e) => setFormData({ ...formData, Apellido_Materno: e.target.value })}
                          placeholder="Apellido Materno"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="Fecha_Nacimiento">Fecha de Nacimiento *</Label>
                        <Input
                          id="Fecha_Nacimiento"
                          type="date"
                          value={formData.Fecha_Nacimiento}
                          onChange={(e) => setFormData({ ...formData, Fecha_Nacimiento: e.target.value })}
                        />
                        {formErrors.Fecha_Nacimiento && (
                          <p className="text-red-500 text-sm">{formErrors.Fecha_Nacimiento}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="FK_Ciudad">Ciudad *</Label>
                        <Select
                          value={formData.FK_Ciudad}
                          onValueChange={(value) => setFormData({ ...formData, FK_Ciudad: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una ciudad" />
                          </SelectTrigger>
                          <SelectContent>
                            {ciudades.map((ciudad) => (
                              <SelectItem key={ciudad.Id_Ciudad} value={ciudad.Id_Ciudad.toString()}>
                                {ciudad.Nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.FK_Ciudad && <p className="text-red-500 text-sm">{formErrors.FK_Ciudad}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="Celular">Celular</Label>
                        <Input
                          id="Celular"
                          value={formData.Celular}
                          onChange={(e) => setFormData({ ...formData, Celular: e.target.value })}
                          placeholder="Celular (10 dígitos)"
                        />
                        {formErrors.Celular && <p className="text-red-500 text-sm">{formErrors.Celular}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="Correo">Correo</Label>
                        <Input
                          id="Correo"
                          type="email"
                          value={formData.Correo}
                          onChange={(e) => setFormData({ ...formData, Correo: e.target.value })}
                          placeholder="Correo electrónico"
                        />
                        {formErrors.Correo && <p className="text-red-500 text-sm">{formErrors.Correo}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="Direccion">Dirección</Label>
                      <Input
                        id="Direccion"
                        value={formData.Direccion}
                        onChange={(e) => setFormData({ ...formData, Direccion: e.target.value })}
                        placeholder="Dirección"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
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
                    <Alert>
                      <AlertTitle>No disponible</AlertTitle>
                      <AlertDescription>La funcionalidad de facturación no está implementada aún.</AlertDescription>
                    </Alert>
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