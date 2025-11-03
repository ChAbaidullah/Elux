import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

function b64encode(input) {
  return Buffer.from(input).toString("base64");
}

async function sign(payloadB64, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  return Buffer.from(sigBuf).toString("base64");
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body || {};

  const adminUser = process.env.ADMIN_USERNAME || "";
  const adminHash = process.env.ADMIN_PASSWORD_HASH || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.SESSION_SECRET || "";

  if (!adminUser || !secret) {
    return new NextResponse("Server not configured", { status: 500 });
  }

  if (!username || !password) {
    return new NextResponse("Missing credentials", { status: 400 });
  }

  if (username !== adminUser) {
    return new NextResponse("Invalid credentials", { status: 401 });
  }

  let ok = false;
  if (adminHash) {
    ok = await bcrypt.compare(password, adminHash).catch(() => false);
  } else if (adminPassword) {
    ok = password === adminPassword;
  }
  if (!ok) {
    return new NextResponse("Invalid credentials", { status: 401 });
  }

  const now = Date.now();
  const exp = now + 1000 * 60 * 60; // 1 hour
  const payload = { sub: username, iat: now, exp };
  const payloadB64 = b64encode(JSON.stringify(payload));
  const sigB64 = await sign(payloadB64, secret);
  const token = `${payloadB64}.${sigB64}`;

  const res = new NextResponse(null, { status: 204 });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  return res;
}
