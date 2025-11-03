import { NextResponse } from "next/server";

function clearedRedirect(baseUrl) {
  const res = NextResponse.redirect(new URL("/admin/login", baseUrl), { status: 303 });
  res.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return res;
}

export async function POST(req) {
  return clearedRedirect(req.url);
}

export async function GET(req) {
  return clearedRedirect(req.url);
}
