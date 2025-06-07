'use client';

import { Usuario, Reservation, FavoriteHotel, Ciudad, Reservacion, Persona, FormData } from "./types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getToken = () => localStorage.getItem("token");

export const validateForm = (formData: FormData) => {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (!formData.Nombre.trim()) {
    errors.Nombre = "El nombre es obligatorio";
  } else if (!/^[A-Za-z\s]+$/.test(formData.Nombre)) {
    errors.Nombre = "El nombre solo puede contener letras";
  }
  if (!formData.Apellido_Paterno.trim()) {
    errors.Apellido_Paterno = "El apellido paterno es obligatorio";
  } else if (!/^[A-Za-z\s]+$/.test(formData.Apellido_Paterno)) {
    errors.Apellido_Paterno = "El apellido paterno solo puede contener letras";
  }
  if (!formData.Apellido_Materno.trim()) {
    errors.Apellido_Materno = "El apellido materno es obligatorio";
  } else if (!/^[A-Za-z\s]+$/.test(formData.Apellido_Materno)) {
    errors.Apellido_Materno = "El apellido materno solo puede contener letras";
  }
  if (!formData.Fecha_Nacimiento) {
    errors.Fecha_Nacimiento = "La fecha de nacimiento es obligatoria";
  } else {
    const birthDate = new Date(formData.Fecha_Nacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      errors.Fecha_Nacimiento = "Debes ser mayor de 18 años";
    }
  }
  if (!formData.Sex) {
    errors.Sex = "El sexo es obligatorio";
  }
  if (!formData.Correo) {
    errors.Correo = "El correo es obligatorio";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Correo)) {
    errors.Correo = "El correo no es válido";
  }
  if (!formData.Pais) {
    errors.Pais = "El país es obligatorio";
  }
  if (!formData.Estado) {
    errors.Estado = "El estado es obligatorio";
  }
  if (!formData.FK_Ciudad) {
    errors.FK_Ciudad = "La ciudad es obligatoria";
  }
  if (formData.Celular && !/^\d{10}$/.test(formData.Celular)) {
    errors.Celular = "El celular debe tener 10 dígitos";
  }
  return errors;
};

export const fetchUser = async (
  setUser: (user: Usuario | null) => void,
  setFormData: (data: FormData) => void,
  setCiudades: (ciudades: Ciudad[]) => void,
  fetchEstados: (Pais: string) => Promise<void>,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  setError(null);
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_BASE_URL}/api/usuarios/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    const userData: Usuario = await response.json();
    setUser(userData);
    if (userData.huesped?.persona) {
      const ciudadResponse = await fetch(
        `${API_BASE_URL}/api/lugares/ciudades?Pais=${encodeURIComponent(
          userData.huesped.persona.Ciudad?.Pais || ""
        )}&Estado=${encodeURIComponent(userData.huesped.persona.Ciudad?.Estado || "")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!ciudadResponse.ok) {
        throw new Error(`Error ${ciudadResponse.status}: ${await ciudadResponse.text()}`);
      }
      const ciudadesData: Ciudad[] = await ciudadResponse.json();
      setCiudades(ciudadesData);
      setFormData({
        Nombre: userData.huesped.persona.Nombre || "",
        SegundoNombre: userData.huesped.persona.SegundoNombre || "",
        Apellido_Paterno: userData.huesped.persona.Apellido_Paterno || "",
        Apellido_Materno: userData.huesped.persona.Apellido_Materno || "",
        Fecha_Nacimiento: userData.huesped.persona.Fecha_Nacimiento || "",
        Edad: userData.huesped.persona.Edad?.toString() || "",
        Sex: userData.huesped.persona.Sex || "",
        Celular: userData.huesped.persona.Celular || "",
        Correo: userData.huesped.persona.Correo || "",
        Direccion: userData.huesped.persona.Direccion || "",
        Pais: userData.huesped.persona.Ciudad?.Pais || "",
        Estado: userData.huesped.persona.Ciudad?.Estado || "",
        FK_Ciudad: userData.huesped.persona.FK_Ciudad?.toString() || "",
        Calle: userData.huesped.persona.Direccion ? userData.huesped.persona.Direccion.split(",")[0]?.toString() || "" : "",
        Colonia: userData.huesped.persona.Direccion ? userData.huesped.persona.Direccion.split(",")[1]?.toString() || "" : "",
        CodigoPostal: userData.huesped.persona.Direccion ? userData.huesped.persona.Direccion.split(",")[2]?.toString() || "" : "",
        NumeroInterior: userData.huesped.persona.Direccion ? userData.huesped.persona.Direccion.split(",")[3]?.toString() || "" : "",
        NumeroExterior: userData.huesped.persona.Direccion ? userData.huesped.persona.Direccion.split(",")[4]?.toString() || "" : "",
      });      
    }
  } catch (err: any) {
    console.error("Error al cargar usuario:", err);
    setError(err.message || "Error al cargar los datos del usuario");
  } finally {
    setIsLoading(false);
  }
};

export const fetchReservations = async (
  huespedId: number,
  setReservations: (reservations: Reservation[]) => void,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  setError(null);
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const resResponse = await fetch(`${API_BASE_URL}/api/reservaciones/huesped/${huespedId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!resResponse.ok) {
      throw new Error(`Error ${resResponse.status}: ${await resResponse.text()}`);
    }
    const reservaciones: Reservacion[] = await resResponse.json();
    const mappedReservations: Reservation[] = reservaciones.map((res) => {
      const checkIn = new Date(res.Fecha);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + 1); // Estimación, ya que no hay checkOut en Reservacion
      return {
        id: res.ID_Reservacion.toString(),
        status: mapStatus(res.FK_Estatus, res.Estatus.Estatus),
        checkIn,
        checkOut,
        hotel: {
          name: res.Hotel.Nombre,
          location: res.Hotel.Direccion,
          image: res.Hotel.URL_Imagen_Hotel || "/images/logo.png",
        },
        room: {
          name: "Habitación Estándar", // Placeholder, ya que no hay datos de habitación en Reservacion
          price: 0, // Placeholder
        },
        totalAmount: parseFloat(res.Monto_Usado) || 0,
      };
    });
    setReservations(mappedReservations);
  } catch (err: any) {
    console.error("Error al cargar reservas:", err);
    setError(err.message || "Error al cargar las reservas");
  } finally {
    setIsLoading(false);
  }
};

export const fetchFavoriteHotels = async (
  huespedId: number,
  setFavoriteHotels: (hotels: FavoriteHotel[]) => void,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  setError(null);
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_BASE_URL}/api/favoritos/${huespedId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    const favoritos: FavoriteHotel[] = await response.json();
    setFavoriteHotels(favoritos);
  } catch (err: any) {
    console.error("Error al cargar hoteles favoritos:", err);
    setError(err.message || "Error al cargar los hoteles favoritos");
  } finally {
    setIsLoading(false);
  }
};

export const handleLogout = async (router: AppRouterInstance) => {
  try {
    localStorage.removeItem('token');
    router.push('/login');
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  }
};

export const fetchPaises = async (
  setPaises: (paises: string[]) => void,
  setError: (error: string | null) => void
) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_BASE_URL}/api/lugares/paises`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    const paisesData: string[] = await response.json();
    setPaises(paisesData);
  } catch (err: any) {
    console.error("Error al cargar países:", err);
    setError(err.message || "Error al cargar los países");
  }
};

export const fetchEstados = async (
  Pais: string,
  setEstados: (estados: string[]) => void,
  setFormData: (data: FormData) => void,
  formData: FormData,
  setCiudades: (ciudades: Ciudad[]) => void,
  setError: (error: string | null) => void
) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(
      `${API_BASE_URL}/api/lugares/estados?Pais=${encodeURIComponent(Pais)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    const estadosData: string[] = await response.json();
    setEstados(estadosData);
    if (formData.Pais !== Pais) {
      setFormData({ ...formData, Pais, Estado: "", FK_Ciudad: "" });
      setCiudades([]);
    }
  } catch (err: any) {
    console.error("Error al cargar estados:", err);
    setError(err.message || "Error al cargar los estados");
  }
};

export const fetchCiudades = async (
  Pais: string,
  Estado: string,
  setCiudades: (ciudades: Ciudad[]) => void,
  setFormData: (data: FormData) => void,
  formData: FormData,
  setError: (error: string | null) => void
) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(
      `${API_BASE_URL}/api/lugares/ciudades?Pais=${encodeURIComponent(
        Pais
      )}&Estado=${encodeURIComponent(Estado)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    const ciudadesData: Ciudad[] = await response.json();
    setCiudades(ciudadesData);
    if (formData.Estado !== Estado) {
      setFormData({ ...formData, Estado, FK_Ciudad: "" });
    }
  } catch (err: any) {
    console.error("Error al cargar ciudades:", err);
    setError(err.message || "Error al cargar las ciudades");
  }
};

export const mapStatus = (estatusId: number, estatus: string): string => {
  switch (estatusId) {
    case 3:
      return "confirmed"; // FK_Estatus: 3 es "Confirmado"
    case 4:
      return "completed"; // FK_Estatus: 4 es "In-activo" (Completado/Hospedado)
    case 7:
      return "cancelled"; // FK_Estatus: 7 es "Cancelado"
    default:
      return estatus.toLowerCase(); // Por si hay otros estatus no mapeados
  }
};