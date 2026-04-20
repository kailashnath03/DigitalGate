import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  try {
    const whereClause = {};
    if (studentId) whereClause.studentId = studentId;

    const maintenanceRequests = await prisma.maintenance.findMany({
      where: whereClause,
      include: {
        student: {
          select: { name: true, roomNumber: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(maintenanceRequests);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { studentId, category, description } = data;

    const newRequest = await prisma.maintenance.create({
      data: {
        studentId,
        category,
        description,
        status: 'OPEN'
      }
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
