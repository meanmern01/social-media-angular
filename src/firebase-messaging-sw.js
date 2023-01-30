import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAi3Esxvsy8U-hUGIuDZvcP4anv4-zLrMw",
  authDomain: "social-media-app-angular.firebaseapp.com",
  projectId: "social-media-app-angular",
  storageBucket: "social-media-app-angular.appspot.com",
  messagingSenderId: "830183336414",
  appId: "1:830183336414:web:9e2c9c04bdd690ab1e554f",
});

const messaging = getMessaging(firebaseApp);
