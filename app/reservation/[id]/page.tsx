"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
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
  Star,
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

// Datos de muestra para diferentes tipos de reservaciones
const reservationData = {
  // Reservación cancelada
  "3411": {
    id: "3411",
    status: "cancelled",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    cancelledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    cancellationReason: "Cambio de planes de viaje",
    refundAmount: 1200,
    checkIn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    hotel: {
      name: "Hotel Del Ángel - Cancún",
      location: "Cancún, México",
      image: "/placeholder.svg?height=300&width=500",
    },
    room: {
      name: "Habitación Estándar",
      price: 1850,
      capacity: 2,
    },
    guest: {
      name: "Carlos Rodríguez",
      email: "carlos@ejemplo.com",
      phone: "+52 123 456 7890",
    },
    totalAmount: 5550,
    paymentMethod: "Tarjeta de crédito",
  },

  // Reservación completada
  "3047": {
    id: "3047",
    status: "completed",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    checkIn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    actualCheckIn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 horas después
    actualCheckOut: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000), // 1 hora antes
    hotel: {
      name: "Hotel Del Ángel Abasolo",
      location: "Laz Paz, México",
      image: "/placeholder.svg?height=300&width=500",
    },
    room: {
      name: "Doble Estandar",
      price: 1200,
      capacity: 3,
      number: "304",
      floor: 3,
    },
    guest: {
      name: "Ana López",
      email: "ana@ejemplo.com",
      phone: "+52 987 654 3210",
      additionalGuests: ["Juan López", "María López"],
    },
    totalAmount: 12250,
    paymentMethod: "Tarjeta de crédito",
    stayDetails: {
      services: ["Desayuno incluido", "Estacionamiento", "Wi-Fi"],
      incidents: [
        {
          date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          description: "Solicitud de toallas adicionales",
          resolved: true,
        },
        {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          description: "Problema con el aire acondicionado",
          resolved: true,
        },
      ],
      feedback: {
        rating: 4.5,
        comment:
          "Excelente servicio, habitación muy cómoda. El único detalle fue el aire acondicionado que falló un día, pero lo solucionaron rápidamente.",
      },
    },
  },

  // Reservación próxima
  "4100": {
    id: "4100",
    status: "upcoming",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    checkIn: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    hotel: {
      name: "Hotel Del Ángel Abasolo",
      location: "La Paz, México",
      image: "/placeholder.svg?height=300&width=500",
    },
    room: {
      name: "Suite Ejecutiva",
      price: 3200,
      capacity: 4,
      number: "501",
      floor: 5,
    },
    guest: {
      name: "Miguel Hernández",
      email: "miguel@ejemplo.com",
      phone: "+52 555 123 4567",
      additionalGuests: ["Laura Hernández", "Daniel Hernández"],
    },
    totalAmount: 18560,
    paymentMethod: "Transferencia bancaria",
    policies: [
      "Check-in a partir de las 14:00 hrs",
      "Check-out hasta las 12:00 hrs",
      "Se requiere identificación oficial con fotografía",
      "No se permiten mascotas",
      "Política de cancelación: gratuita hasta 48 horas antes de la llegada",
    ],
    importantInfo: [
      "Todas las habitaciones son para no fumadores",
      "Hay estacionamiento gratuito disponible",
      "El desayuno está incluido en su tarifa",
    ],
  },
}

export default function ReservationDetailPage() {
  const params = useParams()
  const reservationId = params.id as string
  const [reservation, setReservation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")

  useEffect(() => {
    // Simulamos la carga de datos
    setTimeout(() => {
      setReservation(reservationData["4100"] || reservationData["4100"])
      setLoading(false)
    }, 500)
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

  if (!reservation) {
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
                  No pudimos encontrar los detalles de la reservación que estás buscando.
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

  // Renderizado condicional según el estado de la reservación
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a mis reservaciones
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Reservación #{reservation.id}</h1>
              <div className="flex items-center gap-2 mt-1">
                {reservation.status === "upcoming" && <Badge className="bg-blue-500 hover:bg-blue-600">Próxima</Badge>}
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

          {/* Contenido específico según el estado */}
          {reservation.status === "cancelled" && <CancelledReservation reservation={reservation} />}

          {reservation.status === "completed" && (
            <CompletedReservation
              reservation={reservation}
              comment={comment}
              setComment={setComment}
              handleAddComment={handleAddComment}
            />
          )}

          {reservation.status === "upcoming" && <UpcomingReservation reservation={reservation} />}
        </div>
      </div>
    </div>
  )
}

// Componente para reservaciones canceladas
function CancelledReservation({ reservation }: { reservation: any }) {
  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Reservación Cancelada</AlertTitle>
        <AlertDescription>
          Esta reservación fue cancelada el {reservation.cancelledAt.toLocaleDateString()}.
        </AlertDescription>
      </Alert>

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
              <p className="font-medium">${reservation.refundAmount} MXN</p>
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
                src={reservation.hotel.image || "/placeholder.svg"}
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
              <p className="mt-1">{reservation.room.name}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Fecha de llegada (planificada)</p>
              <p className="font-medium">{reservation.checkIn.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de salida (planificada)</p>
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
            <h4 className="font-medium mb-2">Detalles del Pago</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monto total</p>
                <p className="font-medium">${reservation.totalAmount} MXN</p>
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
            Si necesitas más información sobre esta cancelación, por favor contacta a nuestro servicio al cliente.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

// Componente para reservaciones completadas
function CompletedReservation({
  reservation,
  comment,
  setComment,
  handleAddComment,
}: {
  reservation: any
  comment: string
  setComment: (value: string) => void
  handleAddComment: () => void
}) {
  return (
    <div className="space-y-6">
      <Card>
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
                src={reservation.hotel.image || "/placeholder.svg"}
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
                {reservation.room.name} - Habitación {reservation.room.number}, Piso {reservation.room.floor}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Check-in real</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{reservation.actualCheckIn.toLocaleDateString()}</span>
                <Clock className="h-4 w-4 ml-2 mr-1 text-muted-foreground" />
                <span>{reservation.actualCheckIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out real</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{reservation.actualCheckOut.toLocaleDateString()}</span>
                <Clock className="h-4 w-4 ml-2 mr-1 text-muted-foreground" />
                <span>{reservation.actualCheckOut.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
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
              {reservation.guest.additionalGuests && reservation.guest.additionalGuests.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Acompañantes:</p>
                  <ul className="list-disc list-inside pl-4">
                    {reservation.guest.additionalGuests.map((guest: string, index: number) => (
                      <li key={index} className="text-sm">
                        {guest}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Servicios Utilizados</h4>
            <div className="flex flex-wrap gap-2">
              {reservation.stayDetails.services.map((service: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Incidencias Durante la Estancia</h4>
            {reservation.stayDetails.incidents.length > 0 ? (
              <div className="space-y-3">
                {reservation.stayDetails.incidents.map((incident: any, index: number) => (
                  <div key={index} className="flex items-start gap-2 bg-muted p-3 rounded-md">
                    {incident.resolved ? (
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{incident.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {incident.date.toLocaleDateString()} - {incident.resolved ? "Resuelto" : "Pendiente"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No se reportaron incidencias durante la estancia.</p>
            )}
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Valoración del Huésped</h4>
            {reservation.stayDetails.feedback ? (
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(reservation.stayDetails.feedback.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : i < reservation.stayDetails.feedback.rating
                              ? "fill-yellow-400 text-yellow-400 fill-opacity-50"
                              : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{reservation.stayDetails.feedback.rating}</span>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="italic">{reservation.stayDetails.feedback.comment}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No hay valoración disponible.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Monto total</p>
              <p className="font-medium">${reservation.totalAmount} MXN</p>
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

// Componente para reservaciones próximas
function UpcomingReservation({ reservation }: { reservation: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Reservación</CardTitle>
          <CardDescription>
            Reservación para el {reservation.checkIn.toLocaleDateString()} al{" "}
            {reservation.checkOut.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
              <Image
                src={reservation.hotel.image || "/placeholder.svg"}
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
                {reservation.room.name} - Habitación {reservation.room.number}, Piso {reservation.room.floor}
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
                <span>A partir de las 15:00</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{reservation.checkOut.toLocaleDateString()}</span>
                <Clock className="h-4 w-4 ml-2 mr-1 text-muted-foreground" />
                <span>Hasta las 12:00</span>
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
              {reservation.guest.additionalGuests && reservation.guest.additionalGuests.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Huéspedes adicionales:</p>
                  <ul className="list-disc list-inside pl-4">
                    {reservation.guest.additionalGuests.map((guest: string, index: number) => (
                      <li key={index} className="text-sm">
                        {guest}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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

      <Card>
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

      <Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Monto total</p>
              <p className="font-medium">${reservation.totalAmount} MXN</p>
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
