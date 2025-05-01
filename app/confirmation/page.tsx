"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, Check, FileText, Home, MapPin, Printer, Share } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ConfirmationPage() {
  const router = useRouter()

  // Mock reservation data
  const reservation = {
    id: "RES-" + Math.floor(Math.random() * 1000000),
    date: new Date(),
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    hotel: {
      name: "Hotel Del Ángel - Abasolo",
      location: "La Paz, México",
      image: "/images/logo.png?height=300&width=500",
    },
    room: {
      name: "Habitación Estándar",
      price: 1850,
    },
    guests: {
      adults: 2,
      children: 0,
    },
    totalAmount: 6438, // 3 nights with taxes
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    // In a real app, this would trigger a PDF download
    alert("La factura se descargará automáticamente.")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Check className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">¡Reserva Confirmada!</h1>
            <p className="text-muted-foreground mt-2">
              Tu reserva ha sido procesada correctamente. Hemos enviado los detalles a tu correo electrónico.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Detalles de la Reserva</CardTitle>
                <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">Confirmada</div>
              </div>
              <CardDescription>Reserva #{reservation.id}</CardDescription>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de llegada</p>
                  <p className="font-medium">{reservation.checkIn.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de salida</p>
                  <p className="font-medium">{reservation.checkOut.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Huéspedes</p>
                  <p className="font-medium">
                    {reservation.guests.adults} adultos, {reservation.guests.children} niños
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total pagado</p>
                  <p className="font-medium">${reservation.totalAmount} MXN</p>
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
                    <span>Es necesario presentar una identificación oficial con fotografía</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Política de cancelación: gratuita hasta 48 horas antes de la llegada</span>
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
                <Button variant="outline" size="sm">
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

          <div className="flex flex-col items-center justify-center gap-4 text-center">
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
          </div>
        </div>
      </div>
    </div>
  )
}
