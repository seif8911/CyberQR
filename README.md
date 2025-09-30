# CyberQR - Production-Ready Cybersecurity Application

A complete, production-ready cybersecurity application for the Digitopia competition (Secure UI Challenges) by team Code Crew.

## 🛡️ Mission

Build a fully functional QR code security scanner with real-time threat detection, comprehensive cybersecurity education, and gamified learning experiences.

## ✨ Features

### Core Functionality
- **Real-time QR Code Scanning** with camera integration
- **Advanced Security Analysis** using Gemini AI API
- **Three-Tier Risk Assessment** (Safe, Caution, Malicious)
- **Comprehensive Education Platform** with interactive lessons
- **ICSA Hub** with 6 mini-games in 2x3 grid layout
- **Advanced Gamification** with XP, badges, and AI-powered pet companion

### Security Analysis
- URL extraction and normalization
- Google Safe Browsing API integration
- VirusTotal API for malware scanning
- Custom phishing detection using machine learning
- Domain reputation checking
- Risk score calculation (0-100 scale)

### Educational Modules
- Phishing Detection Master Class
- URL Analysis Workshop
- Social Engineering Awareness
- Digital Privacy Protection
- Mobile Security Essentials
- Financial Cybersecurity
- Arabic Cybersecurity Module (Culturally Adapted)

### Gamification System
- Dynamic XP system with progress tracking
- 20+ Achievement Categories with badges
- Daily challenges and streaks
- AI-powered pet companion with contextual tips
- Community leaderboards

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Analysis**: Google Gemini API
- **QR Scanning**: qr-scanner library
- **Animations**: Framer Motion
- **PWA**: Service Worker with offline support

## 🎨 Design System

### Color Palette (Exact Values)
```css
:root {
  --bg: #333333;           /* Primary background */
  --card: #35332e;         /* Secondary/card backgrounds */
  --text: #f1f5f9;         /* Primary text (light) */
  --muted: #cbd5e1;        /* Secondary text (muted) */
  --ok: #4ade80;           /* Success/safe (green) */
  --warn: #f87171;         /* Warning/danger (red) */
  --accent: #f9b222;       /* Primary accent (orange) */
  --accent-2: #22d3ee;     /* Secondary accent (cyan) */
  --shadow: 0 10px 24px rgba(0,0,0,.35);
  --radius: 18px;          /* Standard border radius */
}
```

### Layout Requirements
- Phone-like container: 390px width, 800px height, 32px rounded corners
- Dark cybersecurity theme with professional aesthetic
- Glass morphism effects with subtle borders and shadows
- Smooth animations: 0.35s ease transitions between screens
- Mobile-first responsive design

## 📱 Installation & Setup

### Prerequisites
- Node.js 18.0.0 or higher
- Firebase project with Firestore enabled
- Google Gemini API key

### Environment Setup
1. Copy `env.example` to `.env.local`
2. Fill in your Firebase and Gemini API credentials:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

SAFE_BROWSING_API_KEY=Your_Api_Key
VIRUSTOTAL_API_KEY=Your_Virustotal_api_key
NEXT_PUBLIC_GEMINI_API_KEY=Gemini_Api_Key
```

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with design system
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── ScannerScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   ├── ICSAHubScreen.tsx
│   │   ├── EducationScreen.tsx
│   │   └── OnboardingScreen.tsx
│   ├── PhoneContainer.tsx # Main container component
│   ├── ScreenManager.tsx  # Screen routing logic
│   ├── Navigation.tsx     # Bottom navigation
│   └── PetCompanion.tsx   # AI pet companion
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   ├── gemini.ts          # Gemini AI integration
│   └── store.ts           # Zustand store
└── types/                 # TypeScript type definitions
```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Add your web app to the project
5. Copy the configuration to your `.env.local`

### Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env.local`

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Azure Static Web Apps

## 📊 Performance & Monitoring

### Performance Targets
- Sub-2-second load times for all major features
- 60fps animations using hardware acceleration
- Offline functionality for core features
- Progressive Web App capabilities

### Monitoring
- Built-in error boundaries
- Performance monitoring ready
- Analytics integration support
- Security audit logging

## 🧪 Testing Strategy

### Test Coverage
- 95%+ code coverage target
- Unit tests for all components
- Integration tests for API calls
- End-to-end testing for user workflows
- Accessibility testing (WCAG 2.1 AA)

### Test Types
- Component testing with React Testing Library
- API integration testing
- Security testing
- Performance testing
- Cross-browser compatibility

## 🔒 Security Features

### Data Protection
- Privacy-first design with minimal data collection
- End-to-end encryption for sensitive data
- GDPR/CCPA compliance ready
- Secure API communication

### Threat Detection
- Multi-layer threat detection
- Real-time API integration
- Machine learning models for zero-day detection
- Community threat intelligence

## 📈 Success Metrics

### User Engagement
- 50,000+ active users target
- 70%+ 30-day retention rate
- 5+ minutes average session duration
- 80%+ feature adoption

### Educational Impact
- 60%+ completion rate for modules
- Measurable security behavior improvement
- Community contribution metrics

## 🤝 Contributing

### Team Code Crew
- **Salma Khaled** – Team Leader
- **Loujain Sameh** – Developer
- **Seif Islam** – Developer
- **Hana Sameh** – Developer
- **Jana Al Halafawy** – Developer

### Development Guidelines
- Follow TypeScript best practices
- Maintain 95%+ test coverage
- Use conventional commit messages
- Follow accessibility guidelines
- Security-first development approach

## 📄 License

This project is developed for the Digitopia competition. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ by Code Crew for Digitopia Competition**
