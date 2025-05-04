"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { getHoteles } from "@/lib/api/hoteles";
import { Branch } from "@/types/hotel";

export default function FeaturedBranches() {
  const [hoteles, setHoteles] = useState<Branch[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener hoteles al montar el componente
  useEffect(() => {
    const fetchHoteles = async () => {
      try {
        setIsLoading(true);
        const data = await getHoteles();
        setHoteles(data);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar los hoteles. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoteles();
  }, []);

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Mostrar skeleton mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="w-full h-48" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Mostrar mensaje de error si falla la petición
  if (error) {
    return (
      <div className="pt-8 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-4">
      {hoteles.map((branch) => (
        <Card key={branch.id} className="overflow-hidden">
          <div className="relative">
            <Image
              src={branch.image || "/images/logo.png"}
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
              {branch.tags?.map((tag, index) => (
                <Badge key={`${branch.id}-${tag}-${index}`} variant="secondary" className="text-xs">
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
  );
}