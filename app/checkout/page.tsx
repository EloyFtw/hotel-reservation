"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Calendar, CreditCard, FileText, Info, Lock, MapPin, Shield, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for checkout
const hotelData = {
  id: 1,
  name: "Hotel Del Ángel Abasolo",
  location: "La Paz, México",
  image: "/placeholder.svg?height=300&width=500",
  rooms: [
    {
      id: 1,
      name: "Habitación Estándar",
      price: 1850,
      capacity: 2,
    },
    {
      id: 2,
      name: "Suite Junior",
      price: 2450,
      capacity: 3,
    },
    {
      id: 3,
      name: "Suite Ejecutiva",
      price: 3200,
      capacity: 4,
    },
  ],
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const hotelId = searchParams.get("hotelId")
  const roomId = searchParams.get("roomId")
  const dateParam = searchParams.get("date")

  const selectedRoom = hotelData.rooms.find((room) => room.id.toString() === roomId) || hotelData.rooms[0]
  const checkInDate = dateParam ? new Date(dateParam) : new Date()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    saveCard: false,
    termsAccepted: false,
  })

  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleGenerateQuote = () => {
    setIsGeneratingQuote(true)

    // Simulate PDF generation
    setTimeout(() => {
      setIsGeneratingQuote(false)
      // In a real app, this would trigger a PDF download
      alert("Cotización generada. El PDF se descargará automáticamente.")
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.termsAccepted) {
      alert("Debes aceptar los términos y condiciones para continuar.")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/confirmation")
    }, 2000)
  }

  const roomPrice = selectedRoom.price
  const taxAmount = Math.round(roomPrice * 0.16)
  const totalAmount = roomPrice + taxAmount

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <div className="mb-6">
          <Link
            href={`/hotels/${hotelId}`}
            className="flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a detalles del hotel
          </Link>
          <h1 className="text-3xl font-bold">Finalizar Reserva</h1>
          <p className="text-muted-foreground">Complete sus datos para confirmar su reserva</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Información del Huésped
                    </CardTitle>
                    <CardDescription>Ingrese los datos del huésped principal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Juan"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Pérez"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="juan@ejemplo.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+52 123 456 7890"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Solicitudes especiales (opcional)</Label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        placeholder="Ej: Habitación en piso alto, cama adicional, etc."
                        value={formData.specialRequests}
                        onChange={handleChange}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Información de Pago
                    </CardTitle>
                    <CardDescription>Ingrese los datos de su tarjeta de crédito o débito</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="card">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="card">Tarjeta</TabsTrigger>
                        <TabsTrigger value="mercpg">Mercado Pago</TabsTrigger>
                        <TabsTrigger value="transfer">Transferencia</TabsTrigger>
                      </TabsList>
                      <TabsContent value="card" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            placeholder="Juan Pérez"
                            value={formData.cardName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número de tarjeta</Label>
                          <div className="relative">
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <div className="w-8 h-5 bg-muted rounded"></div>
                              <div className="w-8 h-5 bg-muted rounded"></div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Fecha de expiración</Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              placeholder="MM/AA"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              <Label htmlFor="cardCvc">CVC</Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>El código de seguridad de 3 dígitos en el reverso de su tarjeta</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Input
                              id="cardCvc"
                              name="cardCvc"
                              placeholder="123"
                              value={formData.cardCvc}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="saveCard"
                            name="saveCard"
                            checked={formData.saveCard}
                            onCheckedChange={(checked) => handleCheckboxChange("saveCard", !!checked)}
                          />
                          <label
                            htmlFor="saveCard"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Guardar esta tarjeta para futuras reservas
                          </label>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-4">
                          <Lock className="h-4 w-4 mr-1" />
                          Sus datos de pago están seguros y encriptados
                        </div>
                      </TabsContent>
                      <TabsContent value="mercpg" className="py-4">
                        <div className="text-center py-8">
                          <p className="mb-4">Serás redirigido a Mercado Pago para completar tu pago</p>
                          <Button className="w-full max-w-xs">Continuar con Mercado Pago</Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="transfer" className="py-4">
                        <div className="space-y-4">
                          <p>Realiza una transferencia bancaria a la siguiente cuenta:</p>
                          <div className="bg-muted p-4 rounded-lg">
                            <p>
                              <strong>Banco:</strong> Banco Nacional
                            </p>
                            <p>
                              <strong>Titular:</strong> Hotel Angel S.A.
                            </p>
                            <p>
                              <strong>Cuenta:</strong> 1234 5678 9012 3456
                            </p>
                            <p>
                              <strong>CLABE:</strong> 012 345 678 901 234 567
                            </p>
                            <p>
                              <strong>Referencia:</strong> RES-{hotelId}-{Date.now().toString().slice(-6)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Una vez realizada la transferencia, envía el comprobante a reservas@hotelreserva.com
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Terms and Conditions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", !!checked)}
                          required
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Acepto los términos y condiciones
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Al marcar esta casilla, acepto las{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                              políticas de cancelación
                            </Link>{" "}
                            y los{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                              términos de servicio
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handleGenerateQuote} disabled={isGeneratingQuote}>
                      {isGeneratingQuote ? (
                        <>Generando...</>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Generar Cotización
                        </>
                      )}
                    </Button>
                    <Button type="submit" disabled={isProcessing || !formData.termsAccepted}>
                      {isProcessing ? "Procesando..." : "Confirmar Reserva"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumen de la Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                    <Image
                      src={hotelData.image || "/placeholder.svg"}
                      alt={hotelData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{hotelData.name}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {hotelData.location}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Fecha de llegada</span>
                    </div>
                    <span>{checkInDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Habitación</span>
                    </div>
                    <span>{selectedRoom.name}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Precio por noche</span>
                    <span>${roomPrice} MXN</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <span>Impuestos y cargos</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Incluye IVA (16%) y cargos por servicio</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span>${taxAmount} MXN</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalAmount} MXN</span>
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Política de cancelación</p>
                      <p className="text-muted-foreground">Cancelación gratuita hasta 48 horas antes de la llegada</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
