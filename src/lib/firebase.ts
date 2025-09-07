import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfhvJ8NkJpPmBpuwkKsZ2q0meR-ByXYS0",
  authDomain: "luex-55e78.firebaseapp.com",
  databaseURL: "https://luex-55e78-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "luex-55e78",
  storageBucket: "luex-55e78.appspot.com",
  messagingSenderId: "140623239222",
  appId: "1:140623239222:web:97dd61bec582af87a3e097",
  measurementId: "G-XFZM6P9TQT"
};

export const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // ignore analytics errors in non-browser or unsupported env
  });
}
