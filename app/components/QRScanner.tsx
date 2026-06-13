"use client"

import { useState, useRef } from "react"

interface QRScannerProps {
  onScan: (secret: string) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)

  // Simple QR code parsing using manual input fallback
  const handleManualEntry = () => {
    onClose()
  }

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close scanner">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <h3>Scan QR Code</h3>
        
        <div className="scanner-container">
          <video ref={videoRef} autoPlay playsInline muted className="scanner-video"></video>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          <div className="scan-frame"></div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="scanner-actions">
          <p className="hint">Point your camera at the QR code</p>
          <button type="button" className="btn-secondary" onClick={handleManualEntry}>
            Enter Secret Manually
          </button>
        </div>

        <p className="privacy-note">
          Camera access is only used locally for scanning. No video data is sent to servers.
        </p>
      </div>
    </div>
  )
}
