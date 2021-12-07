//import firebase from 'firebase';
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, SENDER_ID } from "@env";

export default firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectID: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: SENDER_ID
}

//export default !firebase.getApps().length ? firebase.initializeApp(firebaseConfig) : firebase.getApp();
