# CyberQR Deployment Guide

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Install dependencies
npm install
```

### 2. Configure Environment Variables
Edit `.env.local` with your credentials:

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
```

### 3. Firebase Setup
1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Add your web app and copy the configuration

### 4. Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env.local`

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🌐 Production Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms
- **Netlify**: Connect your GitHub repository
- **AWS Amplify**: Use the Next.js preset
- **Google Cloud Run**: Use the provided Dockerfile
- **Azure Static Web Apps**: Use the Next.js template

## 🧪 Testing
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 📱 PWA Features
The app includes:
- Service Worker for offline functionality
- Web App Manifest for installability
- Responsive design for mobile devices
- Push notification support (ready for implementation)

## 🔒 Security Considerations
- All API keys are environment variables
- Firebase security rules are configured
- HTTPS is enforced in production
- Content Security Policy headers are set
- No sensitive data is stored in localStorage

## 📊 Performance Optimization
- Next.js automatic code splitting
- Image optimization
- Service Worker caching
- Lazy loading of components
- Optimized bundle size

## 🐛 Troubleshooting

### Common Issues
1. **Firebase connection failed**: Check your environment variables
2. **Gemini API errors**: Verify your API key and quota
3. **Build failures**: Ensure all dependencies are installed
4. **PWA not working**: Check manifest.json and service worker

### Debug Mode
```bash
# Enable debug logging
DEBUG=cyberqr:* npm run dev
```

## 📈 Monitoring
- Built-in error boundaries
- Performance monitoring ready
- Analytics integration support
- Health check endpoint at `/api/health`

## 🔄 Updates
To update the application:
1. Pull latest changes
2. Update dependencies: `npm update`
3. Run tests: `npm test`
4. Deploy: `vercel --prod`

## 📞 Support
For deployment issues:
1. Check the logs in your hosting platform
2. Verify environment variables
3. Test locally first
4. Contact the development team

---

**Ready to deploy! 🚀**
