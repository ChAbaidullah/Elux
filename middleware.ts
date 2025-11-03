import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PREFIX = '/admin';
const API_ADMIN_PREFIX = '/api/admin';
const LOGIN_PATH = '/admin/login';
const LOGIN_API = '/api/admin/login';
const LOGOUT_API = '/api/admin/logout';

async function verify(token: string) {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET || '';
  if (!secret) return false;
  try {
    const [payloadB64, sigB64] = token.split('.');
    if (!payloadB64 || !sigB64) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      Uint8Array.from(atob(sigB64), c => c.charCodeAt(0)),
      enc.encode(payloadB64)
    );
    if (!valid) return false;
    const payload = JSON.parse(atob(payloadB64));
    if (!payload || typeof payload !== 'object') return false;
    if (payload.exp && Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isAdminApi = pathname.startsWith(API_ADMIN_PREFIX);
  const isLoginPage = pathname === LOGIN_PATH;
  const isLoginApi = pathname === LOGIN_API;
  const isLogoutApi = pathname === LOGOUT_API;

  if (!(isAdminRoute || isAdminApi)) return NextResponse.next();
  if (isLoginPage || isLoginApi || isLogoutApi) return NextResponse.next();

  const cookie = req.cookies.get('admin_session')?.value || '';
  const ok = await verify(cookie);

  if (ok) return NextResponse.next();

  if (isAdminApi) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
