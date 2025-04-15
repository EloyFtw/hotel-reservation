"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Filter, Heart, MapPin, Search, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for branches
const branchesList = [
  {
    id: 1,
    name: "Hotel Del Angel Centro",
    location: "La Paz, México",
    image: "/placeholder.svg?height=300&width=500",
    price: 850,
    rating: 5.0,
    discount: 10,
    tags: ["Centro Historico", "Comodidad"],
  },
  {
    id: 2,
    name: "Hotel Del Angel Abasolo",
    location: "Abasolo e/Algodo, Col. Pueblo Nuevo C.P. 23060, La Paz, México", 
    image: "/placeholder.svg?height=300&width=500",
    price: 1200,
    rating: 5.0,
    discount: 0,
    tags: ["Sucursal mas grande", "Restaurante"],
  },
  {
    id: 123,
    name: "Hotel Del Angel Cabo",
    location: "Cabo San Lucas, México",
    image: "/placeholder.svg?height=300&width=500",
    price: 1200,
    rating: 5.0,
    discount: 0,
    tags: ["Centro Historico", "Lujo"],
  }
]

export default function HotelsPage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
  }

  const filteredHotels = branchesList.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
        hotel.price >= priceRange[0] &&
        hotel.price <= priceRange[1]),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Sucursales</h1>
          <p className="text-muted-foreground">Encuentra la sucursal perfecta para tu próxima estancia</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-20 border rounded-lg p-4 space-y-6">
              <div>
                <h3 className="font-medium mb-3">Precio por noche</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 5000]}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>${priceRange[0]} MXN</span>
                    <span>${priceRange[1]} MXN</span>
                  </div>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="amenities">
                  <AccordionTrigger className="py-2">Servicios</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="wifi" />
                        <label htmlFor="wifi" className="text-sm">
                          WiFi gratis
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pool" />
                        <label htmlFor="pool" className="text-sm">
                          Piscina
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="breakfast" />
                        <label htmlFor="breakfast" className="text-sm">
                          Desayuno incluido
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="parking" />
                        <label htmlFor="parking" className="text-sm">
                          Estacionamiento
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="spa" />
                        <label htmlFor="spa" className="text-sm">
                          Spa
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rating">
                  <AccordionTrigger className="py-2">Calificación</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="5stars" />
                        <label htmlFor="5stars" className="text-sm flex items-center">
                          <span className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="4stars" />
                        <label htmlFor="4stars" className="text-sm flex items-center">
                          <span className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="h-4 w-4 text-muted-foreground" />
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="3stars" />
                        <label htmlFor="3stars" className="text-sm flex items-center">
                          <span className="flex">
                            {[...Array(3)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            {[...Array(2)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-muted-foreground" />
                            ))}
                          </span>
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="property-type">
                  <AccordionTrigger className="py-2">Tipo de propiedad</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="hotel" />
                        <label htmlFor="hotel" className="text-sm">
                          Hotel
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="resort" />
                        <label htmlFor="resort" className="text-sm">
                          Resort
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="apartment" />
                        <label htmlFor="apartment" className="text-sm">
                          Apartamento
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="villa" />
                        <label htmlFor="villa" className="text-sm">
                          Villa
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button className="w-full" variant="outline">
                Aplicar filtros
              </Button>
            </div>
          </div>

          {/* Mobile Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden mb-4 gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>Ajusta los filtros para encontrar el hotel perfecto</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Precio por noche</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 5000]}
                      max={5000}
                      step={100}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>${priceRange[0]} MXN</span>
                      <span>${priceRange[1]} MXN</span>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="amenities">
                    <AccordionTrigger className="py-2">Servicios</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="wifi-mobile" />
                          <label htmlFor="wifi-mobile" className="text-sm">
                            WiFi gratis
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="pool-mobile" />
                          <label htmlFor="pool-mobile" className="text-sm">
                            Piscina
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="breakfast-mobile" />
                          <label htmlFor="breakfast-mobile" className="text-sm">
                            Desayuno incluido
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="parking-mobile" />
                          <label htmlFor="parking-mobile" className="text-sm">
                            Estacionamiento
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="spa-mobile" />
                          <label htmlFor="spa-mobile" className="text-sm">
                            Spa
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button className="w-full">Aplicar filtros</Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ubicación"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="recommended">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recomendados</SelectItem>
                  <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                  <SelectItem value="rating">Mejor calificados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src={hotel.image || "/placeholder.svg"}
                      alt={hotel.name}
                      width={500}
                      height={300}
                      className="object-cover w-full h-48"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
                      onClick={() => toggleFavorite(hotel.id)}
                    >
                      <Heart className={`h-5 w-5 ${favorites.includes(hotel.id) ? "fill-red-500 text-red-500" : ""}`} />
                      <span className="sr-only">Añadir a favoritos</span>
                    </Button>
                    {hotel.discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                        {hotel.discount}% DESCUENTO
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{hotel.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">{hotel.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hotel.location}
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {hotel.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Desde</p>
                      <p className="text-lg font-bold">
                        ${hotel.price} <span className="text-sm font-normal">MXN/noche</span>
                      </p>
                    </div>
                    <Link href={`/hotels/${hotel.id}`}>
                      <Button size="sm">Ver Detalles</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No se encontraron sucursales</h3>
                <p className="text-muted-foreground">Intenta con otros filtros o términos de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
