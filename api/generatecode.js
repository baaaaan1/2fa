const { authenticator } = require('otplib');

module.exports = (req, res) => {
  const { secret } = req.query;
  if (!secret) {
    return res.status(400).json({ error: 'Missing secret' });
  }
  try {
    const code = authenticator.generate(secret);
    res.status(200).json({ code });
  } catch (e) {
    res.status(400).json({ error: 'Invalid secret' });
  }
};

