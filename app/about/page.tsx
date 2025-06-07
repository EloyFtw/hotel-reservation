"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Award, Building, Calendar, MapPin, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AboutPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsAuthenticated(false)
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
          localStorage.removeItem("token") // Limpiar token inválido
        }
      } catch (err) {
        console.warn("Error al validar sesión:", err)
        setIsAuthenticated(false)
        localStorage.removeItem("token") // Limpiar token en caso de error
      }
    }

    checkAuth()
  }, [])

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
            <Link href="/about" className="text-sm font-medium text-primary hover:underline underline-offset-4">
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
                  <Button variant="outline" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sobre Hotel Del Ángel</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Descubre nuestra historia, valores y compromiso con la excelencia en hospitalidad
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Nuestra Historia
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Tradición hotelera desde 1985</h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hotel Del Ángel nació en 1985 con nuestra primera sucursal en ____________, fundada por la
                  familia Ángel con la visión de crear espacios que combinaran la calidez del hogar con el lujo y
                  confort de un hotel de primera clase.
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A lo largo de más de tres décadas, hemos crecido hasta convertirnos en una de las cadenas hoteleras
                  más reconocidas de México, expandiendo nuestra presencia a los destinos turísticos más importantes del
                  país, siempre manteniendo nuestra esencia y compromiso con la excelencia en el servicio.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                  <Image
                    src="/placeholder.svg?height=800&width=1200&text=Fundadores+Hotel+Del+Angel"
                    alt="Fundadores de Hotel Del Ángel"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Nuestros Valores
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Los pilares que nos definen</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Estos son los valores fundamentales que guían cada aspecto de nuestro servicio
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Hospitalidad Genuina</h3>
                  <p className="text-muted-foreground">
                    Creemos en tratar a cada huésped como parte de nuestra familia, ofreciendo un servicio cálido y
                    personalizado.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Excelencia</h3>
                  <p className="text-muted-foreground">
                    Nos esforzamos constantemente por superar las expectativas, cuidando cada detalle para ofrecer
                    experiencias memorables.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Innovación</h3>
                  <p className="text-muted-foreground">
                    Evolucionamos constantemente, incorporando nuevas tecnologías y tendencias para mejorar la
                    experiencia de nuestros huéspedes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Branches Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Nuestras Sucursales
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Presencia en los mejores destinos
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Contamos con sucursales estratégicamente ubicadas en los destinos más atractivos de México
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Del Ángel La Paz",
                  location: "La Paz, Baja California Sur",
                  image: "/placeholder.svg?height=300&width=500&text=La+Paz",
                  year: 1985,
                },
                {
                  name: "Del Ángel - Los Cabos",
                  location: "Los Cabos, Baja California Sur",
                  image: "/placeholder.svg?height=300&width=500&text=Los+Cabos",
                  year: 2005,
                },
              ].map((branch, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src={branch.image || "/placeholder.svg"} alt={branch.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{branch.name}</h3>
                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {branch.location}
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Establecida en {branch.year}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/hotels">
                <Button size="lg">Ver Todas las Sucursales</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Nuestra Trayectoria
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Más de 35 años de historia</h2>
              </div>
            </div>
            <div className="relative mx-auto max-w-3xl">
              {/* Timeline line */}
              <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-border"></div>

              {/* Timeline items */}
              {[
                {
                  year: "1985",
                  title: "Fundación",
                  description: "Apertura de la primera sucursal en La Paz por la familia Ángel.",
                },
                {
                  year: "1992",
                  title: "Expansión a destinos de playa",
                  description:
                    "Inauguración de Hotel Del Ángel Cancún, marcando nuestra entrada a destinos turísticos de playa.",
                },
                {
                  year: "1998",
                  title: "Crecimiento en la costa del Pacífico",
                  description:
                    "Apertura de nuestra sucursal en Cabo, consolidando nuestra presencia en ambas costas.",
                },
                {
                  year: "2005",
                  title: "Llegada a Los Cabos",
                  description: "Inauguración de nuestra sucursal más lujosa hasta el momento en Los Cabos.",
                },
                {
                  year: "2010",
                  title: "Destinos de interior",
                  description:
                    "Expansión a Valle de Bravo, ofreciendo una experiencia única en contacto con la naturaleza.",
                },
                {
                  year: "2015",
                  title: "Patrimonio cultural",
                  description: "Apertura en San Miguel de Allende, integrando el patrimonio cultural a nuestra oferta.",
                },
                {
                  year: "2020",
                  title: "Renovación digital",
                  description: "Implementación de nuevas tecnologías y renovación de nuestra plataforma de reservas.",
                },
                {
                  year: "2025",
                  title: "Visión de futuro",
                  description:
                    "Planes de expansión internacional y compromiso con la sostenibilidad en todas nuestras operaciones.",
                },
              ].map((item, index) => (
                <div key={index} className="relative mb-12">
                  <div className={`flex items-center ${index % 2 === 0 ? "flex-row-reverse" : "flex-row"} gap-8`}>
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>

                    {/* Content */}
                    <div className={`w-1/2 ${index % 2 === 0 ? "text-right pr-8" : "pl-8"}`}>
                      <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-muted-foreground mt-2">{item.description}</p>
                    </div>

                    {/* Empty space for the other side */}
                    <div className="w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Sé parte de nuestra historia</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Te invitamos a vivir la experiencia Hotel Del Ángel en cualquiera de nuestras sucursales
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/hotels">
                  <Button size="lg">Explorar Sucursales</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contactar
                  </Button>
                </Link>
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
