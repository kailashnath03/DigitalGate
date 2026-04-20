import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if seeded
    const count = await prisma.user.count();
    if (count > 0) {
      return NextResponse.json({ message: 'Database already seeded', count });
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create users
    const student1 = await prisma.user.create({
      data: {
        username: 'student1',
        password: hashedPassword,
        name: 'John Doe',
        role: 'STUDENT',
        roomNumber: 'A-101',
      }
    });

    const warden1 = await prisma.user.create({
      data: {
        username: 'warden1',
        password: hashedPassword,
        name: 'Dr. Alan Smith',
        role: 'WARDEN',
      }
    });

    const security1 = await prisma.user.create({
      data: {
        username: 'security1',
        password: hashedPassword,
        name: 'Officer Davis',
        role: 'SECURITY',
      }
    });

    return NextResponse.json({ message: 'Database seeded successfully', users: [student1, warden1, security1] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
