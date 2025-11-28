import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCbWP3PMOwjH4QNlIMjPOsL4TPzm-dx55k",
    authDomain: "imposter-fc91c.firebaseapp.com",
    projectId: "imposter-fc91c",
    storageBucket: "imposter-fc91c.firebasestorage.app",
    messagingSenderId: "397069855138",
    appId: "1:397069855138:web:50ce343e7aa3a22d9f6afb",
    measurementId: "G-4HN0Q7J42G"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export { db, analytics };
