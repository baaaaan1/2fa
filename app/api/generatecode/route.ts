import { NextRequest, NextResponse } from "next/server"
import { authenticator } from "otplib"

function isValidBase32(str: string): boolean {
  return /^[A-Z2-7]+=*$/i.test(str)
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const secret = searchParams.get("secret")

    if (!secret || typeof secret !== "string" || !secret.trim()) {
      return NextResponse.json({ error: "Missing or invalid secret" }, { status: 400 })
    }

    if (secret.length < 8) {
      return NextResponse.json({ error: "Secret too short" }, { status: 400 })
    }

    if (!isValidBase32(secret)) {
      return NextResponse.json({ error: "Secret must be Base32 encoded" }, { status: 400 })
    }

    const code = authenticator.generate(secret.toUpperCase())
    
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Failed to generate valid OTP code" }, { status: 400 })
    }

    return NextResponse.json({ code })
  } catch (error) {
    console.error("Error generating code:", error)
    return NextResponse.json({ error: "Invalid secret or internal error" }, { status: 400 })
  }
}
