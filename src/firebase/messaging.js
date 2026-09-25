import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { app } from "./firebase.config";

const messaging = getMessaging(app);

const VAPID_KEY =
  "BPmHxP7a1kVUZgDa2Es1uFCaoDsUW-OSOLX5hjOKoVy6MN7b7rJtZWp-yqOQW4_j9McZEr8lGHYugNp8nsCXWNw";

export const requestNotificationPermission = async () => {
  try {
    // Browser notification permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Register Firebase Messaging Service Worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      {
        scope: "/",
      },
    );

    console.log("Firebase Messaging Service Worker registered:", registration);

    // Wait until Service Worker becomes active
    await navigator.serviceWorker.ready;

    console.log("Firebase Messaging Service Worker is active");

    // Get FCM Token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.log("FCM token not available");
      return null;
    }

    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.error("Notification permission/token error:", error);

    return null;
  }
};

// Foreground notification
export const listenForForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Foreground notification:", payload);

    const title = payload.notification?.title || "রহমানিয়া জামে মসজিদ";

    const body = payload.notification?.body || "নতুন একটি নোটিফিকেশন এসেছে।";

    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/logo.jpg",
      });
    }
  });
};
