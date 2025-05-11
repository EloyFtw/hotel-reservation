import { LucideIcon } from "lucide-react";

export interface Huesped {
  Id_Huesped: number;
  FK_Persona: number;
  persona: Persona;
}

export interface Hotel {
  Id_Hotel: number;
  Nombre: string;
  Direccion: string;
  URL_Imagen_Hotel?: string | null;
}

export interface Habitacion {
  ID_Habitacion: number;
  Numero: string;
  FK_Hotel: number;
}

export interface Hospedaje {
  ID_Hospedaje: number;
  FK_Huesped: number;
  FK_Habitacion: number;
  CostoNoche: string;
  CostoTotal: string;
  Check_in: string;
  Check_out: string | null;
  FK_Reservacion: number | null;
  Habitacion: Habitacion;
  Huesped: Huesped;
  Estatus: { Id_Estatus: number; Estatus: string };
}

export interface Reservacion {
  ID_Reservacion: number;
  FK_Huesped: number;
  FK_Hotel: number;
  HoraDeLlegada: string;
  Fecha: string;
  FK_Estatus: number;
  Monto_Usado: string;
  Hotel: Hotel;
  Huesped: Huesped;
  Estatus: { Id_Estatus: number; Estatus: string };
}

export interface Ciudad {
  ID_Ciudad: number;
  Ciudad: string;
  Estado: string;
  Pais: string;
}

export interface Persona {
  Id_Persona: number;
  Nombre: string;
  SegundoNombre?: string;
  Apellido_Paterno: string;
  Apellido_Materno?: string;
  Fecha_Nacimiento: string;
  Edad: number;
  Sex: string;
  Celular?: string;
  Correo: string;
  Direccion?: string;
  FK_Ciudad: number;
  Ciudad?: Ciudad;
}

export interface Usuario {
  Id_Usuario: number;
  Nombre_Usuario: string;
  Mail?: string;
  huesped?: Huesped | null;
}

export interface Reservation {
  id: string;
  status: string;
  checkIn: Date;
  checkOut: Date;
  hotel: {
    name: string;
    location: string;
    image?: string;
  };
  room: {
    name: string;
    price: number;
  };
  totalAmount: number;
}

export interface FavoriteHotel {
  id: number;
  name: string;
  location: string;
  image?: string;
  price: number;
  rating: number;
}

export interface FormData {
  Nombre: string;
  SegundoNombre: string;
  Apellido_Paterno: string;
  Apellido_Materno: string;
  Fecha_Nacimiento: string;
  Edad: string;
  Sex: string;
  Celular: string;
  Correo: string;
  Direccion: string;
  Pais: string;
  Estado: string;
  FK_Ciudad: string;
   Calle: string;
  Colonia: string;
  CodigoPostal: string;
  NumeroInterior: string;
  NumeroExterior: string;
}

export interface NavItem {
  label: string;
  tab: string;
  icon: LucideIcon;
}