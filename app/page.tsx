"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import ThemeToggle from "./components/ThemeToggle"

interface TotpSecret {
  id: string
  name: string
  algorithm: string
  digits: number
  period: number
  createdAt: string
}

function AuthenticatorApp() {
  const { data: session } = useSession()
  const [secret, setSecret] = useState("")
  const [name, setName] = useState("My Account")
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [qrData, setQrData] = useState<{ qrCode: string; otpauthUrl: string } | null>(null)
  const [savedSecrets, setSavedSecrets] = useState<TotpSecret[]>([])
  const [activeCodes, setActiveCodes] = useState<Record<string, string>>({})
  const [countdown, setCountdown] = useState(30)

  // Generate code from secret
  const generateCode = async (secretValue: string): Promise<string | null> => {
    try {
      const res = await fetch(`/api/generatecode?secret=${encodeURIComponent(secretValue)}`)
      const data = await res.json()
      if (res.ok && data.code) {
        return data.code
      }
      return null
    } catch {
      return null
    }
  }

  // Handle manual generate
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const generatedCode = await generateCode(secret)
    if (generatedCode) {
      setCode(generatedCode)
    } else {
      setError("Failed to generate code. Check your secret.")
    }
    setLoading(false)
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Code copied!")
    } catch {
      alert("Failed to copy")
    }
  }

  // Paste from clipboard
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setSecret(text.trim())
    } catch {
      alert("Failed to paste. Please grant clipboard permission.")
    }
  }

  // Generate QR code
  const handleGenerateQR = async () => {
    if (!secret) {
      setError("Please enter a secret first")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/totp/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, accountName: name, issuer: "2FA Authenticator" })
      })
      const data = await res.json()
      if (res.ok) {
        setQrData(data)
        setShowQR(true)
      } else {
        setError(data.error || "Failed to generate QR")
      }
    } catch {
      setError("Failed to generate QR code")
    }
    setLoading(false)
  }

  // Save secret for authenticated users
  const handleSaveSecret = async () => {
    if (!session) {
      setError("Please sign in to save secrets")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, secret })
      })
      const data = await res.json()
      if (res.ok) {
        alert("Secret saved successfully!")
        loadSavedSecrets()
      } else {
        setError(data.error || "Failed to save secret")
      }
    } catch {
      setError("Failed to save secret")
    }
    setLoading(false)
  }

  // Load saved secrets
  const loadSavedSecrets = async () => {
    try {
      const res = await fetch("/api/totp")
      const data = await res.json()
      if (res.ok && data.secrets) {
        setSavedSecrets(data.secrets)
      }
    } catch {
      console.error("Failed to load secrets")
    }
  }

  useEffect(() => {
    if (session) {
      loadSavedSecrets()
    }
  }, [session])

  // Update codes every second
  useEffect(() => {
    const updateCodes = async () => {
      const now = Math.floor(Date.now() / 1000)
      const remaining = 30 - (now % 30)
      setCountdown(remaining)

      // Update guest code
      if (secret && !session) {
        const newCode = await generateCode(secret)
        if (newCode) setCode(newCode)
      }

      // Update saved secrets codes
      if (session && savedSecrets.length > 0) {
        // Note: We can't generate codes for saved secrets without decrypting on server
        // This would need a separate API endpoint
      }
    }

    updateCodes()
    const interval = setInterval(updateCodes, 1000)
    return () => clearInterval(interval)
  }, [secret, session, savedSecrets])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔐 2FA Authenticator</h1>
        <div className="header-actions">
          <ThemeToggle />
          {session ? (
            <div className="user-menu">
              <span className="user-name">{session.user?.name || session.user?.email}</span>
              <button onClick={() => signOut()} className="btn-signout">Sign Out</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={() => signIn("google")} className="btn-google">
                Google
              </button>
              <button onClick={() => signIn("github")} className="btn-github">
                GitHub
              </button>
              <span className="guest-note">or continue as guest</span>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {/* Manual Entry Section */}
        <section className="card manual-entry">
          <h2>Manual Entry</h2>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label htmlFor="name">Account Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., john@gmail.com"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="secret">Secret Key</label>
              <div className="input-with-buttons">
                <input
                  type="text"
                  id="secret"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value.toUpperCase())}
                  placeholder="Enter Base32 secret"
                  autoComplete="off"
                  required
                />
                <button type="button" onClick={pasteFromClipboard} className="btn-icon" title="Paste">
                  📋
                </button>
              </div>
            </div>
            <div className="button-row">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Generating..." : "Generate Code"}
              </button>
              <button type="button" onClick={handleGenerateQR} className="btn-secondary">
                Show QR Code
              </button>
            </div>
            {session && (
              <button type="button" onClick={handleSaveSecret} className="btn-save" disabled={loading || !secret}>
                💾 Save Secret
              </button>
            )}
          </form>
        </section>

        {/* Generated Code Display */}
        {code && (
          <section className="card code-display">
            <h2>Current Code</h2>
            <div className="code-container">
              <span className="code-value">{code}</span>
              <button onClick={() => copyToClipboard(code)} className="btn-copy" title="Copy">
                📋
              </button>
            </div>
            <div className="countdown">
              <div className="progress-bar">
                <div className="progress" style={{ width: `${(countdown / 30) * 100}%` }}></div>
              </div>
              <span>Refreshes in {countdown}s</span>
            </div>
          </section>
        )}

        {/* Saved Secrets for Authenticated Users */}
        {session && savedSecrets.length > 0 && (
          <section className="card saved-secrets">
            <h2>Saved Accounts</h2>
            <ul className="secrets-list">
              {savedSecrets.map((s) => (
                <li key={s.id} className="secret-item">
                  <span className="secret-name">{s.name}</span>
                  <span className="secret-info">{s.digits} digits • {s.period}s</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* QR Code Modal */}
        {showQR && qrData && (
          <div className="modal-overlay" onClick={() => setShowQR(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowQR(false)}>×</button>
              <h3>Scan QR Code</h3>
              <img src={qrData.qrCode} alt="TOTP QR Code" className="qr-image" />
              <p className="qr-hint">Scan this with your authenticator app</p>
              <div className="qr-secret">
                <strong>Secret:</strong> {secret}
                <button onClick={() => copyToClipboard(secret)} className="btn-copy-small">📋</button>
              </div>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {/* Security Info */}
        <section className="card security-info">
          <h3>🔒 Security & Privacy</h3>
          <ul>
            <li>Guest users: Secrets are not stored, enter each time</li>
            <li>Authenticated users: Secrets encrypted with AES-256</li>
            <li>All code generation happens securely</li>
            <li>No data shared with third parties</li>
            <li>Open Source (FOSS) - audit the code anytime</li>
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>2FA keeps your accounts secure with constantly changing codes.</p>
        <p>Never share your codes with anyone!</p>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <SessionProvider>
      <AuthenticatorApp />
    </SessionProvider>
  )
}
