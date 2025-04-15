"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, FileText, Printer } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function PdfGeneratorPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    hotelName: "Hotel Del Ángel - Abasolo",
    roomType: "Habitación Estándar",
    checkIn: "2025-05-15",
    checkOut: "2025-05-20",
    adults: "2",
    children: "0",
    price: "1850",
    nights: "5",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const calculateTotal = () => {
    const price = Number.parseFloat(formData.price) || 0
    const nights = Number.parseInt(formData.nights) || 0
    const subtotal = price * nights
    const taxes = subtotal * 0.16
    return {
      subtotal,
      taxes,
      total: subtotal + taxes,
    }
  }

  const { subtotal, taxes, total } = calculateTotal()

  const handleGeneratePdf = () => {
    setIsGenerating(true)

    // Simulate PDF generation
    setTimeout(() => {
      setIsGenerating(false)
      // In a real app, this would trigger a PDF download
      alert("Cotización generada. El PDF se descargará automáticamente.")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Generador de Cotizaciones</h1>
          <p className="text-muted-foreground">Crea y descarga cotizaciones en PDF para tus clientes</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Datos de la Cotización
                </CardTitle>
                <CardDescription>Ingresa los detalles para generar la cotización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Hotel</Label>
                  <Select value={formData.hotelName} onValueChange={(value) => handleSelectChange("hotelName", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel Del Ángel - Centro">Hotel Del Ángel - Cancún</SelectItem>
                      <SelectItem value="Hotel Del Ángel - Cabo">
                        Hotel Del Ángel - Cabo
                      </SelectItem>
                      <SelectItem value="Hotel Del Ángel - Puerto Vallarta">
                        Hotel Del Ángel - Centro
                      </SelectItem>
                      <SelectItem value="Hotel Del Ángel - Valle de Bravo">Hotel Del Ángel - Valle de Bravo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomType">Tipo de Habitación</Label>
                  <Select value={formData.roomType} onValueChange={(value) => handleSelectChange("roomType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo de habitación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Habitación Estándar">Habitación Estándar</SelectItem>
                      <SelectItem value="Suite Junior">Suite Junior</SelectItem>
                      <SelectItem value="Suite Ejecutiva">Suite Ejecutiva</SelectItem>
                      <SelectItem value="Suite Presidencial">Suite Presidencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Fecha de llegada</Label>
                    <Input id="checkIn" name="checkIn" type="date" value={formData.checkIn} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Fecha de salida</Label>
                    <Input
                      id="checkOut"
                      name="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adults">Adultos</Label>
                    <Input
                      id="adults"
                      name="adults"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.adults}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="children">Niños</Label>
                    <Input
                      id="children"
                      name="children"
                      type="number"
                      min="0"
                      max="6"
                      value={formData.children}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio por noche (MXN)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nights">Número de noches</Label>
                    <Input
                      id="nights"
                      name="nights"
                      type="number"
                      min="1"
                      max="30"
                      value={formData.nights}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nombre del cliente</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    placeholder="Nombre completo"
                    value={formData.clientName}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Correo electrónico</Label>
                    <Input
                      id="clientEmail"
                      name="clientEmail"
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      value={formData.clientEmail}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Teléfono</Label>
                    <Input
                      id="clientPhone"
                      name="clientPhone"
                      placeholder="+52 123 456 7890"
                      value={formData.clientPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Información adicional para incluir en la cotización"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Vista previa
                </Button>
                <Button onClick={handleGeneratePdf} disabled={isGenerating}>
                  {isGenerating ? (
                    <>Generando...</>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generar PDF
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
                <CardDescription>Cotización para {formData.clientName || "Cliente"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 space-y-6">
                  <div className="text-center">
                    <Image
                      src="/images/logo.png"
                      alt="Hotel Del Ángel"
                      width={120}
                      height={48}
                      className="mx-auto mb-2"
                    />
                    <h2 className="text-2xl font-bold">Cotización</h2>
                    <p className="text-muted-foreground">Ref: COT-{Date.now().toString().slice(-6)}</p>
                    <p className="text-sm text-muted-foreground">Fecha: {new Date().toLocaleDateString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Hotel:</h3>
                      <p>{formData.hotelName}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Habitación:</h3>
                      <p>{formData.roomType}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Llegada:</h3>
                      <p>{formData.checkIn}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Salida:</h3>
                      <p>{formData.checkOut}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Huéspedes:</h3>
                      <p>
                        {formData.adults} adultos, {formData.children} niños
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Noches:</h3>
                      <p>{formData.nights}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Precio por noche:</span>
                      <span>${formData.price} MXN</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal ({formData.nights} noches):</span>
                      <span>${subtotal.toFixed(2)} MXN</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos (16%):</span>
                      <span>${taxes.toFixed(2)} MXN</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)} MXN</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Notas:</p>
                    <p>{formData.notes || "Sin notas adicionales."}</p>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Esta cotización es válida por 7 días a partir de la fecha de emisión.</p>
                    <p>Los precios están sujetos a disponibilidad y pueden cambiar sin previo aviso.</p>
                    <p>Para confirmar la reserva se requiere un depósito del 30% del valor total.</p>
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
