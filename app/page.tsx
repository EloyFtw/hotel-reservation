import Link from "next/link"
import Image from "next/image"
import { CalendarDays, CreditCard, FileText, MapPin, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FeaturedBranches from "@/components/featured-hotels"

export default function HomePage() {
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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Encuentra la sucursal perfecta para tu próxima aventura
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Reserva fácilmente en las mejores sucursales de Hotel Del Ángel con precios exclusivos y
                    confirmación instantánea.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/hotels">
                    <Button size="lg" className="gap-1.5">
                      <Search className="h-4 w-4" />
                      Buscar Sucursales
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline">
                      Crear Cuenta
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0">
                <Card className="p-1 shadow-lg">
                  <CardContent className="p-0 overflow-hidden rounded-lg">
                    <Tabs defaultValue="hotel">
                      <TabsList className="grid w-full grid-cols-1">
                        <TabsTrigger value="hotel">Reservar</TabsTrigger>
                      </TabsList>
                      <TabsContent value="hotel" className="p-4 space-y-4">
                        <div className="space-y-2">
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="¿A dónde vas?" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" type="date" placeholder="Llegada" />
                            </div>
                            <div className="relative">
                              <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" type="date" placeholder="Salida" />
                            </div>
                          </div>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="2 adultos, 0 niños" />
                          </div>
                        </div>
                        <Button className="w-full">Buscar</Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Nuestras Sucursales
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Descubre nuestras mejores opciones
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explora nuestra selección de sucursales premium con las mejores calificaciones y servicios exclusivos.
                </p>
              </div>
            </div>
            <FeaturedBranches />
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  ¿Por qué elegir Hotel Del Ángel?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ofrecemos la mejor experiencia de reserva con beneficios exclusivos para nuestros usuarios.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Métodos de Pago Flexibles</h3>
                <p className="text-muted-foreground">
                  Múltiples opciones de pago seguras y confiables para tu comodidad.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Disponibilidad en Tiempo Real</h3>
                <p className="text-muted-foreground">
                  Consulta la disponibilidad actualizada de habitaciones durante todo el año.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Cotizaciones y Facturación</h3>
                <p className="text-muted-foreground">
                  Genera cotizaciones en PDF y accede a tu facturación de manera sencilla.
                </p>
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
            <p className="text-sm text-muted-foreground">© 2025 Promotora Hotelera Del Ángel. Todos los derechos reservados.</p>
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
