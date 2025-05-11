import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin } from "lucide-react";
import { Usuario, FavoriteHotel } from "./types";
import { fetchFavoriteHotels } from "./utils";

interface FavoritesTabProps {
  user: Usuario | null;
  favoriteHotels: FavoriteHotel[];
  setFavoriteHotels: (hotels: FavoriteHotel[]) => void;
  error: string | null;
  isLoading: boolean;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export default function FavoritesTab({
  user,
  favoriteHotels,
  setFavoriteHotels,
  error,
  isLoading,
  setError,
  setIsLoading,
}: FavoritesTabProps) {
  useEffect(() => {
    if (user?.huesped?.Id_Huesped) {
      fetchFavoriteHotels(user.huesped.Id_Huesped, setFavoriteHotels, setError, setIsLoading);
    }
  }, [user?.huesped?.Id_Huesped, setFavoriteHotels, setError, setIsLoading]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sucursales Favoritas</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!user?.huesped ? (
        <Alert>
          <AlertTitle>Perfil incompleto</AlertTitle>
          <AlertDescription>
            Por favor, completa tu perfil en la pestaña "Perfil" para ver tus sucursales favoritas.
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <p>Cargando hoteles favoritos...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {favoriteHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={hotel.image || "/placeholder.svg"}
                  alt={hotel.name}
                  width={500}
                  height={300}
                  className="object-cover w-full h-48"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{hotel.name}</h3>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hotel.location}
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
      )}
    </div>
  );
}