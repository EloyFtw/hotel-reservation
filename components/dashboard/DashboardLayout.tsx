import { useState, useEffect } from "react";
import DashboardNav from "./DashboardNav";
import DashboardSidebar from "./DashboardSidebar";
import ReservationsTab from "./ReservationsTab";
import FavoritesTab from "./FavoritesTab";
import ProfileTab from "./ProfileTab";
import BillingTab from "./BillingTab";
import { Usuario, Reservation, FavoriteHotel, Ciudad, FormData } from "./types";
import { fetchUser } from "./utils";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("reservations");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [favoriteHotels, setFavoriteHotels] = useState<FavoriteHotel[]>([]);
  const [user, setUser] = useState<Usuario | null>(null);
  const [paises, setPaises] = useState<string[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [formData, setFormData] = useState<FormData>({
    Nombre: "",
    SegundoNombre: "",
    Apellido_Paterno: "",
    Apellido_Materno: "",
    Fecha_Nacimiento: "",
    Edad: "",
    Sex: "",
    Celular: "",
    Correo: "",
    Direccion: "",
    Pais: "",
    Estado: "",
    FK_Ciudad: "",
    Calle: "",
    Colonia: "",
    CodigoPostal: "",
    NumeroInterior: "",
    NumeroExterior: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUser(setUser, setFormData, setCiudades, async (Pais: string) => {
      // Implementar fetchEstados aquí si es necesario
    }, setError, setIsLoading);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav setActiveTab={setActiveTab} />
      <div className="container py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <DashboardSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1">
            {activeTab === "reservations" && (
              <ReservationsTab
                user={user}
                reservations={reservations}
                setReservations={setReservations}
                error={error}
                isLoading={isLoading}
                setError={setError}
                setIsLoading={setIsLoading}
              />
            )}
            {activeTab === "favorites" && (
              <FavoritesTab
                user={user}
                favoriteHotels={favoriteHotels}
                setFavoriteHotels={setFavoriteHotels}
                error={error}
                isLoading={isLoading}
                setError={setError}
                setIsLoading={setIsLoading}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                user={user}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                paises={paises}
                setPaises={setPaises}
                estados={estados}
                setEstados={setEstados}
                ciudades={ciudades}
                setCiudades={setCiudades}
                error={error}
                isLoading={isLoading}
                setError={setError}
                setIsLoading={setIsLoading}
              />
            )}
            {activeTab === "billing" && <BillingTab />}
          </div>
        </div>
      </div>
    </div>
  );
}