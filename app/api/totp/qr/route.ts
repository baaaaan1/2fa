import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { secret, accountName, issuer } = body

    if (!secret || !accountName) {
      return NextResponse.json({ error: "Secret and account name are required" }, { status: 400 })
    }

    const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer || "2FA")}:${encodeURIComponent(accountName)}?secret=${encodeURIComponent(secret.toUpperCase())}&issuer=${encodeURIComponent(issuer || "2FA")}&algorithm=SHA1&digits=6&period=30`
    
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff"
      }
    })

    return NextResponse.json({ 
      qrCode: qrCodeDataUrl,
      otpauthUrl 
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
