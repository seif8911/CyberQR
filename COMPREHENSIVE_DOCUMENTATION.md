# 🛡️ CyberQR - Project Documentation

> **Cybersecurity QR Code Scanner & Educational Platform**  
> Built by Code Crew for Digitopia Competition

---

## 🎯 Project Overview

CyberQR is a production-ready cybersecurity application that combines real-time QR code threat detection with comprehensive cybersecurity education through gamified learning experiences.

### Key Features
- **Real-time QR Code Scanning** with multi-layer threat analysis
- **Educational Platform** with 6 interactive mini-games
- **Gamification System** with XP, badges, streaks, and AI pet companion
- **Mobile-First Design** with desktop support and PWA capabilities
- **Enterprise-Grade Security** with Firebase integration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0+
- Firebase account
- Google AI Studio account

### Setup
1. Clone repository and install dependencies
2. Create `.env.local` with your API keys
3. Run `npm run dev`
4. Access at http://localhost:3000

---

## ⚙️ Environment Configuration

### Required Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Optional Environment Variables

```bash
# Enhanced Security Analysis
SAFE_BROWSING_API_KEY=your_safe_browsing_key
VIRUSTOTAL_API_KEY=your_virustotal_key

# Image Upload Service
IMGBB_API_KEY=your_imgbb_api_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Firebase Setup
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Enable Storage
5. Add web app and copy configuration

### Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to environment variables

### imgBB API Setup (Optional - for image uploads)
1. Go to [imgBB API](https://api.imgbb.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to environment variables as `IMGBB_API_KEY`

**imgBB Features:**
- Free image hosting up to 32MB per image
- Automatic image optimization and resizing
- Multiple image formats (original, thumb, medium)
- Configurable expiration times
- CDN delivery for fast loading
- Direct file upload (no base64 conversion needed)

---

## 🏗️ Technology Stack

### Core Technologies
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Analysis**: Google Gemini API
- **Security APIs**: Safe Browsing, VirusTotal
- **Image Upload**: imgBB API

### Project Structure
- **25+ Screen Components** for different app sections
- **Responsive Design** with mobile-first approach
- **PWA Capabilities** with service worker
- **Real-time Security Analysis** with multi-provider checks

---

## 📱 Application Features

### Core Screens
- **Home Screen**: Dashboard with quick actions
- **Scanner Screen**: QR code scanning interface
- **Result Screens**: Analysis results (Safe/Caution/Malicious)
- **ICSA Hub**: Educational center with 6 mini-games
- **Profile Screen**: User management and settings

### Educational Modules
1. **Phishing Detection Master Class**
2. **Secure Coding Workshop**
3. **Least Privilege Principle**
4. **Encryption Fundamentals**
5. **Security Quiz Challenge**
6. **Two-Factor Authentication Setup**

### Gamification
- **XP System**: Dynamic experience points
- **Badge System**: 20+ achievement categories
- **Streak Tracking**: Daily activity monitoring
- **AI Pet Companion**: Contextual tips and feedback

### Image Management
- **Cloud Storage**: imgBB integration for image uploads
- **Profile Pictures**: User avatar management
- **QR Code Images**: Temporary storage for scanned images
- **Automatic Expiration**: Images auto-delete after set time

---

## 🌐 Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` to deploy
3. Set environment variables in dashboard

### Other Platforms
- **Netlify**: Connect GitHub repository
- **AWS Amplify**: Use Next.js preset
- **Google Cloud Run**: Use provided Dockerfile
- **Azure Static Web Apps**: Use GitHub Actions

### Production Environment Variables
Same as development but with production API keys and Firebase project.

---

## 🧪 Testing

### Commands
- `npm test` - Run all tests
- `npm run test:coverage` - Run with coverage
- `npm run test:watch` - Watch mode
- `npm run lint` - Code linting

### Coverage Goals
- Overall: 95%+
- Components: 100%
- Utilities: 100%
- API Routes: 90%+

---

## 🔒 Security Features

### Threat Detection
- **Multi-Layer Analysis**: Safe Browsing, VirusTotal, Gemini AI, Heuristics
- **Risk Assessment**: Three-tier system (Safe, Caution, Malicious)
- **URL Normalization**: Intelligent URL processing
- **DNS Verification**: Domain existence checking

### Data Protection
- **Privacy-First Design**: Minimal data collection
- **End-to-End Encryption**: Secure data transmission
- **HTTPS Enforcement**: All communications encrypted
- **Input Validation**: Sanitized user inputs

---

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection Failed**
- Check environment variables
- Verify Firebase project settings
- Ensure services are enabled

**Gemini API Errors**
- Verify API key validity
- Check quota limits
- Test with simple request

**QR Scanner Not Working**
- Ensure HTTPS is enabled (required for camera)
- Check browser permissions
- Verify camera access

**Build Failures**
- Clear cache: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Check TypeScript errors: `npx tsc --noEmit`

**Image Upload Issues**
- Verify imgBB API key is set correctly
- Check image file size (max 32MB for imgBB)
- Ensure image format is supported (JPG, PNG, GIF, WebP)
- Check imgBB API quota limits

### Browser Support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile: iOS Safari 14+, Chrome Mobile 90+

---

## 🤝 Team & Contributing

### Code Crew Team
- **Salma Khaled** – Team Leader
- **Loujain Sameh** – Frontend Developer
- **Seif Islam** – Full-Stack Developer
- **Hana Sameh** – Backend Developer
- **Jana Al Halafawy** – QA Engineer

### Development Guidelines
- TypeScript strict mode
- ESLint + Prettier
- 95%+ test coverage
- Security-first approach

---

## 📞 Support

### Resources
- **GitHub Issues**: Bug reports and features
- **Documentation**: This guide and inline docs
- **Community**: Discord and Stack Overflow

### Contact
- **Email**: team@codecrew.dev
- **Repository**: https://github.com/codecrew/cyberqr

---

**Built with ❤️ by Code Crew for Digitopia Competition**
