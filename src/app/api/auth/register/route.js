import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { username, password, name, roomNumber } = await req.json();

    if (!username || !password || !name || !roomNumber) {
      return NextResponse.json(
        { error: 'All fields (name, username, password, roomNumber) are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with STUDENT role
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        roomNumber,
        role: 'STUDENT',
      },
    });

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
