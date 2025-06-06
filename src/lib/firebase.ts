
// IMPORTANT: Replace with your actual Firebase project configuration!
// You can get this from the Firebase console:
// Project settings > General > Your apps > Firebase SDK snippet > Config

import { initializeApp, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // REPLACE THIS
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // REPLACE THIS
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com", // REPLACE THIS
  projectId: "YOUR_PROJECT_ID", // REPLACE THIS
  storageBucket: "YOUR_PROJECT_ID.appspot.com", // REPLACE THIS
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // REPLACE THIS
  appId: "YOUR_APP_ID", // REPLACE THIS
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
