import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const hash = (p: string) => bcrypt.hashSync(p, 10);

async function main() {
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.user.deleteMany();

  // 20 کاربر: 15 تهران، 5 مشهد
  const customerCities = [
    ...Array(15).fill("تهران"),
    ...Array(5).fill("مشهد"),
  ];

  const customers = await Promise.all(
    customerCities.map((city, i) =>
      prisma.user.create({
        data: {
          name: `مشتری ${i + 1}`,
          email: `customer${i + 1}@test.com`,
          password: hash("123456"),
          role: "CUSTOMER",
          city,
        },
      })
    )
  );

  // 5 مکانیک: 3 تهران، 2 مشهد
  const mechCities = ["تهران", "تهران", "تهران", "مشهد", "مشهد"];

  const mechanics = await Promise.all(
    mechCities.map(async (city, i) => {
      const user = await prisma.user.create({
        data: {
          name: `مکانیک ${i + 1}`,
          email: `mechanic${i + 1}@test.com`,
          password: hash("123456"),
          role: "MECHANIC",
          city,
        },
      });
      return prisma.mechanic.create({
        data: {
          userId: user.id,
          city,
          address: `خیابان آزادی، پلاک ${10 + i}`,
          workStart: "08:00",
          workEnd: "18:00",
        },
      });
    })
  );

  // نام سرویس‌ها
  const serviceNames = [
    "تعویض روغن",
    "تنظیم موتور",
    "تعویض لنت ترمز",
    "شارژ کولر",
    "تعویض فیلتر هوا",
    "دیاگ خودرو",
    "تعویض شمع",
    "تعویض تسمه تایم",
    "بالانس چرخ",
    "تعویض باتری",
  ];

  // هر مکانیک 2 سرویس (10 سرویس کل)
  const services: { id: number; mechanicId: number }[] = [];
  for (let i = 0; i < mechanics.length; i++) {
    for (let j = 0; j < 2; j++) {
      const s = await prisma.service.create({
        data: {
          name: serviceNames[i * 2 + j],
          duration: 30 + j * 15,
          mechanicId: mechanics[i].id,
        },
      });
      services.push({ id: s.id, mechanicId: mechanics[i].id });
    }
  }

  // هر مکانیک حداقل یک رزرو داشته باشه
  // تاریخ‌ها میلادی ذخیره می‌شن، موقع نمایش تبدیل به شمسی می‌کنیم
  const bookingDates = [
    new Date("2026-07-01T09:00:00"),
    new Date("2026-07-05T11:00:00"),
    new Date("2026-07-10T14:00:00"),
    new Date("2026-07-15T10:00:00"),
    new Date("2026-07-20T13:00:00"),
  ];

  for (let i = 0; i < mechanics.length; i++) {
    await prisma.booking.create({
      data: {
        customerId: customers[i].id,
        mechanicId: mechanics[i].id,
        serviceId: services[i * 2].id,
        date: bookingDates[i],
        status: "CONFIRMED",
      },
    });
  }

  console.log("✅ Seed کامل شد: 20 کاربر، 5 مکانیک، 10 سرویس، 5 رزرو");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
