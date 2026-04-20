import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const status = searchParams.get('status');

  try {
    const whereClause = {};
    if (studentId) whereClause.studentId = studentId;
    if (status) whereClause.status = status;

    const passes = await prisma.gatePass.findMany({
      where: whereClause,
      include: {
        student: {
          select: { name: true, roomNumber: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(passes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { studentId, destination, reason } = data;

    const newPass = await prisma.gatePass.create({
      data: {
        studentId,
        destination,
        reason,
        status: 'PENDING'
      }
    });

    return NextResponse.json(newPass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
