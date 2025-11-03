import AdminDashboardClient from "./ui/AdminDashboardClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function verifyToken(token) {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET || "";
  if (!secret) return false;
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
    const sigCheckB64 = Buffer.from(sigBuf).toString("base64");
    if (sigCheckB64 !== sigB64) return false;
    const payloadJson = Buffer.from(payloadB64, "base64").toString("utf8");
    const payload = JSON.parse(payloadJson);
    if (payload.exp && Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export default async function AdminPage() {
  const store = await cookies();
  const token = store.get("admin_session")?.value || "";
  const ok = await verifyToken(token);
  if (!ok) redirect("/admin/login");
  return <AdminDashboardClient />;
}
