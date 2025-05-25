"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Home,
  Info,
  MapPin,
  MessageSquare,
  Phone,
  Printer,
  Share,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

const getToken = () => localStorage.getItem("token")

const mapStatus = (estatusId: number, estatus: string): string => {
  switch (estatusId) {
    case 3:
      return "confirmed"
    case 4:
      return "completed"
    case 7:
      return "cancelled"
    default:
      return estatus.toLowerCase()
  }
}

interface Room {
  number: string
  floor: number
  price: number
  nights: number
}

interface Reservation {
  id: string
  status: string
  createdAt: Date
  checkIn: Date
  checkOut: Date
  hotel: {
    name: string
    location: string
    image: string
  }
  rooms: Room[]
  guest: {
    name: string
    email: string
    phone: string
  }
  totalAmount: number
  paymentMethod: string
  cancellationReason?: string
  cancelledAt?: Date | null
  policies: string[]
  importantInfo: string[]
  stayDetails: {
    services: string[]
    incidents: any[]
    feedback: any | null
  }
}

export default function ReservationDetailPage() {
  const params = useParams()
  const reservationId = params.id as string
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState("")

  useEffect(() => {
    const fetchReservation = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = getToken()
        if (!token) {
          throw new Error("No se encontró el token de autenticación")
        }

        // Fetch reservación (para hotel y estatus)
        const reservationResponse = await fetch(`${API_BASE_URL}/api/reservaciones/${reservationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (!reservationResponse.ok) {
          throw new Error(`Error ${reservationResponse.status}: ${await reservationResponse.text()}`)
        }
        const reservationData = await reservationResponse.json()

        // Fetch datos del huésped desde /api/huespedes
        let guestData = null
        try {
          const huespedId = reservationData.Huesped.Id_Huesped
          const huespedResponse = await fetch(`${API_BASE_URL}/api/huespedes/${huespedId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          if (huespedResponse.ok) {
            guestData = await huespedResponse.json()
          }
        } catch (err) {
          console.warn("Error al obtener datos del huésped:", err)
        }

        // Fetch hospedaje (para fechas, habitación, costos)
        let hospedaje = null
        try {
          const hospedajeResponse = await fetch(`${API_BASE_URL}/api/hospedajes/reservaciones/${reservationId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          if (hospedajeResponse.ok) {
            const hospedajeData = await hospedajeResponse.json()
            hospedaje = Array.isArray(hospedajeData) && hospedajeData.length > 0 ? hospedajeData[0] : null
          }
        } catch (err) {
          console.warn("No se encontraron datos de hospedaje:", err)
        }

        // Calcular checkOut si no hay hospedaje
        const nights = hospedaje?.Cantidad_noches || 1
        const checkInDate = hospedaje ? new Date(hospedaje.Check_in) : new Date(reservationData.HoraDeLlegada)
        const checkOutDate = hospedaje
          ? new Date(hospedaje.Check_out)
          : new Date(new Date(reservationData.HoraDeLlegada).setDate(checkInDate.getDate() + nights))

        // Construir nombre completo del huésped
        const guestName = guestData?.persona
          ? [
              guestData.persona.Nombre,
              guestData.persona.SegundoNombre,
              guestData.persona.Apellido_Paterno,
              guestData.persona.Apellido_Materno,
            ]
              .filter(Boolean)
              .join(" ")
          : `Huésped ID ${reservationData.Huesped.Id_Huesped}`

        setReservation({
          id: reservationData.ID_Reservacion.toString(),
          status: mapStatus(reservationData.FK_Estatus, reservationData.Estatus.Estatus),
          createdAt: new Date(reservationData.FechaAlta),
          checkIn: checkInDate,
          checkOut: checkOutDate,
          hotel: {
            name: reservationData.Hotel.Nombre,
            location: reservationData.Hotel.Direccion,
            image: reservationData.Hotel.URL_Imagen_Hotel || "/images/logo.png",
          },
          rooms: hospedaje
            ? [{
                number: hospedaje.Habitacion.Numero,
                floor: hospedaje.Habitacion.Planta,
                price: parseFloat(hospedaje.CostoNoche),
                nights: hospedaje.Cantidad_noches,
              }]
            : [{
                number: "No asignada",
                floor: 0,
                price: 0,
                nights: 1,
              }],
          guest: {
            name: guestName,
            email: guestData?.persona?.Correo || reservationData.Hotel.correo || "correo@noespecificado.com",
            phone: guestData?.persona?.Celular || reservationData.Hotel.telefono || "No disponible",
          },
          totalAmount: hospedaje ? parseFloat(hospedaje.CostoTotal) : 0,
          paymentMethod: "No especificado",
          cancellationReason: reservationData.Motivo_Cancelacion || "No disponible",
          cancelledAt: reservationData.Motivo_Cancelacion ? new Date() : null,
          policies: [
            "Check-in a partir de las 15:00 hrs",
            "Check-out hasta las 12:00 hrs",
            "No se permiten mascotas",
          ],
          importantInfo: [
            "Habitaciones para no fumadores",
            "Estacionamiento disponible",
          ],
          stayDetails: {
            services: reservationData.Hotel.Tags || [],
            incidents: [],
            feedback: null,
          },
        })
      } catch (err: any) {
        console.error("Error al cargar reservación:", err)
        setError(err.message || "Error al cargar los detalles de la reserva")
        setReservation(null)
      } finally {
        setLoading(false)
      }
    }

    fetchReservation()
  }, [reservationId])

  const handlePrint = () => {
    window.print()
  }

  const handleAddComment = () => {
    if (!comment.trim()) return
    alert("Comentario añadido: " + comment)
    setComment("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando detalles de la reservación...</p>
        </div>
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a mis reservaciones
            </Link>
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Reservación no encontrada</h2>
                <p className="text-muted-foreground mb-6">
                  {error || "No pudimos encontrar los detalles de la reservación que estás buscando."}
                </p>
                <Link href="/dashboard">
                  <Button>Ver mis reservaciones</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a las reservaciones
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Reservación #{reservation.id}</h1>
              <div className="flex items-center gap-2 mt-1">
                {reservation.status === "confirmed" && <Badge className="bg-green-500 hover:bg-green-600">Confirmada</Badge>}
                {reservation.status === "completed" && <Badge variant="outline">Completada</Badge>}
                {reservation.status === "cancelled" && <Badge variant="destructive">Cancelada</Badge>}
                <span className="text-sm text-muted-foreground">
                  Creada el {reservation.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Factura
              </Button>
            </div>
          </div>

          {reservation.status === "cancelled" && <CancelledReservation reservation={reservation} />}

          {reservation.status === "completed" && (
            <CompletedReservation
              reservation={reservation}
              comment={comment}
              setComment={setComment}
              handleAddComment={handleAddComment}
            />
          )}

          {reservation.status === "confirmed" && <UpcomingReservation reservation={reservation} />}
        </div>
      </div>
    </div>
  )
}

function CancelledReservation({ reservation }: { reservation: Reservation }) {
  return (
    <div className="space-y-6">
      {reservation.cancellationReason !== "No disponible" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Reservación Cancelada</AlertTitle>
          <AlertDescription>
            Esta reservación fue cancelada{reservation.cancelledAt ? ` el ${reservation.cancelledAt.toLocaleDateString()}` : ""}.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Cancelación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Motivo de cancelación</p>
              <p className="font-medium">{reservation.cancellationReason}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto reembolsado</p>
              <p className="font-medium">No disponible</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Reservación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
              <Image
                src={reservation.hotel.image}
                alt={reservation.hotel.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{reservation.hotel.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {reservation.hotel.location}
              </div>
              <p className="mt-1">
                {reservation.rooms.map((room, index) => (
                  <span key={index}>Habitación {room.number}, Planta {room.floor}</span>
                ))}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Fecha de llegada</p>
              <p className="font-medium">{reservation.checkIn.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de salida</p>
              <p className="font-medium">{reservation.checkOut.toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Información del Huésped</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{reservation.guest.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Correo electrónico</p>
                <p className="font-medium">{reservation.guest.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{reservation.guest.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Detalles de la factura</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monto total</p>
                <p className="font-medium">${reservation.totalAmount.toFixed(2)} MXN</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método de pago</p>
                <p className="font-medium">{reservation.paymentMethod}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Contacta al equipo de soporte para más información sobre esta cancelación.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

function CompletedReservation({
  reservation,
  comment,
  setComment,
  handleAddComment,
}: {
  reservation: Reservation
  comment: string
  setComment: (value: string) => void
  handleAddComment: () => void
}) {
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Detalles de la Estancia</CardTitle>
          <CardDescription>
            Estancia completada del {reservation.checkIn.toLocaleDateString()} al{" "}
            {reservation.checkOut.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
              <Image
                src={reservation.hotel.image}
                alt={reservation.hotel.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{reservation.hotel.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {reservation.hotel.location}
              </div>
              <p className="mt-1">
                {reservation.rooms.map((room, index) => (
                  <span key={index}>Habitación {room.number}, Planta {room.floor} ({room.nights} noche{room.nights > 1 ? "s" : ""})</span>
                ))}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{reservation.checkIn.toLocaleDateString()}</span>
                <Clock className="h-4 w-4 ml-2 mr-1 text-muted-foreground" />
                <span>{reservation.checkIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{reservation.checkOut.toLocaleDateString()}</span>
                <Clock className="h-4 w-4 ml-2 mr-1 text-muted-foreground" />
                <span>{reservation.checkOut.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Huéspedes</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">Huésped principal: {reservation.guest.name}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Servicios Disponibles</h4>
            <div className="flex flex-wrap gap-2">
              {reservation.stayDetails?.services?.length > 0 ? (
                reservation.stayDetails.services.map((service: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {service}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No se especificaron servicios.</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Incidencias</h4>
            <p className="text-muted-foreground">No se reportaron incidencias durante la estancia.</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Valoración del Huésped</h4>
            <p className="text-muted-foreground">No hay valoración disponible.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Añadir Comentario</CardTitle>
          <CardDescription>¿Tienes algún comentario adicional sobre esta estancia?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Escribe tu comentario aquí..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleAddComment}>Enviar Comentario</Button>
        </CardFooter>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Detalles del Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Monto total</p>
              <p className="font-medium">${reservation.totalAmount.toFixed(2)} MXN</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Método de pago</p>
              <p className="font-medium">{reservation.paymentMethod}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Ver Factura
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function UpcomingReservation({ reservation }: { reservation: Reservation }) {
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Detalles de la Reservación</CardTitle>
          <CardDescription>
            Reservación para el {reservation.checkIn.toLocaleDateString()} hasta {reservation.checkOut.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
              <Image
                src={reservation.hotel.image}
                alt={reservation.hotel.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{reservation.hotel.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {reservation.hotel.location}
              </div>
              <p className="mt-1">
                {reservation.rooms.map((room, index) => (
                  <span key={index}>Habitación {room.number}, Planta {room.floor} ({room.nights} noche{room.nights > 1 ? "s" : ""})</span>
                ))}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{reservation.checkIn.toLocaleDateString()}</span>
                <Clock className="h-4 w-4 ml-2 mr-1 text-muted-foreground" />
                <span>{reservation.checkIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{reservation.checkOut.toLocaleDateString()}</span>
                <Clock className="h-4 w-4 ml-2 mr-1 text-muted-foreground" />
                <span>{reservation.checkOut.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Huéspedes</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">Huésped principal: {reservation.guest.name}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Información de Contacto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{reservation.guest.phone}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{reservation.guest.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Código QR de Reservación</CardTitle>
          <CardDescription>Presenta este código al momento de hacer check-in</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg mb-4">
            <Image
              src="/placeholder.svg?height=200&width=200&text=QR+Code"
              alt="Código QR de reservación"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">Reservación #{reservation.id}</p>
          <Button variant="outline" className="mt-4">
            <Share className="h-4 w-4 mr-2" />
            Compartir Código QR
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Políticas del Hotel</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="policies">
              <AccordionTrigger>Políticas de Reservación</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {reservation.policies.map((policy: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary mt-1" />
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="important">
              <AccordionTrigger>Información Importante</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {reservation.importantInfo.map((info: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary mt-1" />
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Detalles del Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Monto total</p>
              <p className="font-medium">${reservation.totalAmount.toFixed(2)} MXN</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Método de pago</p>
              <p className="font-medium">{reservation.paymentMethod}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Ver Factura
            </Button>
            <Button variant="outline" className="flex-1">
              <CreditCard className="h-4 w-4 mr-2" />
              Modificar Pago
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Cancelar Reservación
        </Button>
        <Button variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" />
          Modificar Fechas
        </Button>
        <Link href="/" className="flex-1">
          <Button className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Página Principal
          </Button>
        </Link>
      </div>
    </div>
  )
}
