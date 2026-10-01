import { NextResponse, type NextRequest } from 'next/server';
import { LOGIN_ROUTE, SESSION_COOKIE_NAME } from '@/constants/auth';
import { isSessionToken } from '@/lib/auth/session-token';

// First gate, on every request: without a session cookie only the login page is served.
//
// It looks at the cookie alone, so it cannot tell a valid session from an expired or a forged
// one. That is decided against the database by requireUser() and getCurrentUser()
// (lib/auth/session.ts), which every layout, page or Server Function that reads data must call.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === LOGIN_ROUTE) return NextResponse.next();

  if (isSessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)) return NextResponse.next();

  // 303 turns a redirected POST (a Server Function call) into a GET of the login page.
  const isRead = request.method === 'GET' || request.method === 'HEAD';
  return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url), isRead ? 307 : 303);
}

export const config = {
  // Everything except the build assets, the /public/brand images and the app icons — all of
  // which must load on the login page itself, while signed out.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|brand/).*)'],
};
