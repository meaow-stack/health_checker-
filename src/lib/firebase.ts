
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// More explicit logging for debugging on the server-side
console.log("--- Firebase Configuration Check (src/lib/firebase.ts) ---");
const essentialKeys: (keyof typeof firebaseConfig)[] = ['apiKey', 'authDomain', 'projectId'];
let allEssentialKeysPresent = true;

essentialKeys.forEach(key => {
  const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
  const value = firebaseConfig[key];
  if (!value) {
    console.error(`ERROR: Firebase config key "${key}" (from env variable "${envVarName}") is MISSING or undefined.`);
    allEssentialKeysPresent = false;
  } else {
    console.log(`${envVarName}: Loaded ${key === 'apiKey' ? '(ends with ' + String(value).slice(-5) + ')' : '('+ String(value) +')'}`);
  }
});

// Log other keys as well for completeness, but don't factor them into 'allEssentialKeysPresent' for the fatal error message
// as their absence might not always cause an immediate crash, though functionality might be impaired.
console.log(`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${firebaseConfig.storageBucket || 'NOT LOADED or undefined'}`);
console.log(`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${firebaseConfig.messagingSenderId || 'NOT LOADED or undefined'}`);
console.log(`NEXT_PUBLIC_FIREBASE_APP_ID: ${firebaseConfig.appId || 'NOT LOADED or undefined'}`);


if (!allEssentialKeysPresent) {
  console.error("FATAL ERROR: One or more essential Firebase environment variables (apiKey, authDomain, projectId) are missing.");
  console.error("Please ensure they are correctly set in your .env.local file (located in the project root, NOT /src) and that the server has been RESTARTED.");
  console.error("You can get these values from your Firebase project settings: Project settings (gear icon) > General > Your apps > Web app > SDK setup and configuration (Config option).");
  console.log("The application will likely fail to initialize Firebase correctly or not at all.");
}
console.log("--- End of Firebase Configuration Check ---");

let app: FirebaseApp;

if (!allEssentialKeysPresent) {
  // If essential keys are missing, we shouldn't attempt to initialize Firebase.
  // This will lead to errors when `getAuth` is called later, but makes the root cause (missing config) clearer.
  console.error("Firebase App initialization SKIPPED due to missing essential configuration values.");
  // Assign a dummy object to satisfy TypeScript. Subsequent Firebase calls (like getAuth) will fail.
  // This is for debugging; a production app might show a maintenance page or disable Firebase features.
  app = {} as FirebaseApp; // This will ensure getAuth(app) fails if app is not properly initialized.
} else if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

// The error "auth/invalid-api-key" originates here if firebaseConfig was used to initialize 'app'
// but the API key (or other details) within that config was incorrect.
// If 'app' is the dummy object due to missing essential keys, getAuth will also fail, but for a different reason.
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
