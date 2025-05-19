import axios from 'axios';
import { Branch, Hotel } from '@/types/hotel';

// Configura la URL base desde la variable de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Datos estáticos para amenidades
const STATIC_AMENITIES = [
  { name: 'WiFi gratis', icon: require('lucide-react').Wifi },
  { name: 'Estacio|namiento', icon: require('lucide-react').Bed },
  { name: 'Aire acondicionado', icon: require('lucide-react').Bed },
  { name: 'Restaurante', icon: require('lucide-react').Bed },
];

// Función para obtener todos los hoteles
export const getHoteles = async (): Promise<Branch[]> => {
  try {
    const response = await axios.get<Hotel[]>(`${API_URL}/api/hoteles`);
    return response.data.map((hotel) => ({
      id: hotel.Id_Hotel,
      name: hotel.Nombre,
      location: `${hotel.Direccion}, ${hotel.Ciudad?.Ciudad}, ${hotel.Ciudad?.Estado}, ${hotel.Ciudad?.Pais}`,
      description: 'Descripción genérica del hotel.',
      tags: hotel.Tags || [],
      rating: 5.0,
      reviews: 1,
      price: 850,
      discount: 0,
      image: '/images/logo.png',
      images: ['/images/logo.png'],
      amenities: STATIC_AMENITIES,
      rooms: [],
    }));
  } catch (error) {
    console.error('Error fetching hoteles:', error);
    throw new Error('No se pudieron cargar los hoteles');
  }
};

// Función para obtener un hotel por ID
export const getHotelById = async (id: string): Promise<Branch> => {
  try {
    // Obtener datos del hotel
    const response = await axios.get<Hotel>(`${API_URL}/api/hoteles/${id}`);
    const hotel = response.data;

    // Obtener tipos de habitación del hotel
    const tiposHabitacionResponse = await axios.get(`${API_URL}/api/tipoHabitaciones?FK_Hotel=${id}`);
    const tiposHabitacion = tiposHabitacionResponse.data;

    return {
      id: hotel.Id_Hotel,
      name: hotel.Nombre,
      location: `${hotel.Direccion}, ${hotel.Ciudad?.Ciudad}, ${hotel.Ciudad?.Estado}, ${hotel.Ciudad?.Pais}`,
      description: hotel.Detalle || 'Descripción genérica del hotel.',
      rating: 5.0,
      reviews: 1,
      price: 850,
      discount: 5,
      image: '/images/logo.png',
      images: [
        '/images/logo.png',
        '/images/hotels/balandra.jpg',
        '/images/hotels/tecolote.jpg',
      ],
      amenities: STATIC_AMENITIES,
      tags: hotel.Tags || [],
      rooms: tiposHabitacion.map((tipo: any) => ({
        id: tipo.ID_CAT_TIPO_Habitacion,
        name: tipo.Tipo || 'Habitación Estándar',
        description: tipo.Descripcion || 'Habitación cómoda con servicios básicos',
        price: parseFloat(tipo.Tarifa) || 1000,
        capacity: (tipo.Cant_Adultos || 2) + (tipo.Cant_Niños || 0),
        amenities: hotel.Tags || [],
        image: '/images/logo.png',
      })),
    };
  } catch (error) {
    console.error(`Error fetching hotel with id ${id}:`, error);
    throw new Error('No se pudo cargar el hotel');
  }
};