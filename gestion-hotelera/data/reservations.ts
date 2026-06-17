export const RESERVATIONS_LIST = [
    { id: "r1", roomId: "101", start: "2026-10-14", end: "2026-10-17", guest: "Eleanor Vance", status: "InHouse", icon: "credit_card" },
    { id: "r2", roomId: "102", start: "2026-10-12", end: "2026-10-13", guest: "Luke Crain", status: "Completed" },
    { id: "r3", roomId: "102", start: "2026-10-18", end: "2026-10-22", guest: "Theodora Crain", status: "Pending", icon: "warning" },
    { id: "r4", roomId: "103", start: "2026-10-15", end: "2026-10-20", guest: "Katherine Michelle", status: "Confirmed" },
];

export type ReservationDetail = {
    id: string;
    bookingId: string;
    guest: {
        name: string;
        email: string;
        phone: string;
        loyalty: { tier: string };
    };
    status: string;
    createdAt: string;
    stay: {
        checkIn: string;
        checkInTime: string;
        checkOut: string;
        checkOutTime: string;
        nights: number;
        specialRequests: string;
    };
    room: {
        number: string;
        type: string;
        name: string;
        ratePerNight: number;
    };
    party: { adults: number; children: number };
    internalNotes: { id: string; text: string; author: string; createdAt: string }[];
    payment: {
        amountPaid?: number;
        breakdown: { roomRate: number; taxesAndFees: number; extras: number };
        total: number;
        guaranteeMethod: string;
    };
    activity: { time: string; text: string }[];
    icon: string | null;
};

export const RESERVATIONS_DETAIL: Record<string, ReservationDetail> = {
    r1: {
        id: "r1",
        bookingId: "RES-88291A",
        guest: { name: "Eleanor Vance", email: "eleanor.vance@example.com", phone: "+504 9778-4680", loyalty: { tier: "Platinum" } },
        status: "InHouse",
        createdAt: "2026-10-12T14:30:00Z",
        stay: { checkIn: "2026-10-14", checkInTime: "15:00", checkOut: "2026-10-17", checkOutTime: "11:00", nights: 3, specialRequests: "Llegada tardía; almohadas sin plumas" },
        room: { number: "101", type: "Suite King", name: "Suite King", ratePerNight: 250 },
        party: { adults: 2, children: 0 },
        internalNotes: [{ id: "n1", text: "VIP — amenidad de bienvenida (champán y fruta). Notificado a housekeeping sobre alergia a las plumas.", author: "Sarah Jenkins, Front Desk Mgr", createdAt: "2026-10-13T09:41:00Z" }],
        payment: { amountPaid: 912.50, breakdown: { roomRate: 750, taxesAndFees: 112.5, extras: 50 }, total: 912.5, guaranteeMethod: "Visa terminada en 4242" },
        activity: [{ time: "2026-10-13T09:41:00Z", text: "Nota interna agregada sobre el estado VIP." }, { time: "2026-10-12T14:30:00Z", text: "Reservación creada por web directa." }],
        icon: "credit_card"
    },
    r2: {
        id: "r2",
        bookingId: "RES-88292B",
        guest: { name: "Luke Crain", email: "luke.crain@example.com", phone: "+504 9778-4680", loyalty: { tier: "Plata" } },
        status: "Completed",
        createdAt: "2026-10-11T10:15:00Z",
        stay: { checkIn: "2026-10-12", checkInTime: "15:00", checkOut: "2026-10-13", checkOutTime: "11:00", nights: 1, specialRequests: "" },
        room: { number: "102", type: "Suite Queen", name: "Suite Queen", ratePerNight: 180 },
        party: { adults: 1, children: 0 },
        internalNotes: [],
        payment: { amountPaid: 207, breakdown: { roomRate: 180, taxesAndFees: 27, extras: 0 }, total: 207, guaranteeMethod: "Mastercard terminada en 6789" },
        activity: [{ time: "2026-10-11T10:15:00Z", text: "Reservación creada por web directa." }],
        icon: null
    },
    r3: {
        id: "r3",
        bookingId: "RES-88293C",
        guest: { name: "Theodora Crain", email: "theodora.crain@example.com", phone: "+504 9778-4680", loyalty: { tier: "Oro" } },
        status: "Pending",
        createdAt: "2026-10-15T08:20:00Z",
        stay: { checkIn: "2026-10-18", checkInTime: "15:00", checkOut: "2026-10-22", checkOutTime: "11:00", nights: 4, specialRequests: "Pilas extra" },
        room: { number: "102", type: "Suite Queen", name: "Suite Queen", ratePerNight: 180 },
        party: { adults: 2, children: 1 },
        internalNotes: [{ id: "n1", text: "Solicitó traslado desde el aeropuerto", author: "Reservations", createdAt: "2026-10-16T12:00:00Z" }],
        payment: { amountPaid: 0, breakdown: { roomRate: 720, taxesAndFees: 108, extras: 150 }, total: 978, guaranteeMethod: "Amex terminada en 1111" },
        activity: [{ time: "2026-10-16T12:00:00Z", text: "Se agregó traslado desde el aeropuerto." }, { time: "2026-10-15T08:20:00Z", text: "Reservación creada por un agente." }],
        icon: "warning"
    },
    r4: {
        id: "r4",
        bookingId: "RES-88294D",
        guest: { name: "Katherine Michelle", email: "katherine.michelle@example.com", phone: "+504 9778-4680", loyalty: { tier: "Oro" } },
        status: "Confirmed",
        createdAt: "2026-10-13T11:00:00Z",
        stay: { checkIn: "2026-10-15", checkInTime: "15:00", checkOut: "2026-10-20", checkOutTime: "11:00", nights: 5, specialRequests: "Piso alto, late checkout si es posible" },
        room: { number: "103", type: "Suite Imperial", name: "Suite Imperial", ratePerNight: 320 },
        party: { adults: 2, children: 0 },
        internalNotes: [{ id: "n1", text: "Prefiere amenidad vegana", author: "Front Desk", createdAt: "2026-10-14T09:00:00Z" }],
        payment: { amountPaid: 920, breakdown: { roomRate: 1600, taxesAndFees: 240, extras: 0 }, total: 1840, guaranteeMethod: "Visa terminada en 4242" },
        activity: [{ time: "2026-10-14T09:00:00Z", text: "Se agregó solicitud de amenidad vegana." }, { time: "2026-10-13T11:00:00Z", text: "Reservación confirmada por teléfono." }],
        icon: null
    }
};

export default RESERVATIONS_LIST;
