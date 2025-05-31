"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Mock data for checkout
const hotelData = {
  id: 1,
  name: "Hotel Del Ángel Abasolo",
  location: "La Paz, México",
  image: "/images/logo.png?height=300&width=500",
  rooms: [
    {
      id: 1,
      name: "Sencilla Estándar",
      price: 1850,
      capacity: 3,
    },
    {
      id: 2,
      name: "Doble Estándar",
      price: 2450,
      capacity: 3,
    },
    {
      id: 3,
      name: "Triple Estándar",
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
    guest: {
      firstName: "",
      lastNameP: "",
      lastNameM: "",
      phone: "",
      email: "",
      birthDate: "",
      gender: "",
      street: "",
      neighborhood: "",
      postalCode: "",
      extNumber: "",
      intNumber: "",
      city: "",
      state: "",
      country: "",
      specialRequests: "",
    },
    companions: Array.from({ length: 3 }, () => ({
      firstName: "",
      lastNameP: "",
      lastNameM: "",
      phone: "",
      email: "",
      birthDate: "",
      gender: "",
      street: "",
      neighborhood: "",
      postalCode: "",
      extNumber: "",
      intNumber: "",
      city: "",
      state: "",
      country: "",
    })),
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    saveCard: false,
    termsAccepted: false,
  })

  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/usuarios/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          localStorage.removeItem("token") // Clear invalid token
        }
      } catch (err) {
        console.warn("Error al validar sesión:", err)
        setIsAuthenticated(false)
        localStorage.removeItem("token") // Clear token on error
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (name.startsWith("guest.")) {
      const field = name.replace("guest.", "")
      setFormData((prev) => ({
        ...prev,
        guest: { ...prev.guest, [field]: value },
      }))
    } else if (name.startsWith("companion.")) {
      const [, field, indexStr] = name.split(".")
      const index = parseInt(indexStr, 10)
      setFormData((prev) => {
        const updatedCompanions = [...prev.companions]
        updatedCompanions[index] = { ...updatedCompanions[index], [field]: value }
        return { ...prev, companions: updatedCompanions }
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }))
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleGenerateQuote = () => {
    setIsGeneratingQuote(true)
    setTimeout(() => {
      setIsGeneratingQuote(false)
      alert("Cotización generada. El PDF se descargará automáticamente.")
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.termsAccepted) {
      alert("Debes aceptar los términos y condiciones para continuar.")
      return
    }

    const filledCompanions = formData.companions.filter(
      (companion) =>
        companion.firstName ||
        companion.lastNameP ||
        companion.lastNameM ||
        companion.phone ||
        companion.email ||
        companion.birthDate ||
        companion.gender ||
        companion.street ||
        companion.neighborhood ||
        companion.postalCode ||
        companion.extNumber ||
        companion.intNumber ||
        companion.city ||
        companion.state ||
        companion.country
    )
    for (const companion of filledCompanions) {
      if (
        !companion.firstName ||
        !companion.lastNameP ||
        !companion.birthDate ||
        !companion.gender ||
        !companion.street ||
        !companion.neighborhood ||
        !companion.postalCode ||
        !companion.city ||
        !companion.state ||
        !companion.country
      ) {
        alert("Por favor completa todos los campos obligatorios de los acompañantes o déjalos vacíos.")
        return
      }
    }

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/confirmation")
    }, 2000)
  }

  const roomPrice = selectedRoom.price
  const taxAmount = Math.round(roomPrice * 0.16)
  const totalAmount = roomPrice + taxAmount

  if (isLoading) {
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
              <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
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
        <main className="flex-1 flex items-center justify-center">
          <p>Cargando...</p>
        </main>
      </div>
    )
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
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background">
        {!isAuthenticated ? (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Inicia sesión o regístrate para continuar
                  </h1>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Para completar tu reserva, necesitas una cuenta. Inicia sesión si ya tienes una o regístrate para crear una nueva.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg">Registrarse</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
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
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="mr-2 h-5 w-5" />
                          Información del Huésped
                        </CardTitle>
                        <CardDescription>Ingrese los datos del huésped principal</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                          <p>
                            <strong>Importante:</strong> Los datos proporcionados deben coincidir exactamente con su
                            identificación oficial (INE, pasaporte, etc.), ya que serán validados al momento de su ingreso al
                            hotel. En caso de no coincidir, la reserva no será válida y no se permitirá el acceso.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Datos Personales</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="guest.lastNameP">
                                Apellido Paterno <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.lastNameP"
                                name="guest.lastNameP"
                                placeholder="Pérez"
                                value={formData.guest.lastNameP}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest.lastNameM">Apellido Materno</Label>
                              <Input
                                id="guest.lastNameM"
                                name="guest.lastNameM"
                                placeholder="Gómez"
                                value={formData.guest.lastNameM}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest.firstName">
                                Nombres <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.firstName"
                                name="guest.firstName"
                                placeholder="Juan"
                                value={formData.guest.firstName}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="guest.phone">
                                Celular <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.phone"
                                name="guest.phone"
                                placeholder="+52 123 456 7890"
                                value={formData.guest.phone}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest.email">
                                Correo electrónico <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.email"
                                name="guest.email"
                                type="email"
                                placeholder="juan@ejemplo.com"
                                value={formData.guest.email}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="guest.birthDate">
                                Fecha de nacimiento <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.birthDate"
                                name="guest.birthDate"
                                type="date"
                                value={formData.guest.birthDate}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest.gender">
                                Sexo (H/M) <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.gender"
                                name="guest.gender"
                                placeholder="H o M"
                                value={formData.guest.gender}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Dirección</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="guest.street">
                                Calles <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.street"
                                name="guest.street"
                                placeholder="Av. Principal"
                                value={formData.guest.street}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest.neighborhood">
                                Colonia <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.neighborhood"
                                name="guest.neighborhood"
                                placeholder="Centro"
                                value={formData.guest.neighborhood}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="guest.postalCode">
                                Código postal <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.postalCode"
                                name="guest.postalCode"
                                placeholder="12345"
                                value={formData.guest.postalCode}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest.extNumber">Número exterior</Label>
                              <Input
                                id="guest.extNumber"
                                name="guest.extNumber"
                                placeholder="123"
                                value={formData.guest.extNumber}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest.intNumber">Número interior</Label>
                              <Input
                                id="guest.intNumber"
                                name="guest.intNumber"
                                placeholder="A1"
                                value={formData.guest.intNumber}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="guest.city">
                                Ciudad <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.city"
                                name="guest.city"
                                placeholder="La Paz"
                                value={formData.guest.city}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest.state">
                                Estado <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.state"
                                name="guest.state"
                                placeholder="Baja California Sur"
                                value={formData.guest.state}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest.country">
                                País <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="guest.country"
                                name="guest.country"
                                placeholder="México"
                                value={formData.guest.country}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guest.specialRequests">Solicitudes especiales (opcional)</Label>
                          <Textarea
                            id="guest.specialRequests"
                            name="guest.specialRequests"
                            placeholder="Ej: Habitación en piso alto, cama adicional, etc."
                            value={formData.guest.specialRequests}
                            onChange={handleChange}
                          />
                        </div>

                        <Separator />
                        <div className="space-y-6">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            <h3 className="text-lg font-medium">Acompañantes (Opcional)</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Puede agregar hasta {selectedRoom.capacity - 1} acompañante(s) para esta habitación. Los datos
                            deben coincidir con su identificación oficial.
                          </p>
                          {formData.companions.slice(0, selectedRoom.capacity - 1).map((companion, index) => (
                            <div key={index} className="space-y-4">
                              <h4 className="font-medium">Acompañante {index + 1}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.lastNameP.${index}`}>Apellido Paterno</Label>
                                  <Input
                                    id={`companion.lastNameP.${index}`}
                                    name={`companion.lastNameP.${index}`}
                                    placeholder="Pérez"
                                    value={companion.lastNameP}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.lastNameM.${index}`}>Apellido Materno</Label>
                                  <Input
                                    id={`companion.lastNameM.${index}`}
                                    name={`companion.lastNameM.${index}`}
                                    placeholder="Gómez"
                                    value={companion.lastNameM}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.firstName.${index}`}>Nombres</Label>
                                  <Input
                                    id={`companion.firstName.${index}`}
                                    name={`companion.firstName.${index}`}
                                    placeholder="Juan"
                                    value={companion.firstName}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.phone.${index}`}>Celular</Label>
                                  <Input
                                    id={`companion.phone.${index}`}
                                    name={`companion.phone.${index}`}
                                    placeholder="+52 123 456 7890"
                                    value={companion.phone}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.email.${index}`}>Correo electrónico</Label>
                                  <Input
                                    id={`companion.email.${index}`}
                                    name={`companion.email.${index}`}
                                    type="email"
                                    placeholder="juan@ejemplo.com"
                                    value={companion.email}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.birthDate.${index}`}>Fecha de nacimiento</Label>
                                  <Input
                                    id={`companion.birthDate.${index}`}
                                    name={`companion.birthDate.${index}`}
                                    type="date"
                                    value={companion.birthDate}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.gender.${index}`}>Sexo (H/M)</Label>
                                  <Input
                                    id="companion.gender.${index}"
                                    name={`companion.gender.${index}`}
                                    placeholder="H o M"
                                    value={companion.gender}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.street.${index}`}>Calles</Label>
                                  <Input
                                    id={`companion.street.${index}`}
                                    name={`companion.street.${index}`}
                                    placeholder="Av. Principal"
                                    value={companion.street}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.neighborhood.${index}`}>Colonia</Label>
                                  <Input
                                    id={`companion.neighborhood.${index}`}
                                    name={`companion.neighborhood.${index}`}
                                    placeholder="Centro"
                                    value={companion.neighborhood}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.postalCode.${index}`}>Código postal</Label>
                                  <Input
                                    id={`companion.postalCode.${index}`}
                                    name={`companion.postalCode.${index}`}
                                    placeholder="12345"
                                    value={companion.postalCode}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.extNumber.${index}`}>Número exterior</Label>
                                  <Input
                                    id={`companion.extNumber.${index}`}
                                    name={`companion.extNumber.${index}`}
                                    placeholder="123"
                                    value={companion.extNumber}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.intNumber.${index}`}>Número interior</Label>
                                  <Input
                                    id={`companion.intNumber.${index}`}
                                    name={`companion.intNumber.${index}`}
                                    placeholder="A1"
                                    value={companion.intNumber}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.city.${index}`}>Ciudad</Label>
                                  <Input
                                    id={`companion.city.${index}`}
                                    name={`companion.city.${index}`}
                                    placeholder="La Paz"
                                    value={companion.city}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.state.${index}`}>Estado</Label>
                                  <Input
                                    id={`companion.state.${index}`}
                                    name={`companion.state.${index}`}
                                    placeholder="Baja California Sur"
                                    value={companion.state}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companion.country.${index}`}>País</Label>
                                  <Input
                                    id={`companion.country.${index}`}
                                    name={`companion.country.${index}`}
                                    placeholder="México"
                                    value={companion.country}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

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
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                  <div className="w-4 h-4"></div>
                                  <div className="w-4 h-4"></div>
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
                              <Lock className="h-4 w-4 mr-2" />
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

              <div className="md:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Resumen de la Reserva</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={hotelData.image || "/images/logo.png"}
                          alt={hotelData.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{hotelData.name}</h3>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-3.5 w-3.5 mr-2" />
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
        )}
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