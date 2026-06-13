# 🔐 Secure 2FA Authenticator

A modern, secure, and open-source Two-Factor Authentication (2FA) web application built with Next.js. Features dark/light mode, guest and private accounts, QR code generation, and encrypted storage.

## ✨ Features

### Security & Privacy
- **Guest Mode**: Use without an account - secrets are not stored
- **Private Accounts**: Sign in with Google or GitHub to save encrypted secrets
- **AES-256 Encryption**: All stored secrets are encrypted at rest
- **Client-Side Code Generation**: TOTP codes generated securely
- **No Third-Party Data Sharing**: Your data stays yours
- **FOSS**: Fully open source - audit the code anytime

### User Experience
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **QR Code Generation**: Generate QR codes for easy setup in authenticator apps
- **Copy/Paste Buttons**: Quick copy generated codes, paste secrets from clipboard
- **Real-Time Countdown**: Visual progress bar showing code refresh timer
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Optimized Performance**: Built with Next.js for fast loading

### Technical Features
- **Next.js 14**: Modern React framework with App Router
- **NextAuth.js**: Secure authentication with OAuth providers
- **Prisma ORM**: Type-safe database access
- **SQLite/PostgreSQL**: Flexible database support
- **TypeScript**: Full type safety
- **Vercel Ready**: Optimized for Vercel deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd secure-2fa-authenticator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `ENCRYPTION_KEY`: Minimum 32 characters
- OAuth credentials (optional, for private accounts)

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment to Vercel

1. Push your code to GitHub

2. Connect your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXTAUTH_URL`: Your production URL
     - `NEXTAUTH_SECRET`: Random secret (use `openssl rand -base64 32`)
     - `ENCRYPTION_KEY`: Minimum 32 characters
     - OAuth credentials (if using private accounts)
   - For production, use PostgreSQL instead of SQLite:
     - Add a PostgreSQL database (Vercel Postgres or external)
     - Update `DATABASE_URL` in environment variables

3. Deploy!

## 🔒 Security Considerations

### For Users
- Guest users: Secrets are NOT stored anywhere. You must enter them each time.
- Private accounts: Secrets are encrypted with AES-256 before storage.
- Never share your 2FA codes with anyone.
- Enable two-factor authentication on your OAuth accounts (Google/GitHub).

### For Developers
- Change `ENCRYPTION_KEY` in production - never use the default.
- Use strong `NEXTAUTH_SECRET` - generate randomly.
- Enable HTTPS in production (automatic on Vercel).
- Review and audit the code - it's open source!
- Consider rate limiting for production use.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js (Google, GitHub, Credentials)
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Styling**: Custom CSS with CSS Variables
- **TOTP**: otplib
- **QR Codes**: qrcode library
- **Encryption**: crypto-js (AES)
- **Deployment**: Vercel

## 📁 Project Structure

```
/workspace
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── generatecode/ # TOTP code generation
│   │   └── totp/         # Secret management
│   ├── components/       # React components
│   ├── lib/              # Utilities (prisma, encryption, auth)
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## 🤝 Contributing

This is FOSS (Free and Open Source Software). Contributions welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details.

## ⚠️ Disclaimer

This software is provided "as is" without warranty of any kind. While security best practices are implemented, users should audit the code and use at their own risk. For critical accounts, consider using established authenticator apps.

## 🙏 Acknowledgments

- [otplib](https://github.com/hectorgomez/otplib) for TOTP generation
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Prisma](https://www.prisma.io/) for database management
- [Next.js](https://nextjs.org/) for the React framework

---

Made with ❤️ for privacy and security advocates.
