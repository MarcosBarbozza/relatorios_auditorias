import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// COLE SUA CONFIGURAÇÃO AQUI (Substitua este bloco pelo que copiou do console)
const firebaseConfig = {
  apiKey: "AIzaSyD1sZneZFemV7egJMVGgERJh6Ar4w5OA9Y",
  authDomain: "relatorios-auditoria.firebaseapp.com",
  projectId: "relatorios-auditoria",
  storageBucket: "relatorios-auditoria.firebasestorage.app",
  messagingSenderId: "903141273656",
  appId: "1:903141273656:web:6aa8a7e8f2ce8b766af6cd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);