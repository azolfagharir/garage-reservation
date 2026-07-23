export type UserRole = "customer" | "mechanic";

export interface MockUser {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: UserRole;
  city?: string;
}

export interface Mechanic {
  id: number;
  name: string;
  city: string;
  specialty: string;
  rating: number;
  workStart: number; // hour
  workEnd: number;
  avatar: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  mechanicId: number;
  date: string;
  hour: number;
  service: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: "c1", name: "علی رضایی", phone: "09121111111", password: "1234", role: "customer", city: "تهران" },
  { id: "m1", name: "حسن مکانیک", phone: "09122222222", password: "1234", role: "mechanic" },
  { id: "m2", name: "رضا تعمیرکار", phone: "09123333333", password: "1234", role: "mechanic" },
];

export const MOCK_MECHANICS: Mechanic[] = [
  { id: 1, name: "حسن مکانیک", city: "تهران", specialty: "موتور و گیربکس", rating: 4.8, workStart: 8, workEnd: 18, avatar: "🔧" },
  { id: 2, name: "رضا تعمیرکار", city: "تهران", specialty: "برق خودرو", rating: 4.5, workStart: 9, workEnd: 17, avatar: "⚡" },
];

export const SERVICES = [
  "تعویض روغن", "تنظیم موتور", "تعویض لنت ترمز",
  "تعویض فیلتر هوا", "شارژ کولر", "تعویض باتری",
];

// ذخیره موقت رزروها در حافظه (بعداً با DB جایگزین می‌شه)
export let MOCK_BOOKINGS: Booking[] = [
  { id: "b1", customerId: "c1", customerName: "علی رضایی", mechanicId: 1, date: "1403/05/01", hour: 10, service: "تعویض روغن" },
];
