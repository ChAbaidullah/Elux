import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PREFIX = '/admin';
const API_ADMIN_PREFIX = '/api/admin';
const LOGIN_PATH = '/admin/login';
const LOGIN_API = '/api/admin/login';
const LOGOUT_API = '/api/admin/logout';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isAdminApi = pathname.startsWith(API_ADMIN_PREFIX);
  const isLoginPage = pathname === LOGIN_PATH;
  const isLoginApi = pathname === LOGIN_API;
  const isLogoutApi = pathname === LOGOUT_API;

  if (!(isAdminRoute || isAdminApi)) return NextResponse.next();
  if (isLoginPage || isLoginApi || isLogoutApi) return NextResponse.next();

  const token = req.cookies.get('admin_session')?.value || '';
  if (token) return NextResponse.next();

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
