import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/app/lib/prisma"
import { encrypt } from "@/app/lib/encryption"
import { authenticator } from "otplib"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const { name, secret } = body

    if (!secret || !name) {
      return NextResponse.json({ error: "Name and secret are required" }, { status: 400 })
    }

    // Validate Base32
    if (!/^[A-Z2-7]+=*$/i.test(secret)) {
      return NextResponse.json({ error: "Secret must be Base32 encoded" }, { status: 400 })
    }

    if (secret.length < 8) {
      return NextResponse.json({ error: "Secret too short" }, { status: 400 })
    }

    // For guest users (no session), we can't store - return error or handle differently
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Authentication required to save secrets. Please sign in." 
      }, { status: 401 })
    }

    // Encrypt the secret before storing
    const { encrypted, iv } = encrypt(secret.toUpperCase())

    const totpSecret = await prisma.totpSecret.create({
      data: {
        userId: session.user.id,
        name,
        secret: encrypted,
        iv,
        algorithm: "SHA1",
        digits: 6,
        period: 30
      }
    })

    return NextResponse.json({ 
      message: "TOTP secret saved successfully",
      id: totpSecret.id 
    })
  } catch (error) {
    console.error("Error saving TOTP secret:", error)
    return NextResponse.json({ error: "Failed to save TOTP secret" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ secrets: [] })
    }

    const secrets = await prisma.totpSecret.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        algorithm: true,
        digits: true,
        period: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ secrets })
  } catch (error) {
    console.error("Error fetching TOTP secrets:", error)
    return NextResponse.json({ error: "Failed to fetch TOTP secrets" }, { status: 500 })
  }
}
