import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function PATCH(request, context) {
  const { id } = await context.params;
  try {
    const data = await request.json();
    const { status, action } = data; // action could be 'approve', 'reject', 'exit', 'entry'
    
    let updateData = {};
    
    if (action === 'approve') {
      const serialNumber = crypto.randomBytes(4).toString('hex').toUpperCase();
      updateData = { status: 'APPROVED', serialNumber };
    } else if (action === 'reject') {
      updateData = { status: 'REJECTED' };
    } else if (action === 'exit') {
      updateData = { exitTime: new Date() };
    } else if (action === 'entry') {
      updateData = { entryTime: new Date(), status: 'COMPLETED' };
    } else if (status) {
      updateData = { status };
    }

    const updatedPass = await prisma.gatePass.update({
      where: { id },
      data: updateData,
      include: { student: true }
    });

    // Create notification for student
    let notificationMessage = '';
    let notificationType = 'INFO';

    if (action === 'approve') {
      notificationMessage = `Your gate pass to ${updatedPass.destination} has been APPROVED. Serial: ${updatedPass.serialNumber}`;
      notificationType = 'SUCCESS';
    } else if (action === 'reject') {
      notificationMessage = `Your gate pass to ${updatedPass.destination} has been REJECTED.`;
      notificationType = 'WARNING';
    } else if (action === 'exit') {
      notificationMessage = `Exit logged at ${new Date(updatedPass.exitTime).toLocaleTimeString()}.`;
    } else if (action === 'entry') {
      notificationMessage = `Entry logged at ${new Date(updatedPass.entryTime).toLocaleTimeString()}. Gate pass completed.`;
      notificationType = 'SUCCESS';
    }

    if (notificationMessage) {
      await prisma.notification.create({
        data: {
          userId: updatedPass.studentId,
          message: notificationMessage,
          type: notificationType
        }
      });
    }

    return NextResponse.json(updatedPass);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
