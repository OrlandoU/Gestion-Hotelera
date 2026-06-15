export const RESERVATIONS_LIST = [
    { id: "r1", roomId: "101", start: "2023-10-14", end: "2023-10-17", guest: "Eleanor Vance", color: "amber-100", icon: "credit_card" },
    { id: "r2", roomId: "102", start: "2023-10-12", end: "2023-10-13", guest: "Luke Crain", color: "emerald-100" },
    { id: "r3", roomId: "102", start: "2023-10-18", end: "2023-10-22", guest: "Theodora Crain", color: "blue-100", icon: "warning" },
    { id: "r4", roomId: "103", start: "2023-10-15", end: "2023-10-20", guest: "Katherine Michelle", color: "emerald-100" },
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
        breakdown: { roomRate: number; taxesAndFees: number; extras: number };
        total: number;
        guaranteeMethod: string;
    };
    activity: { time: string; text: string }[];
    ui: { color: string; icon: string | null };
};

export const RESERVATIONS_DETAIL: Record<string, ReservationDetail> = {
    r1: {
        id: "r1",
        bookingId: "RES-88291A",
        guest: { name: "Eleanor Vance", email: "eleanor.vance@example.com", phone: "+1 (555) 010-1212", loyalty: { tier: "Platinum" } },
        status: "Confirmed",
        createdAt: "2023-10-12T14:30:00Z",
        stay: { checkIn: "2023-10-14", checkInTime: "15:00", checkOut: "2023-10-17", checkOutTime: "11:00", nights: 3, specialRequests: "Late check-in; feather-free pillows" },
        room: { number: "101", type: "King Suite", name: "King Suite", ratePerNight: 250 },
        party: { adults: 2, children: 0 },
        internalNotes: [{ id: "n1", text: "VIP — welcome amenity (champagne & fruit). Housekeeping notified of feather allergy.", author: "Sarah Jenkins, Front Desk Mgr", createdAt: "2023-10-13T09:41:00Z" }],
        payment: { breakdown: { roomRate: 750, taxesAndFees: 112.5, extras: 50 }, total: 912.5, guaranteeMethod: "Visa ending in 4242" },
        activity: [{ time: "2023-10-13T09:41:00Z", text: "Added internal note regarding VIP status." }, { time: "2023-10-12T14:30:00Z", text: "Reservation created via Direct Web." }],
        ui: { color: "amber-100", icon: "credit_card" }
    },
    r2: {
        id: "r2",
        bookingId: "RES-88292B",
        guest: { name: "Luke Crain", email: "luke.crain@example.com", phone: "+1 (555) 019-5001", loyalty: { tier: "Silver" } },
        status: "Confirmed",
        createdAt: "2023-10-11T10:15:00Z",
        stay: { checkIn: "2023-10-12", checkInTime: "15:00", checkOut: "2023-10-13", checkOutTime: "11:00", nights: 1, specialRequests: "" },
        room: { number: "102", type: "Queen Suite", name: "Queen Suite", ratePerNight: 180 },
        party: { adults: 1, children: 0 },
        internalNotes: [],
        payment: { breakdown: { roomRate: 180, taxesAndFees: 27, extras: 0 }, total: 207, guaranteeMethod: "Mastercard ending in 6789" },
        activity: [{ time: "2023-10-11T10:15:00Z", text: "Reservation created via Direct Web." }],
        ui: { color: "emerald-100", icon: null }
    },
    r3: {
        id: "r3",
        bookingId: "RES-88293C",
        guest: { name: "Theodora Crain", email: "theodora.crain@example.com", phone: "+1 (555) 019-7777", loyalty: { tier: "Gold" } },
        status: "Confirmed",
        createdAt: "2023-10-15T08:20:00Z",
        stay: { checkIn: "2023-10-18", checkInTime: "15:00", checkOut: "2023-10-22", checkOutTime: "11:00", nights: 4, specialRequests: "Extra pillows" },
        room: { number: "102", type: "Queen Suite", name: "Queen Suite", ratePerNight: 180 },
        party: { adults: 2, children: 1 },
        internalNotes: [{ id: "n1", text: "Requested airport transfer", author: "Reservations", createdAt: "2023-10-16T12:00:00Z" }],
        payment: { breakdown: { roomRate: 720, taxesAndFees: 108, extras: 150 }, total: 978, guaranteeMethod: "Amex ending in 1111" },
        activity: [{ time: "2023-10-16T12:00:00Z", text: "Added airport transfer." }, { time: "2023-10-15T08:20:00Z", text: "Reservation created by Agent." }],
        ui: { color: "blue-100", icon: "warning" }
    },
    r4: {
        id: "r4",
        bookingId: "RES-88294D",
        guest: { name: "Katherine Michelle", email: "katherine.michelle@example.com", phone: "+1 (555) 013-2424", loyalty: { tier: "Gold" } },
        status: "Confirmed",
        createdAt: "2023-10-13T11:00:00Z",
        stay: { checkIn: "2023-10-15", checkInTime: "15:00", checkOut: "2023-10-20", checkOutTime: "11:00", nights: 5, specialRequests: "High-floor, late checkout if possible" },
        room: { number: "103", type: "Imperial Suite", name: "Imperial Suite", ratePerNight: 320 },
        party: { adults: 2, children: 0 },
        internalNotes: [{ id: "n1", text: "Prefers vegan amenity", author: "Front Desk", createdAt: "2023-10-14T09:00:00Z" }],
        payment: { breakdown: { roomRate: 1600, taxesAndFees: 240, extras: 0 }, total: 1840, guaranteeMethod: "Visa ending in 4242" },
        activity: [{ time: "2023-10-14T09:00:00Z", text: "Added vegan amenity request." }, { time: "2023-10-13T11:00:00Z", text: "Reservation confirmed by phone." }],
        ui: { color: "emerald-100", icon: null }
    }
};

export default RESERVATIONS_LIST;
