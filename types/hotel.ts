export interface Ciudad {
  ID_Ciudad: number;
  Ciudad: string; // Cambiado de Ciudad a Nombre
    Estado: string;
    Pais: string;
}

export interface Hotel {
  ID_Hotel: number;
  Nombre: string;
  FK_Ciudad: number;
  Ciudad?: Ciudad; // Opcional, en caso de que no se incluya,
  Direccion: string;
  Tags?: string[]; // Opcional, en caso de que no se incluya
}

export interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  image: string;
}

export interface Branch {
  id: number;
  name: string;
  location: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  discount: number;
  images?: string[];
  amenities: { name: string; icon: any }[];
  rooms?: Room[];
  image?: string;
  tags?: string[];
}