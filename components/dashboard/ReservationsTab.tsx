import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Calendar, Users } from "lucide-react";
import { Usuario, Reservation } from "./types";
import { fetchReservations } from "./utils";

interface ReservationsTabProps {
  user: Usuario | null;
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  error: string | null;
  isLoading: boolean;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export default function ReservationsTab({
  user,
  reservations,
  setReservations,
  error,
  isLoading,
  setError,
  setIsLoading,
}: ReservationsTabProps) {
  useEffect(() => {
    if (user?.huesped?.Id_Huesped) {
      fetchReservations(user.huesped.Id_Huesped, setReservations, setError, setIsLoading);
    }
  }, [user?.huesped?.Id_Huesped, setReservations, setError, setIsLoading]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmada</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Próxima</Badge>;
      case "completed":
        return <Badge variant="outline">Completada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Reservaciones</h1>
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
            Por favor, completa tu perfil en la pestaña "Perfil" para ver tus reservaciones.
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <p>Cargando reservas...</p>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="completed">Completadas</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-40 md:h-auto">
                    <Image
                      src={reservation.hotel.image || "/placeholder.svg"}
                      alt={reservation.hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold">{reservation.hotel.name}</h3>
                          {getStatusBadge(reservation.status)}
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {reservation.hotel.location}
                        </div>
                        <div className="mt-4 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {reservation.checkIn.toLocaleDateString()} -{" "}
                              {reservation.checkOut.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.room.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total pagado</p>
                        <p className="text-xl font-bold">${reservation.totalAmount} MXN</p>
                        <div className="flex gap-2 mt-4 justify-end">
                          <Link href={`/reservation/${reservation.id}`}>
                            <Button size="sm">Ver Detalles</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {reservations
              .filter((res) => res.status === "confirmed" || res.status === "upcoming")
              .map((reservation) => (
                <Card key={reservation.id}>
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-40 md:h-auto">
                      <Image
                        src={reservation.hotel.image || "/placeholder.svg"}
                        alt={reservation.hotel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold">{reservation.hotel.name}</h3>
                            {getStatusBadge(reservation.status)}
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {reservation.hotel.location}
                          </div>
                          <div className="mt-4 space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {reservation.checkIn.toLocaleDateString()} -{" "}
                                {reservation.checkOut.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{reservation.room.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total pagado</p>
                          <p className="text-xl font-bold">${reservation.totalAmount} MXN</p>
                          <div className="flex gap-2 mt-4 justify-end">
                            <Button variant="outline" size="sm" disabled>
                              Modificar
                            </Button>
                            <Link href={`/reservation/${reservation.id}`}>
                              <Button size="sm">Ver Detalles</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {reservations
              .filter((res) => res.status === "completed")
              .map((reservation) => (
                <Card key={reservation.id}>
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-40 md:h-auto">
                      <Image
                        src={reservation.hotel.image || "/placeholder.svg"}
                        alt={reservation.hotel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold">{reservation.hotel.name}</h3>
                            {getStatusBadge(reservation.status)}
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {reservation.hotel.location}
                          </div>
                          <div className="mt-4 space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {reservation.checkIn.toLocaleDateString()} -{" "}
                                {reservation.checkOut.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{reservation.room.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total pagado</p>
                          <p className="text-xl font-bold">${reservation.totalAmount} MXN</p>
                          <div className="flex gap-2 mt-4 justify-end">
                            <Link href={`/reservation/${reservation.id}`}>
                              <Button size="sm">Ver Detalles</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}