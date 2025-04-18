"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for featured branches
const featuredBranches = [
  {
    id: 1,
    name: "Hotel Del Angel Centro",
    location: "La Paz, México",
    image: "/images/logo.png",
    price: 850,
    rating: 5.0,
    discount: 10,
    tags: ["Centro Historico", "Comodidad"],
  },
  {
    id: 123,
    name: "Hotel Del Angel Abasolo",
    location: "Abasolo e/Algodo, Col. Pueblo Nuevo C.P. 23060, La Paz, México", 
    image: "/images/logo.png",
    price: 1200,
    rating: 5.0,
    discount: 0,
    tags: ["Sucursal mas grande", "Restaurante"],
  },
  {
    id: 3,
    name: "Hotel Del Angel Cabo",
    location: "Cabo San Lucas, México",
    image: "/images/logo.png",
    price: 1200,
    rating: 5.0,
    discount: 0,
    tags: ["Centro Historico", "Lujo"],
  },
]

export default function FeaturedBranches() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  return (
    <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-4">
      {featuredBranches.map((branch) => (
        <Card key={branch.id} className="overflow-hidden">
          <div className="relative">
            <Image
              src={branch.image || "/placeholder.svg"}
              alt={branch.name}
              width={500}
              height={300}
              className="object-cover w-full h-48"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
              onClick={() => toggleFavorite(branch.id)}
            >
              <Heart className={`h-5 w-5 ${favorites.includes(branch.id) ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Añadir a favoritos</span>
            </Button>
            {branch.discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{branch.discount}% DESCUENTO</Badge>
            )}
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{branch.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium ml-1">{branch.rating}</span>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {branch.location}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {branch.tags.map((tag) => (
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
                ${branch.price} <span className="text-sm font-normal">MXN/noche</span>
              </p>
            </div>
            <Link href={`/hotels/${branch.id}`}>
              <Button size="sm">Ver Detalles</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
