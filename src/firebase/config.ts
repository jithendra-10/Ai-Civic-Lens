// Firebase config values are injected via environment variables.
// Set these in Netlify: Site Settings → Build & deploy → Environment variables
// Use NEXT_PUBLIC_ prefix so Next.js exposes them to the browser bundle too.

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
};

/** Returns true when every required Firebase config value is present. */
export const isFirebaseConfigured = () =>
  !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
