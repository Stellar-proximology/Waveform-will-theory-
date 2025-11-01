{
  "name": "waveform-will-theory-app",
  "version": "1.0.0",
  "description": "Field Resonance Logging Engine for Consciousness Research",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "firebase": "^10.0.0",
    "recharts": "^2.8.0",
    "lucide-react": "^0.263.1",
    "jspdf": "^2.5.1",
    "mathjs": "^11.0.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.0.0"
  },
  "keywords": [
    "consciousness",
    "resonance",
    "biofeedback",
    "field-theory",
    "stellar-proximology"
  ],
  "author": "Waveform Will Theory Research Team",
  "license": "MIT"
}

---

// Installation and Setup Instructions

/*
WAVEFORM WILL THEORY APP - SETUP GUIDE
=====================================

1. INITIAL SETUP
   ```bash
   npx create-next-app@latest waveform-will-theory --typescript --tailwind --eslint --app
   cd waveform-will-theory
   npm install firebase recharts lucide-react jspdf mathjs lodash
   ```

2. FIREBASE SETUP
   - Go to https://console.firebase.google.com/
   - Create new project: "waveform-will-theory"
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Enable Analytics
   - Copy your config to firebase.js

3. PROJECT STRUCTURE
   ```
   waveform-will-theory/
   ├── src/
   │   ├── app/
   │   │   ├── page.tsx                    // Main app component
   │   │   ├── theory/page.tsx             // Theory overview
   │   │   ├── proximology/page.tsx        // Stellar proximology
   │   │   ├── fieldlog/page.tsx           // User dashboard
   │   │   ├── settings/page.tsx           // Privacy controls
   │   │   └── studies/
   │   │       ├── design-coherence/page.tsx
   │   │       └── heart-vector/page.tsx
   │   ├── components/
   │   │   ├── TheoryNav.tsx
   │   │   ├── ClaimCard.tsx
   │   │   ├── ResonanceTracker.tsx
   │   │   ├── GatePlayer.tsx
   │   │   └── ui/
   │   │       └── Button.tsx
   │   ├── utils/
   │   │   ├── recordResonance.js
   │   │   ├── gateCalculations.js
   │   │   ├── toneGenerator.js
   │   │   ├── biofeedbackIntegration.js
   │   │   └── pdfGenerator.js
   │   ├── firebase.js
   │   └── types/
   │       └── index.ts
   ├── public/
   ├── tailwind.config.js
   └── next.config.js
   ```

4. FIRESTORE SECURITY RULES
   ```javascript
   // firestore.rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Anonymous resonance logs for research (if user opted in)
       match /resonanceLogs/{logId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           resource.data.userId == request.auth.uid;
       }
       
       // Experiment results
       match /experimentResults/{resultId} {
         allow read, write: if request.auth != null && 
           resource.data.userId == request.auth.uid;
       }
       
       // Global stats (read-only)
       match /globalStats/{document} {
         allow read: if request.auth != null;
       }
     }
   }
   ```

5. ENVIRONMENT VARIABLES
   Create .env.local:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

6. TAILWIND CONFIG
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
       './src/components/**/*.{js,ts,jsx,tsx,mdx}',
       './src/app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {
         colors: {
           'waveform': {
             50: '#f5f3ff',
             500: '#9333ea',
             600: '#7c3aed',
             700: '#6d28d9',
             900: '#4c1d95',
           }
         },
         animation: {
           'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
           'fade-in': 'fadeIn 0.5s ease-in-out',
         },
         keyframes: {
           fadeIn: {
             '0%': { opacity: '0', transform: 'translateY(10px)' },
             '100%': { opacity: '1', transform: 'translateY(0)' },
           }
         }
       },
     },
     plugins: [],
   }
   ```

7. DEPLOYMENT OPTIONS
   
   A. Vercel (Recommended for Next.js):
      ```bash
      npm i -g vercel
      vercel login
      vercel --prod
      ```
   
   B. Netlify:
      ```bash
      npm run build
      npm run export
      # Upload dist/ folder to Netlify
      ```
   
   C. Firebase Hosting:
      ```bash
      npm install -g firebase-tools
      firebase login
      firebase init hosting
      npm run build
      firebase deploy
      ```

8. BIOFEEDBACK DEVICE INTEGRATION
   
   For HRV devices (HeartMath, Polar H10, etc.):
   ```javascript
   // Add to utils/biofeedbackIntegration.js
   async connectPolarH10() {
     try {
       const device = await navigator.bluetooth.requestDevice({
         filters: [{ services: ['heart_rate'] }],
         optionalServices: ['battery_service']
       });
       
       const server = await device.gatt.connect();
       const service = await server.getPrimaryService('heart_rate');
       const characteristic = await service.getCharacteristic('heart_rate_measurement');
       
       return characteristic;
     } catch (error) {
       console.error('Bluetooth connection failed:', error);
       throw error;
     }
   }
   ```

9. TESTING SETUP
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom
   ```
   
   Create jest.config.js:
   ```javascript
   const nextJest = require('next/jest')
   
   const createJestConfig = nextJest({
     dir: './',
   })
   
   const customJestConfig = {
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     moduleNameMapping: {
       '^@/components/(.*)$': '<rootDir>/src/components/$1',
       '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
     },
     testEnvironment: 'jest-environment-jsdom',
   }
   
   module.exports = createJestConfig(customJestConfig)
   ```

10. PROGRESSIVE WEB APP (PWA) SETUP
    ```bash
    npm install next-pwa
    ```
    
    Add to next.config.js:
    ```javascript
    const withPWA = require('next-pwa')({
      dest: 'public'
    })
    
    module.exports = withPWA({
      // Your Next.js config
    })
    ```

11. DEVELOPMENT WORKFLOW
    ```bash
    # Start development server
    npm run dev
    
    # Build for production
    npm run build
    
    # Start production server
    npm start
    
    # Run linting
    npm run lint
    ```

12. DATA PRIVACY COMPLIANCE
    - Implement GDPR consent forms
    - Add data export functionality
    - Provide clear privacy policy
    - Enable data deletion on request
    - Use Firebase security rules for data isolation

13. ANALYTICS & MONITORING
    - Firebase Analytics for user behavior
    - Error monitoring with Sentry
    - Performance monitoring with Web Vitals
    - A/B testing for UI improvements

NEXT STEPS:
- Set up Firebase project
- Copy provided components into project structure
- Configure authentication
- Test biofeedback device connections
- Deploy to staging environment
- Implement user onboarding flow
*/
