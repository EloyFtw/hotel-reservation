"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Building, Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    branch: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        branch: "",
        message: "",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
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
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              Nosotros
            </Link>
            <Link href="/contact" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contáctanos</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta o solicitud.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Información de Contacto</h2>
                  <p className="mt-4 text-muted-foreground">
                    Puedes contactarnos a través de los siguientes medios o utilizar nuestro formulario de contacto.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">Oficinas Corporativas</h3>
                      <p className="text-muted-foreground">
                        Av. Paseo de la Reforma 222, Piso 15
                        <br />
                        Col. Juárez, 06600
                        <br />
                        La Paz, B.C.S.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">Teléfono</h3>
                      <p className="text-muted-foreground">
                        Reservaciones: +52 (55) 1234 5678
                        <br />
                        Atención al Cliente: +52 (55) 8765 4321
                        <br />
                        Horario: Lunes a Domingo, 8:00 - 22:00
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">Correo Electrónico</h3>
                      <p className="text-muted-foreground">
                        Reservaciones: reservas@hoteldelangel.com
                        <br />
                        Atención al Cliente: atencion@hoteldelangel.com
                        <br />
                        Recursos Humanos: rh@hoteldelangel.com
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">Nuestras Sucursales</h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Hotel Del Ángel Abasolo",
                        address: "Av. Reforma 123, Col. Pueblo Nuevo, La Paz, B.C.S.",
                        phone: "+52 (55) 1234 5678",
                      },
                      {
                        name: "Hotel Del Ángel Cabo",
                        address: "Blvd. Kukulcán Km 12.5, Zona Hotelera, Cabo San Lucas, B.C.S.",
                        phone: "+52 (998) 123 4567",
                      }                     
                    ].map((branch, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">{branch.name}</h4>
                          <p className="text-sm text-muted-foreground">{branch.address}</p>
                          <p className="text-sm text-muted-foreground">{branch.phone}</p>
                        </div>
                      </div>
                    ))}
                    <Link href="/hotels">
                      <Button variant="link" className="p-0 h-auto">
                        Ver todas las sucursales →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Envíanos un mensaje</CardTitle>
                    <CardDescription>
                      Completa el formulario a continuación y nos pondremos en contacto contigo lo antes posible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="text-center py-6 space-y-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold">¡Mensaje enviado!</h3>
                        <p className="text-muted-foreground">
                          Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.
                        </p>
                        <Button onClick={() => setSubmitted(false)} className="mt-4" variant="outline">
                          Enviar otro mensaje
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Tu nombre"
                              required
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="tu@email.com"
                              required
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono (opcional)</Label>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="+52 123 456 7890"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Asunto</Label>
                            <Select
                              value={formData.subject}
                              onValueChange={(value) => handleSelectChange("subject", value)}
                            >
                              <SelectTrigger id="subject">
                                <SelectValue placeholder="Selecciona un asunto" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="reservacion">Reservación</SelectItem>
                                <SelectItem value="informacion">Información General</SelectItem>
                                <SelectItem value="facturacion">Facturación</SelectItem>
                                <SelectItem value="queja">Queja o Sugerencia</SelectItem>
                                <SelectItem value="otro">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="branch">Sucursal (opcional)</Label>
                          <Select
                            value={formData.branch}
                            onValueChange={(value) => handleSelectChange("branch", value)}
                          >
                            <SelectTrigger id="branch">
                              <SelectValue placeholder="Selecciona una sucursal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="corporativo">Oficinas Corporativas</SelectItem>
                              <SelectItem value="lapaz">La Paz</SelectItem>
                              <SelectItem value="cabos">Los Cabos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Mensaje</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Escribe tu mensaje aquí..."
                            required
                            className="min-h-[120px]"
                            value={formData.message}
                            onChange={handleChange}
                          />
                        </div>
                      </form>
                    )}
                  </CardContent>
                  {!submitted && (
                    <CardFooter>
                      <Button type="submit" className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Encuéntranos</h2>
                <p className="max-w-[700px] text-muted-foreground">
                  Visita nuestras oficinas corporativas en La Paz
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl">
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                <Image
                  src="/placeholder.svg?height=800&width=1200&text=Mapa+Ubicación"
                  alt="Mapa de ubicación"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Hotel Del Ángel" width={150} height={60} />
            </Link>
            <p className="text-sm text-muted-foreground">© 2025 Hotel Del Ángel. Todos los derechos reservados.</p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm font-medium hover:underline underline-offset-4">
              Términos
            </Link>
            <Link href="/privacy" className="text-sm font-medium hover:underline underline-offset-4">
              Privacidad
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contacto
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
