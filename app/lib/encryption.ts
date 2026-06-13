import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'

export function encrypt(text: string): { encrypted: string; iv: string } {
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY + iv).toString()
  return { encrypted, iv }
}

export function decrypt(encrypted: string, iv: string): string {
  const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY + iv)
  return decrypted.toString(CryptoJS.enc.Utf8)
}
