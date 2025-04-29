/* // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1ZK7SNRlHFoi9S4Pv7WIipz5YvL2wOKo",
  authDomain: "apppermissions-913a6.firebaseapp.com",
  projectId: "apppermissions-913a6",
  storageBucket: "apppermissions-913a6.firebasestorage.app",
  messagingSenderId: "461796691751",
  appId: "1:461796691751:web:47242ed9117a4e75702302",
  measurementId: "G-JNDVZ0E3NY"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);

export const firebase_db = getFirestore(firebase);

export const auth = getAuth(firebase);
 */

// Importar las funciones necesarias del SDK de Firebase
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1ZK7SNRlHFoi9S4Pv7WIipz5YvL2wOKo",
  authDomain: "apppermissions-913a6.firebaseapp.com",
  projectId: "apppermissions-913a6",
  storageBucket: "apppermissions-913a6.appspot.com",
  messagingSenderId: "461796691751",
  appId: "1:461796691751:web:47242ed9117a4e75702302",
  measurementId: "G-JNDVZ0E3NY"
};

// Evitar reinicialización múltiple
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exportar instancias de Firebase
export { firebaseApp };
export const firebase_db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

