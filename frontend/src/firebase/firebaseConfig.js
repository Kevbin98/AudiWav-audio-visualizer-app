// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkF6Uor1et96noCEcZPdTWvdu_LN6hGhU",
  authDomain: "audio-visualizer-app-f7567.firebaseapp.com",
  projectId: "audio-visualizer-app-f7567",
  storageBucket: "audio-visualizer-app-f7567.firebasestorage.app",
  messagingSenderId: "684120366439",
  appId: "1:684120366439:web:11fe9be5a79cf3cd5f63c2",
  measurementId: "G-D7W95S2NG7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
//const analytics = getAnalytics(app);

export { auth, provider, db, storage };
