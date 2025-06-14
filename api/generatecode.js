const { authenticator } = require('otplib');

// Fungsi validasi Base32 sederhana
function isValidBase32(str) {
  return /^[A-Z2-7]+=*$/i.test(str);
}

module.exports = (req, res) => {
  const { secret } = req.query;

  if (typeof secret !== 'string' || !secret.trim()) {
    return res.status(400).json({ error: 'Missing or invalid secret' });
  }
  if (secret.length < 8) {
    return res.status(400).json({ error: 'Secret too short' });
  }
  if (!isValidBase32(secret)) {
    return res.status(400).json({ error: 'Secret must be Base32 encoded' });
  }

  try {
    const code = authenticator.generate(secret);
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Failed to generate valid OTP code' });
    }
    res.status(200).json({ code });
  } catch (e) {
    res.status(400).json({ error: 'Invalid secret or internal error' });
  }
};