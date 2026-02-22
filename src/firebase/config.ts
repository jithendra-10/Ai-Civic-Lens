// Firebase config — reads from NEXT_PUBLIC_FIREBASE_* (client+server) or
// falls back to FIREBASE_* (server-only). Both naming conventions work.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? process.env.FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? process.env.FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? process.env.FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? process.env.FIREBASE_APP_ID ?? '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? process.env.FIREBASE_MEASUREMENT_ID ?? '',
};

/** Returns true when every required Firebase config value is present. */
export const isFirebaseConfigured = () =>
  !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
