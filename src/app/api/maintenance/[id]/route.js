import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_key_1234567890123456'
);

export async function PATCH(request, context) {
  const { id } = await context.params;
  try {
    const data = await request.json();
    const { status } = data; // e.g. 'IN_PROGRESS', 'RESOLVED', 'COMPLETED'

    // Get current user from cookies
    const cookieStore = request.cookies;
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userRole = payload.role;
    const userId = payload.id;

    // Fetch maintenance request to check ownership
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
    });

    if (!maintenance) {
      return NextResponse.json({ error: 'Maintenance request not found' }, { status: 404 });
    }

    // Authorization logic
    if (status === 'COMPLETED') {
      // Only the student who raised it can complete it
      if (userRole !== 'STUDENT' || maintenance.studentId !== userId) {
        return NextResponse.json({ error: 'Only the requesting student can confirm completion' }, { status: 403 });
      }
      if (maintenance.status !== 'RESOLVED') {
        return NextResponse.json({ error: 'Can only complete resolved requests' }, { status: 400 });
      }
    } else if (status === 'RESOLVED' || status === 'IN_PROGRESS') {
      // Only warden can resolve or set to progress
      if (userRole !== 'WARDEN') {
        return NextResponse.json({ error: 'Only wardens can update to this status' }, { status: 403 });
      }
    }

    const updatedMaintenance = await prisma.maintenance.update({
      where: { id },
      data: { status },
      include: {
        student: {
          select: { name: true, id: true }
        }
      }
    });

    // Create notification for student/warden
    let msg = `Your maintenance request for "${updatedMaintenance.category}" is now ${status}.`;
    let notifyUserId = updatedMaintenance.studentId;

    if (status === 'COMPLETED') {
        msg = `Student has confirmed completion of maintenance for "${updatedMaintenance.category}".`;
        // Find a warden (or notify all? For now, let's keep it simple or skip warden notification if not needed)
        // Let's just notify the student about the final status too.
    }

    await prisma.notification.create({
      data: {
        userId: notifyUserId,
        message: msg,
        type: status === 'COMPLETED' ? 'SUCCESS' : (status === 'RESOLVED' ? 'SUCCESS' : 'INFO')
      }
    });

    return NextResponse.json(updatedMaintenance);
  } catch (error) {
    console.error('Maintenance Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
