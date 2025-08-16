// prisma/seed.ts
import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function runSeed() {
  // 1) Clean tables
  await prisma.report.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({});

  // 2) Base data
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  const professional = await prisma.user.create({
    data: {
      name: 'Dr. John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: UserRole.PROFESSIONAL,
    },
  });

  const client1 = await prisma.client.create({
    data: { name: 'Jane Smith', email: 'jane@example.com', phone: '555-1234' },
  });

  const client2 = await prisma.client.create({
    data: { name: 'Carlos Pérez', email: 'carlos@example.com', phone: '555-5678' },
  });

  const haircut = await prisma.service.create({
    data: { name: 'Haircut', description: 'Basic haircut service', duration: 30, price: 15.0 },
  });

  const massage = await prisma.service.create({
    data: { name: 'Massage', description: 'Relaxing 1-hour massage', duration: 60, price: 40.0 },
  });

  await prisma.appointment.create({
    data: {
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      status: AppointmentStatus.CONFIRMED,
      userId: professional.id,
      clientId: client1.id,
      serviceId: haircut.id,
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date(Date.now() + 1000 * 60 * 60 * 48),
      status: AppointmentStatus.PENDING,
      userId: professional.id,
      clientId: client2.id,
      serviceId: massage.id,
    },
  });

  console.log('✅ Seed completed');
}

// If you run this file directly with `pnpm prisma:seed`
if (require.main === module) {
  runSeed()
    .catch((e) => {
      console.error('❌ Seed failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
