// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp({
  apiKey: "AIzaSyAi3Esxvsy8U-hUGIuDZvcP4anv4-zLrMw",
  authDomain: "social-media-app-angular.firebaseapp.com",
  projectId: "social-media-app-angular",
  storageBucket: "social-media-app-angular.appspot.com",
  messagingSenderId: "830183336414",
  appId: "1:830183336414:web:9e2c9c04bdd690ab1e554f",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
