import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Register
  // =========================
  const createUser = (email, password) => {
    setLoading(true);

    return createUserWithEmailAndPassword(auth, email, password);
  };

  // =========================
  // Login
  // =========================
  const signInUser = (email, password) => {
    setLoading(true);

    return signInWithEmailAndPassword(auth, email, password);
  };

  // =========================
  // Update Profile
  // =========================
  const updateUserProfile = (profileData) => {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No authenticated user found"));
    }

    return updateProfile(auth.currentUser, profileData);
  };

  // =========================
  // Google Login
  // =========================
  const googleLogin = () => {
    setLoading(true);

    return signInWithPopup(auth, googleProvider);
  };

  // =========================
  // Reset Password
  // =========================
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // =========================
  // Logout
  // =========================
  const logOut = async () => {
    try {
      setLoading(true);

      // Firebase logout
      await signOut(auth);

      // Remove JWT if exists
      localStorage.removeItem("access-token");

      // Explicitly clear user
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // User Observer
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Firebase Auth User:", currentUser);

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    googleLogin,
    logOut,
    updateUserProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
