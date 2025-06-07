"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Bed,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Heart,
  MapPin,
  Minus,
  Plus,
  Share,
  Star,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { getHotelById } from "@/lib/api/hoteles";
import { Branch } from "@/types/hotel";

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setIsLoading(true);
        const data = await getHotelById(params.id as string);
        setHotel(data);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar el hotel. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotel();
  }, [params.id]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (hotel?.images?.length || 1) - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === (hotel?.images?.length || 1) - 1 ? 0 : prev + 1));
  };

  const handleGuestChange = (type: "adults" | "children", operation: "increase" | "decrease") => {
    setGuests((prev) => {
      const newValue = operation === "increase" ? prev[type] + 1 : prev[type] - 1;
      if (type === "adults" && (newValue < 1 || newValue > 10)) return prev;
      if (type === "children" && (newValue < 0 || newValue > 6)) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const handleRoomSelect = (roomId: number) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
  };

  const handleReservation = () => {
    if (!selectedRoom) return;
    router.push(`/checkout?hotelId=${params.id}&roomId=${selectedRoom}&date=${date?.toISOString()}`);
  };

  // Calcular desglose de impuestos para la tarjeta de reserva
  const getPriceBreakdown = () => {
    if (!selectedRoom || !hotel) {
      return { basePrice: 0, iva: 0, ish: 0, total: 0 };
    }
    const totalPrice = hotel.rooms.find((r) => r.id === selectedRoom)?.price || 0;
    // Precio base = totalPrice / (1 + 0.16 + 0.04)
    const basePrice = totalPrice / 1.2;
    // IVA = basePrice * 16%
    const iva = basePrice * 0.16;
    // ISH = basePrice * 4%
    const ish = basePrice * 0.04;
    return {
      basePrice: Number(basePrice.toFixed(2)),
      iva: Number(iva.toFixed(2)),
      ish: Number(ish.toFixed(2)),
      total: Number(totalPrice.toFixed(2)),
    };
  };

  const { basePrice, iva, ish, total } = getPriceBreakdown();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-96 w-full rounded-lg mb-6" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="md:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8 text-center">
          <p className="text-red-500">{error || "Hotel no encontrado"}</p>
          <Button onClick={() => router.push("/hotels")} className="mt-4">
            Volver a Hoteles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <div className="mb-6">
          <Link href="/hotels" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a la lista de sucursales
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{hotel.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium ml-1">{hotel.rating}</span>
                  <span className="text-sm text-muted-foreground ml-1">({hotel.reviews} reseñas)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hotel.location}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                <span className="sr-only">Añadir a favoritos</span>
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-5 w-5" />
                <span className="sr-only">Compartir</span>
              </Button>
              <Button>Reservar Ahora</Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="relative h-[300px] md:h-[500px] overflow-hidden rounded-lg">
            <Image
              src={hotel.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${hotel.name} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Imagen anterior</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Imagen siguiente</span>
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {hotel.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <span className="sr-only">Imagen {index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Hotel Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Acerca del hotel</h2>
              <p className="text-muted-foreground">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Servicios</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <amenity.icon className="h-5 w-5 text-primary" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Habitaciones disponibles</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <Card
                    key={room.id}
                    className={`overflow-hidden ${selectedRoom === room.id ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/3 h-48">
                        <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold">{room.name}</h3>
                            <p className="text-muted-foreground">{room.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">Hasta {room.capacity} personas</Badge>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-1">Servicios de la habitación</h4>
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {room.amenities.map((amenity, index) => (
                                  <div key={index} className="flex items-center text-sm">
                                    <Check className="h-3 w-3 mr-1 text-primary" />
                                    {amenity}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Precio por noche</p>
                            <p className="text-2xl font-bold">${room.price} MXN</p>
                            <Button
                              className="mt-4"
                              variant={selectedRoom === room.id ? "default" : "outline"}
                              onClick={() => handleRoomSelect(room.id)}
                            >
                              {selectedRoom === room.id ? "Seleccionada" : "Seleccionar"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(hotel.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{hotel.rating}</span>
                <span className="text-muted-foreground">({hotel.reviews} reseñas)</span>
              </div>
              <Button variant="outline" className="w-full">
                Ver todas las reseñas
              </Button>
            </div>
          </div>

          {/* Booking Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Reserva tu estancia</CardTitle>
                <CardDescription>Selecciona fechas y habitación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Fecha de llegada</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString() : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Huéspedes</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Adultos</Label>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleGuestChange("adults", "decrease")}
                          disabled={guests.adults <= 1}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Reducir</span>
                        </Button>
                        <span className="w-12 text-center">{guests.adults}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleGuestChange("adults", "increase")}
                          disabled={guests.adults >= 10}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Aumentar</span>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Niños</Label>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleGuestChange("children", "decrease")}
                          disabled={guests.children <= 0}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Reducir</span>
                        </Button>
                        <span className="w-12 text-center">{guests.children}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleGuestChange("children", "increase")}
                          disabled={guests.children >= 6}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Aumentar</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Precio por noche</span>
                    <span>${basePrice} MXN</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>IVA (16%)</span>
                    <span>${iva} MXN</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>ISH (4%)</span>
                    <span>${ish} MXN</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total} MXN</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={!selectedRoom || !date} onClick={handleReservation}>
                  Reservar Ahora
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
