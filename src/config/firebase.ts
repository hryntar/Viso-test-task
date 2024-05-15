import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyDu0dwonXJkksIIAwhQrehSg1SdOvZO0yI",
   authDomain: "viso-test-task-f37b8.firebaseapp.com",
   projectId: "viso-test-task-f37b8",
   storageBucket: "viso-test-task-f37b8.appspot.com",
   messagingSenderId: "637250850887",
   appId: "1:637250850887:web:a9bb5a73ef71de0b822162",
   measurementId: "G-JQFRTJBBBX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);