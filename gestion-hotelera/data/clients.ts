import { RESERVATIONS_DETAIL, RESERVATIONS_LIST } from "./reservations";

export type ClientStatus = "Active" | "InHouse" | "Inactive";

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyTier: string;
  status: ClientStatus;
  totalStays: number;
  totalSpent: number;
  lastVisit: string | null;
  notes: string[];
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Construye la lista de clientes a partir del historial de reservaciones existente,
// agrupando por huésped para obtener una vista consolidada (CRM ligero).
function buildClientsFromReservations(): Client[] {
  const byGuest = new Map<string, Client>();

  Object.values(RESERVATIONS_DETAIL).forEach((reservation) => {
    const id = slugify(reservation.guest.name);
    const matchingSummary = RESERVATIONS_LIST.find((r) => r.id === reservation.id);
    const status: ClientStatus =
      reservation.status === "InHouse"
        ? "InHouse"
        : matchingSummary
          ? "Active"
          : "Inactive";

    const existing = byGuest.get(id);
    const stayTotal = reservation.payment.total ?? 0;
    const lastVisit = reservation.stay.checkOut;

    console.log(id)
    if (!existing) {
      byGuest.set(id, {
        id,
        name: reservation.guest.name,
        email: reservation.guest.email,
        phone: reservation.guest.phone,
        loyaltyTier: reservation.guest.loyalty.tier,
        status,
        totalStays: 1,
        totalSpent: stayTotal,
        lastVisit,
        notes: reservation.internalNotes.map((note) => note.text),
      });
    } else {
      existing.totalStays += 1;
      existing.totalSpent += stayTotal;
      existing.notes.push(...reservation.internalNotes.map((note) => note.text));
      if (status === "InHouse") existing.status = "InHouse";
      if (!existing.lastVisit || new Date(lastVisit) > new Date(existing.lastVisit)) {
        existing.lastVisit = lastVisit;
      }
    }
  });

  return Array.from(byGuest.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export const CLIENTS_LIST: Client[] = buildClientsFromReservations();

export function getClientById(id: string) {
  return CLIENTS_LIST.find((client) => client.id === id);
}

export function getClientReservations(clientName: string) {
  return Object.values(RESERVATIONS_DETAIL)
    .filter((reservation) => reservation.guest.name === clientName)
    .sort((a, b) => new Date(b.stay.checkIn).getTime() - new Date(a.stay.checkIn).getTime());
}
