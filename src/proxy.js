import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_key_1234567890123456'
);

// Define which routes require which roles
const protectedRoutes = {
  '/student': 'STUDENT',
  '/warden': 'WARDEN',
  '/security': 'SECURITY',
};

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  // Check if it's a protected route (starts with the base path)
  const requiredRole = Object.entries(protectedRoutes).find(([route]) => pathname.startsWith(route))?.[1];

  if (!requiredRole) {
    return NextResponse.next();
  }

  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    // Not logged in, redirect to login page with the target role
    return NextResponse.redirect(new URL(`/login?role=${requiredRole}`, req.url));
  }

  try {
    // Verify token
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Verify role
    if (payload.role !== requiredRole) {
      // User is logged in but doesn't have the right role, redirect to their role's dashboard
      return NextResponse.redirect(new URL(`/${payload.role.toLowerCase()}`, req.url));
    }

    // Role matches, proceed
    return NextResponse.next();

  } catch (error) {
    console.error('JWT Verification failed:', error);
    // Invalid token, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL(`/login?role=${requiredRole}`, req.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/student/:path*',
    '/warden/:path*',
    '/security/:path*',
  ],
};
