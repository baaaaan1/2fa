import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Secure 2FA Authenticator",
  description: "Open source two-factor authentication with guest and private accounts, QR scanning, and encrypted storage",
  keywords: ["2FA", "TOTP", "authenticator", "security", "open source", "FOSS"],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f0f0f" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
