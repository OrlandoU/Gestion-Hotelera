import { RESERVATIONS_LIST } from "./reservations";

export type RoomStatus = "Available" | "Occupied" | "Dirty" | "Maintenance";

export type Room = {
  id: string;
  number: string;
  type: string;
  floor: number;
  status: RoomStatus;
  capacity: string;
  price: number;
  amenities: string[];
  view: string;
  
};

export const ROOMS_LIST: Room[] = [
  {
    id: "101",
    number: "101",
    type: "Suite King",
    floor: 1,
    status: "Occupied",
    capacity: "2 adultos",
    price: 250,
    amenities: ["Vista al jardín", "Cama King", "Wi-Fi incluido"],
    view: "Jardín",
  },
  {
    id: "102",
    number: "102",
    type: "Suite Queen",
    floor: 1,
    status: "Available",
    capacity: "2 adultos",
    price: 180,
    amenities: ["Vista al patio", "Cama Queen", "Smart TV"],
    view: "Patio",
  },
  {
    id: "103",
    number: "103",
    type: "Suite Imperial",
    floor: 1,
    status: "Maintenance",
    capacity: "2 adultos",
    price: 320,
    amenities: ["Terraza privada", "Mini bar", "Aire acondicionado"],
    view: "Terraza",
  },
  {
    id: "104",
    number: "104",
    type: "Habitación Deluxe",
    floor: 2,
    status: "Dirty",
    capacity: "2 adultos",
    price: 150,
    amenities: ["Cama Queen", "Escritorio", "Caja fuerte"],
    view: "Piscina",
  },
  {
    id: "105",
    number: "105",
    type: "Habitación Twin",
    floor: 2,
    status: "Available",
    capacity: "2 adultos",
    price: 140,
    amenities: ["2 camas individuales", "Wi-Fi", "Baño privado"],
    view: "Ciudad",
  },
];

export function getRoomCurrentReservation(roomId: string) {
  return RESERVATIONS_LIST.find((reservation) =>
    reservation.roomId === roomId &&
    ["InHouse", "Confirmed", "Pending"].includes(reservation.status ?? "")
  );
}

export function getRoomNextReservation(roomId: string) {
  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return RESERVATIONS_LIST
    .filter((reservation) => reservation.roomId === roomId)
    .filter((reservation) => ["Pending", "Confirmed"].includes(reservation.status ?? ""))
    .map((reservation) => ({
      ...reservation,
      startDate: new Date(reservation.start),
    }))
    .filter((reservation) => reservation.startDate >= normalizedToday)
    .sort((left, right) => left.startDate.getTime() - right.startDate.getTime())[0];
}

export function getRoomHistory(roomId: string) {
  return RESERVATIONS_LIST
    .filter((reservation) => reservation.roomId === roomId)
    .sort((left, right) => new Date(right.start).getTime() - new Date(left.start).getTime());
}
