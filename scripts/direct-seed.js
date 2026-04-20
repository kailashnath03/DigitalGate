const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Student 1
  await prisma.user.upsert({
    where: { username: 'student1' },
    update: { name: 'Alice Johnson' },
    create: {
      username: 'student1',
      password: hashedPassword,
      name: 'Alice Johnson',
      role: 'STUDENT',
      roomNumber: 'A-101',
    },
  });

  // Student 2
  await prisma.user.upsert({
    where: { username: 'student2' },
    update: {},
    create: {
      username: 'student2',
      password: hashedPassword,
      name: 'Bob Smith',
      role: 'STUDENT',
      roomNumber: 'B-202',
    },
  });

  // Student 3
  await prisma.user.upsert({
    where: { username: 'student3' },
    update: {},
    create: {
      username: 'student3',
      password: hashedPassword,
      name: 'Charlie Davis',
      role: 'STUDENT',
      roomNumber: 'C-303',
    },
  });

  // Warden
  await prisma.user.upsert({
    where: { username: 'warden1' },
    update: { name: 'Dr. Sarah Wilson' },
    create: {
      username: 'warden1',
      password: hashedPassword,
      name: 'Dr. Sarah Wilson',
      role: 'WARDEN',
    },
  });

  // Security
  await prisma.user.upsert({
    where: { username: 'security1' },
    update: { name: 'Officer Michael Brown' },
    create: {
      username: 'security1',
      password: hashedPassword,
      name: 'Officer Michael Brown',
      role: 'SECURITY',
    },
  });

  console.log('Seeded multiple unique users successfully');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
