# 2FA Authenticator - Free & Open Source

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/2fa-authenticator)

A secure, privacy-focused Two-Factor Authentication (2FA) web application built with modern web technologies. This FOSS (Free and Open Source Software) project provides TOTP code generation with dark/light mode, QR code scanning, and optional account synchronization.

## ✨ Features

### Core Features
- **🌓 Dark/Light Mode** - Toggle between themes with persistent preference
- **📱 QR Code Scanner** - Scan QR codes from authenticator apps using your camera
- **🔐 QR Code Generator** - Generate QR codes for easy setup on other devices
- **📋 Copy/Paste Buttons** - Quick copy generated codes to clipboard
- **⏱️ Auto-refresh** - Codes automatically refresh every 30 seconds
- **📲 Responsive Design** - Works perfectly on desktop, tablet, and mobile

### Account Modes
- **Guest Mode** - Use without any account, no data stored
- **Private Account Mode** - Login with OAuth (Google) to save and sync accounts

### Security Features
- 🔒 **Client-side Processing** - All TOTP generation happens in the browser
- 🔒 **No Server Storage** - Secrets are never stored on the server
- 🔒 **HTTPS Required** - Enforces secure connections in production
- 🔒 **Third-party Auth** - Uses Supabase for secure OAuth authentication
- 🔒 **Open Source** - Code is auditable by anyone

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Vercel account (for deployment)
- Optional: Supabase account (for user authentication)

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

3. **Configure environment variables** (optional, for auth)
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Update app.js** with your Supabase credentials:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

5. **Run locally**
   ```bash
   npx vercel dev
   ```

6. **Open in browser**
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

### Setting up Supabase (Optional)

For private account features:

1. Create a new project at [supabase.com](https://supabase.com)
2. Enable Google OAuth in Authentication → Providers
3. Create the accounts table:
   ```sql
   CREATE TABLE accounts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     secret TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can view own accounts"
     ON accounts FOR SELECT
     USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert own accounts"
     ON accounts FOR INSERT
     WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can delete own accounts"
     ON accounts FOR DELETE
     USING (auth.uid() = user_id);
   ```

4. Add your Supabase URL and Anon Key to Vercel Environment Variables

## 📁 Project Structure

```
2fa-authenticator/
├── api/
│   └── generatecode.js    # Vercel Serverless Function for TOTP
├── index.html             # Main HTML file
├── styles.css             # All CSS styles
├── app.js                 # Client-side JavaScript
├── package.json           # Dependencies and metadata
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | No* |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key | No* |

*Required only for private account features

### Customization

Edit `styles.css` to customize:
- Color scheme (CSS variables in `:root`)
- Fonts
- Spacing and layout
- Animations

## 🔒 Security Considerations

### For Users
- Never share your 2FA codes with anyone
- Keep your secret keys secure
- Use guest mode if you don't need account sync
- Always use HTTPS in production

### For Developers
- This project uses client-side TOTP generation
- Secrets are never sent to the server except for code generation
- Consider encrypting secrets before storing in Supabase
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
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - QR code scanning
- [qrcode](https://github.com/soldair/node-qrcode) - QR code generation
- [Supabase](https://supabase.com) - Backend as a Service
- [Bootstrap](https://getbootstrap.com) - UI framework
- [Font Awesome](https://fontawesome.com) - Icons

## 📞 Support

- Open an issue for bugs or feature requests
- Join discussions in GitHub Discussions
- Email: support@example.com (replace with your contact)

---

**Made with ❤️ by the FOSS Community**

*Your data is secure - All processing happens client-side*
