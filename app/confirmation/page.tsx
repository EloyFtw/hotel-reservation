"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Calendar, Check, FileText, Home, MapPin, Printer, Share } from "lucide-react"
import { motion } from "framer-motion"
import { jsPDF } from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getHotelById } from "@/lib/api/hoteles"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Reservation {
  id: number
  FK_Huesped: number
  HoraDeLlegada: string
  Fecha: string
  Preferencias: string
  FK_Hotel: number
  FK_Estatus: number
}

interface ReservationRoom {
  FK_Reservacion: number
  FK_CAT_Tipo_Habitacion: number
  Cant_Noches: number
  Tarifa: number
  Costo: number
  FK_Estatus_Habitacion: string
}

interface RoomType {
  id: number
  name: string
  price: number
}

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reservationId = searchParams.get("reservationId")

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [reservationRoom, setReservationRoom] = useState<ReservationRoom | null>(null)
  const [hotel, setHotel] = useState<any | null>(null)
  const [roomType, setRoomType] = useState<RoomType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservationData = async () => {
      if (!reservationId) {
        setError("ID de reservación no proporcionado")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No se encontró el token de autenticación")
        }

        // Fetch reservation
        const resResponse = await fetch(`${API_BASE_URL}/api/reservaciones/${reservationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (!resResponse.ok) {
          throw new Error("Error al cargar la reservación")
        }
        const reservationData: Reservation = await resResponse.json()
        setReservation(reservationData)

        // Fetch reservation room
        const resRoomResponse = await fetch(
          `${API_BASE_URL}/api/reservacionHabitaciones?FK_Reservacion=${reservationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        if (!resRoomResponse.ok) {
          throw new Error("Error al cargar los detalles de la habitación")
        }
        const resRoomData: ReservationRoom[] = await resRoomResponse.json()
        if (resRoomData.length === 0) {
          throw new Error("No se encontró la habitación asociada")
        }
        setReservationRoom(resRoomData[0])

        // Fetch hotel
        const hotelData = await getHotelById(reservationData.FK_Hotel.toString())
        setHotel(hotelData)

        // Find room type
        const room = hotelData.rooms.find(
          (r: RoomType) => r.id === resRoomData[0].FK_CAT_Tipo_Habitacion
        )
        if (!room) {
          throw new Error("Tipo de habitación no encontrado")
        }
        setRoomType(room)
      } catch (err) {
        setError( "Error al cargar los datos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservationData()
  }, [reservationId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    if (!reservation || !reservationRoom || !hotel || !roomType) return

    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Factura de Reserva", 20, 20)
    doc.setFontSize(12)
    doc.text(`Reserva #RES-${reservation.id}`, 20, 30)
    doc.text(`Hotel: ${hotel.name}`, 20, 40)
    doc.text(`Ubicación: ${hotel.location}`, 20, 50)
    doc.text(`Habitación: ${roomType.name}`, 20, 60)
    doc.text(`Fecha de llegada: ${new Date(reservation.Fecha).toLocaleDateString()}`, 20, 70)
    doc.text(
      `Fecha de salida: ${new Date(
        new Date(reservation.Fecha).getTime() + reservationRoom.Cant_Noches * 24 * 60 * 60 * 1000
      ).toLocaleDateString()}`,
      20,
      80
    )
    doc.text(`Total: $${Math.round(reservationRoom.Costo)} MXN`, 20, 90)
    doc.save(`factura-res-${reservation.id}.pdf`)
  }

  const handleShare = async () => {
    const shareData = {
      title: "Confirmación de Reserva",
      text: `¡Reserva confirmada! Reserva #RES-${reservation?.id} en ${hotel?.name}.`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        alert("Enlace copiado al portapapeles")
      }
    } catch (err) {
      console.error("Error al compartir:", err)
      alert("No se pudo compartir. Copia el enlace manualmente.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (error || !reservation || !reservationRoom || !hotel || !roomType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Error al cargar la reserva"}</p>
          <Link href="/hotels">
            <Button className="mt-4">Volver a Hoteles</Button>
          </Link>
        </div>
      </div>
    )
  }

  const checkInDate = new Date(reservation.HoraDeLlegada)
  const checkOutDate = new Date(
    new Date(reservation.Fecha).getTime() + reservationRoom.Cant_Noches * 24 * 60 * 60 * 1000
  )

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container py-6 md:py-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Check className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">¡Reserva Confirmada!</h1>
            <p className="text-muted-foreground mt-2">
              Tu reserva ha sido procesada correctamente. Los detalles se han enviado a tu correo.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Detalles de la Reserva</CardTitle>
                  <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    Confirmada
                  </div>
                </div>
                <CardDescription>Reserva #RES-{reservation.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
                    <Image
                      src={hotel.image || "/images/logo.png"}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{hotel.name}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {hotel.location}
                    </div>
                    <p className="mt-1">{roomType.name}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de llegada</p>
                    <p className="font-medium">{checkInDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de salida</p>
                    <p className="font-medium">{checkOutDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Huéspedes</p>
                    <p className="font-medium">1 adulto</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total pagado</p>
                    <p className="font-medium">${Math.round(reservationRoom.Costo)} MXN</p>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Información importante</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Check-in: a partir de las 15:00 hrs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Check-out: hasta las 12:00 hrs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Es necesario presentar una identificación oficial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Cancelación gratuita hasta 48 horas antes</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3 justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                    <FileText className="h-4 w-4 mr-2" />
                    Factura
                  </Button>
                  <Link href="/dashboard">
                    <Button size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Mis Reservas
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold">¿Qué deseas hacer ahora?</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  Volver al Inicio
                </Button>
              </Link>
              <Link href="/hotels">
                <Button className="gap-2">Explorar Sucursales</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable,
          .printable * {
            visibility: visible;
          }
          .printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
