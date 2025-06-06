
// IMPORTANT: Replace with your actual Firebase project configuration!
// You can get this from the Firebase console:
// Project settings > General > Your apps > Firebase SDK snippet > Config

import { initializeApp, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCj_JA2XBS4kO5Koq_ooEwarB1H4rm-yKM",
  authDomain: "ringapp-d68f7.firebaseapp.com",
  databaseURL: "https://ringapp-d68f7-default-rtdb.firebaseio.com",
  projectId: "ringapp-d68f7",
  storageBucket: "ringapp-d68f7.firebasestorage.app",
  messagingSenderId: "962080254010",
  appId: "1:962080254010:web:f5fa88eb8c9d19496bed03",
  measurementId: "G-YK36MGM8CH"
};

let app: FirebaseApp;
let database: Database;

try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.error(
    "Firebase is not configured. Please update src/lib/firebase.ts with your project's Firebase configuration."
  );
  // You might want to throw an error here or handle this case more gracefully in a production app
}


database = getDatabase(app);

// For a production app, ensure you have set up appropriate Firebase Realtime Database rules
// to secure your data. For example, you might want to restrict read/write access.

export { app, database };
