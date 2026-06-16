# 2FA Authenticator - Simple & Glassmorphism

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/2fa-authenticator)

A simple, privacy-focused Two-Factor Authentication (2FA) web application with beautiful Glassmorphism design. This FOSS (Free and Open Source Software) project provides TOTP code generation with no login required.

## ✨ Features

### Core Features
- **🎨 Glassmorphism Theme** - Beautiful frosted glass effect with animated gradient background
- **📋 Copy/Paste Buttons** - Quick copy generated codes to clipboard
- **⏱️ Auto-refresh** - Codes automatically refresh every 30 seconds
- **📲 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🔒 No Login Required** - Use immediately without any account setup
- **🚀 Vercel Ready** - One-click deploy to Vercel

### Security Features
- 🔒 **Client-side Processing** - All TOTP generation happens via API
- 🔒 **No Server Storage** - Secrets are never stored on the server
- 🔒 **HTTPS Required** - Enforces secure connections in production
- 🔒 **Open Source** - Code is auditable by anyone
- 🔒 **No Database Required** - Works without any database setup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/2fa-authenticator.git
   cd 2fa-authenticator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   npx vercel dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🌐 Deployment to Vercel

### One-Click Deploy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/2fa-authenticator)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

**That's it!** No environment variables or database setup required.

## 📁 Project Structure

```
2fa-authenticator/
├── api/
│   └── generatecode.js    # Vercel Serverless Function for TOTP
├── index.html             # Main HTML file
├── styles.css             # Glassmorphism CSS styles
├── app.js                 # Client-side JavaScript
├── package.json           # Dependencies and metadata
├── README.md              # This file
└── vercel.json            # Vercel configuration
```

## 🎨 Customization

Edit `styles.css` to customize:
- Gradient colors (in `.animated-bg`)
- Glass card transparency (in `.glass-card`)
- Font family and sizes
- Animation speeds

## 🔒 Security Considerations

### For Users
- Never share your 2FA codes with anyone
- Keep your secret keys secure
- Always use HTTPS in production

### For Developers
- This project uses serverless TOTP generation
- Secrets are only sent to the API for code generation
- No secrets are stored on the server
- Regularly audit dependencies for vulnerabilities

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 FOSS Community

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- [otplib](https://github.com/hectorgomez/otplib) - OTP library for Node.js
- [Vercel](https://vercel.com) - Serverless hosting platform

## 📞 Support

- Open an issue for bugs or feature requests
- Join discussions in GitHub Discussions

---

**Made with ❤️ by the FOSS Community**

*Simple, Secure, No Login Required*
