"use server"

import { cookies } from "next/headers"

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()

  // httpOnly cookie for server actions (secure, not readable by JS)
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  // Non-httpOnly flag so client-side code can detect auth state
  cookieStore.set("auth_status", "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
  cookieStore.delete("auth_status")
}
