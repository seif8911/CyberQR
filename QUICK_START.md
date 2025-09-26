# Quick Start Guide

## 🚀 Get CyberQR Running in 2 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File
```bash
# Create .env.local file with these variables (you can use dummy values for testing):
NEXT_PUBLIC_FIREBASE_API_KEY=test_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=test.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=test_app_id
NEXT_PUBLIC_GEMINI_API_KEY=test_gemini_key
```

### Step 3: Run Development Server
```bash
npm run dev
```

### Step 4: Test Navigation
1. Open http://localhost:3000
2. You should see a debug panel in the top-left corner showing the current screen
3. Try clicking the navigation buttons at the bottom
4. Try clicking the debug buttons in the debug panel
5. Check the browser console for debug messages

## 🐛 Debugging Navigation Issues

If navigation isn't working:

1. **Check Console**: Open browser dev tools and look for console logs
2. **Debug Panel**: Use the debug buttons in the top-left corner
3. **Store State**: Console logs will show when store state changes
4. **Screen Rendering**: Console logs will show which screen is being rendered

## 🔧 What I Fixed

1. **Simplified Screen Management**: Replaced complex screen transitions with simple show/hide
2. **Added Debugging**: Console logs and debug panel to track state changes
3. **Removed Persist**: Temporarily removed Zustand persist to eliminate potential issues
4. **Added Visual Feedback**: Debug panel shows current screen and provides test buttons

## 📱 Features to Test

Once navigation is working, test these features:
- ✅ Home screen with quick action buttons
- ✅ Scanner screen with mock QR scanning
- ✅ ICSA Hub with educational modules
- ✅ Navigation footer with active states
- ✅ Pet companion with contextual messages

## 🆘 Still Not Working?

If you're still having issues:
1. Clear browser cache and reload
2. Check if there are any TypeScript errors: `npm run build`
3. Try a different browser
4. Check the Network tab for any failed requests

The debug panel should immediately show you what's happening with the navigation!
