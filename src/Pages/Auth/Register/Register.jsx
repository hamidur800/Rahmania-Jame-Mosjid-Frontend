import { Link, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMosque,
  FaPhone,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../../provider/AuthProvider";

const Register = () => {
  // IMPORTANT:
  // logOut must be taken from AuthContext
  const { createUser, googleLogin, logOut } = useContext(AuthContext);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // API BASE URL
  // ==========================================
  const API_URL = "https://rahmania-jame-mosjid-backend.onrender.com";

  // ==========================================
  // PHONE VALIDATION
  // ==========================================
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\s+/g, "");

    const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

    return phoneRegex.test(cleanPhone);
  };

  // ==========================================
  // LOGOUT + CLEANUP
  // ==========================================
  const cleanupAuth = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Firebase logout failed:", error);
    }

    localStorage.removeItem("access-token");
  };

  // ==========================================
  // SAVE USER TO MONGODB
  // ==========================================
  const saveUser = async (user, extraData = {}) => {
    try {
      if (!user) {
        throw new Error("Firebase user পাওয়া যায়নি।");
      }

      // ==========================================
      // PHONE IS REQUIRED
      // ==========================================
      const phone = extraData.phone?.trim() || "";

      if (!phone) {
        throw new Error("ফোন নম্বর ছাড়া রেজিস্ট্রেশন সম্পন্ন করা যাবে না।");
      }

      // ==========================================
      // PHONE VALIDATION
      // ==========================================
      if (!validatePhone(phone)) {
        throw new Error("সঠিক বাংলাদেশি ফোন নম্বর দিন। উদাহরণ: 01712345678");
      }

      console.log("Firebase User:", user);
      console.log("Firebase UID:", user.uid);

      // ==========================================
      // FIREBASE ID TOKEN
      // ==========================================
      const token = await user.getIdToken(true);

      // ==========================================
      // USER DATA
      // ==========================================
      const userData = {
        name: extraData.name?.trim() || user.displayName?.trim() || "User",

        phone,

        email: user.email,

        photoURL: user.photoURL || "",

        role: "user",

        authProvider: extraData.authProvider || "password",

        createdAt: new Date().toISOString(),
      };

      console.log("Sending User Data:", userData);

      // ==========================================
      // SEND TO MONGODB
      // ==========================================
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(userData),
      });

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {
          message: text || "Server থেকে সঠিক response পাওয়া যায়নি।",
        };
      }

      console.log("MongoDB Response:", data);

      // ==========================================
      // BACKEND ERROR
      // ==========================================
      if (!response.ok) {
        throw new Error(
          data.message || data.error || "ব্যবহারকারীর তথ্য সংরক্ষণ করা যায়নি।",
        );
      }

      return data;
    } catch (error) {
      console.error("Save User Error:", error);
      throw error;
    }
  };

  // ==========================================
  // CREATE JWT TOKEN
  // ==========================================
  const getJwtToken = async (email) => {
    try {
      if (!email) {
        throw new Error("Email পাওয়া যায়নি।");
      }

      const response = await fetch(`${API_URL}/jwt`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      console.log("JWT Response:", data);

      if (!response.ok || !data.token) {
        throw new Error(data.message || "অথেন্টিকেশন টোকেন তৈরি করা যায়নি।");
      }

      localStorage.setItem("access-token", data.token);

      return data.token;
    } catch (error) {
      console.error("JWT Error:", error);
      throw error;
    }
  };

  // ==========================================
  // NORMAL REGISTER
  // ==========================================
  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    // ==========================================
    // NAME VALIDATION
    // ==========================================
    if (!name) {
      await Swal.fire({
        icon: "warning",
        title: "নাম প্রয়োজন",
        text: "অনুগ্রহ করে আপনার পুরো নাম লিখুন।",
        confirmButtonColor: "#075c46",
      });

      return;
    }

    // ==========================================
    // PHONE REQUIRED
    // ==========================================
    if (!phone) {
      await Swal.fire({
        icon: "warning",
        title: "ফোন নম্বর প্রয়োজন",
        text: "অ্যাকাউন্ট তৈরি করার জন্য ফোন নম্বর আবশ্যক।",
        confirmButtonColor: "#075c46",
      });

      return;
    }

    // ==========================================
    // PHONE VALIDATION
    // ==========================================
    if (!validatePhone(phone)) {
      await Swal.fire({
        icon: "warning",
        title: "ভুল ফোন নম্বর",
        text: "সঠিক বাংলাদেশি ফোন নম্বর দিন। উদাহরণ: 01712345678",
        confirmButtonColor: "#075c46",
      });

      return;
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================
    if (password.length < 6) {
      await Swal.fire({
        icon: "warning",
        title: "দুর্বল পাসওয়ার্ড",
        text: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
        confirmButtonColor: "#075c46",
      });

      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // CREATE FIREBASE USER
      // ==========================================
      const result = await createUser(email, password);

      if (!result?.user) {
        throw new Error("Firebase account তৈরি করা যায়নি।");
      }

      // ==========================================
      // SAVE USER TO MONGODB
      // ==========================================
      await saveUser(result.user, {
        name,
        phone,
        authProvider: "password",
      });

      // ==========================================
      // CREATE JWT
      // ==========================================
      await getJwtToken(result.user.email);

      // ==========================================
      // SUCCESS
      // ==========================================
      await Swal.fire({
        icon: "success",
        title: "রহমানিয়া জামে মসজিদে স্বাগতম 🎉",
        text: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
        timer: 1500,
        showConfirmButton: false,
      });

      form.reset();

      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);

      // ==========================================
      // IMPORTANT:
      // If Firebase account was created but
      // MongoDB/JWT failed, logout Firebase.
      // ==========================================
      await cleanupAuth();

      let errorMessage = err?.message || "কিছু একটা সমস্যা হয়েছে।";

      // ==========================================
      // FIREBASE ERRORS
      // ==========================================
      if (err?.code === "auth/email-already-in-use") {
        errorMessage = "এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট আছে।";
      } else if (err?.code === "auth/invalid-email") {
        errorMessage = "ইমেইল ঠিকানাটি সঠিক নয়।";
      } else if (err?.code === "auth/weak-password") {
        errorMessage = "পাসওয়ার্ড আরও শক্তিশালী দিন।";
      }

      await Swal.fire({
        icon: "error",
        title: "রেজিস্ট্রেশন ব্যর্থ হয়েছে",
        text: errorMessage,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GOOGLE REGISTER
  // ==========================================
  const handleGoogleLogin = async () => {
    let googleUser = null;

    try {
      setLoading(true);

      // ==========================================
      // GOOGLE LOGIN
      // ==========================================
      const result = await googleLogin();

      if (!result?.user) {
        throw new Error("Google account পাওয়া যায়নি।");
      }

      googleUser = result.user;

      const googleName = googleUser.displayName?.trim() || "Google User";

      const googleEmail = googleUser.email;

      console.log("Google User:", googleUser);

      console.log("Google Email:", googleEmail);

      // ==========================================
      // PHONE NUMBER POPUP
      // ==========================================
      const phoneResult = await Swal.fire({
        title: "ফোন নম্বর প্রয়োজন",

        html: `
          <div style="
            font-size:14px;
            color:#6b7280;
            line-height:1.7;
            margin-bottom:8px;
          ">
            স্বাগতম <strong>${googleName}</strong>!<br/>
            Google দিয়ে রেজিস্ট্রেশন সম্পন্ন করতে
            আপনার ফোন নম্বর দিতে হবে।
          </div>
        `,

        input: "tel",

        inputLabel: "বাংলাদেশি ফোন নম্বর",

        inputPlaceholder: "016XXXXXXXX",

        inputAttributes: {
          maxlength: "14",
          inputmode: "numeric",
          autocomplete: "tel",
        },

        confirmButtonText: "রেজিস্ট্রেশন সম্পন্ন করুন",

        confirmButtonColor: "#075c46",

        showCancelButton: true,

        cancelButtonText: "বাতিল",

        allowOutsideClick: false,

        allowEscapeKey: false,

        inputValidator: (value) => {
          const cleanPhone = value?.trim() || "";

          if (!cleanPhone) {
            return "ফোন নম্বর আবশ্যক!";
          }

          if (!validatePhone(cleanPhone)) {
            return "সঠিক বাংলাদেশি ফোন নম্বর দিন। উদাহরণ: 01712345678";
          }

          return undefined;
        },
      });

      // ==========================================
      // PHONE POPUP CANCELLED
      // ==========================================
      if (
        phoneResult.isDismissed ||
        !phoneResult.value ||
        !phoneResult.value.trim()
      ) {
        console.log("Google registration cancelled - logging out Firebase.");

        // VERY IMPORTANT
        // Do NOT delete Google account.
        // Just logout Firebase.
        await cleanupAuth();

        await Swal.fire({
          icon: "warning",

          title: "রেজিস্ট্রেশন বাতিল হয়েছে",

          text: "ফোন নম্বর ছাড়া রেজিস্ট্রেশন সম্পন্ন করা যাবে না।",

          confirmButtonColor: "#075c46",
        });

        return;
      }

      // ==========================================
      // CLEAN PHONE
      // ==========================================
      const cleanPhone = phoneResult.value.trim().replace(/\s+/g, "");

      // ==========================================
      // FINAL PHONE VALIDATION
      // ==========================================
      if (!validatePhone(cleanPhone)) {
        throw new Error("সঠিক বাংলাদেশি ফোন নম্বর দিন।");
      }

      console.log("Google Registration Phone:", cleanPhone);

      // ==========================================
      // SAVE GOOGLE USER TO MONGODB
      // ==========================================
      await saveUser(googleUser, {
        name: googleName,
        phone: cleanPhone,
        authProvider: "google",
      });

      // ==========================================
      // CREATE JWT
      // ==========================================
      await getJwtToken(googleEmail);

      // ==========================================
      // SUCCESS
      // ==========================================
      await Swal.fire({
        icon: "success",

        title: "রহমানিয়া জামে মসজিদে স্বাগতম 🎉",

        text: "Google দিয়ে রেজিস্ট্রেশন সফল হয়েছে।",

        timer: 1500,

        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      console.error("Google Registration Error:", err);

      // ==========================================
      // IMPORTANT:
      // Never leave Firebase logged in when
      // Google registration is incomplete.
      // ==========================================
      await cleanupAuth();

      let errorMessage =
        err?.message || "Google দিয়ে রেজিস্ট্রেশন করতে সমস্যা হয়েছে।";

      // ==========================================
      // GOOGLE POPUP ERRORS
      // ==========================================
      if (err?.code === "auth/popup-closed-by-user") {
        errorMessage = "Google login popup বন্ধ করা হয়েছে।";
      }

      if (err?.code === "auth/cancelled-popup-request") {
        errorMessage = "Google login বাতিল করা হয়েছে।";
      }

      if (err?.code === "auth/popup-blocked") {
        errorMessage = "Browser Google popup block করেছে। Popup allow করুন।";
      }

      await Swal.fire({
        icon: "error",

        title: "Google রেজিস্ট্রেশন ব্যর্থ হয়েছে",

        text: errorMessage,

        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 pt-8 pb-25 transition-colors duration-300 dark:bg-gray-950">
      <div className="w-full max-w-md">
        {/* ==========================================
            LOGO
        ========================================== */}
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-15 w-15 items-center justify-center rounded-2xl bg-[#075c46] p-4 shadow-lg shadow-green-900/20">
            <FaMosque className="text-2xl text-[#e9c46a]" />
          </div>

          <h1 className="text-2xl font-bold text-[#075c46] dark:text-green-400">
            রহমানিয়া জামে মসজিদ
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            সংযুক্ত থাকুন • নামাজ পড়ুন • দ্বীনের পথে চলুন
          </p>
        </div>

        {/* ==========================================
            REGISTER CARD
        ========================================== */}
        <div className="rounded-[28px] border border-green-50 bg-white p-6 shadow-[0_15px_50px_rgba(0,70,50,0.08)] transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/30 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              অ্যাকাউন্ট তৈরি করুন
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              আমাদের কমিউনিটিতে যুক্ত হয়ে একসাথে দ্বীনের পথে এগিয়ে চলুন।
            </p>
          </div>

          {/* ==========================================
              NORMAL REGISTER FORM
          ========================================== */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                পুরো নাম <span className="text-red-500">*</span>
              </label>

              <div className="relative mt-2">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="name"
                  type="text"
                  required
                  placeholder="আপনার পুরো নাম লিখুন"
                  autoComplete="name"
                  className="h-13 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-gray-800 outline-none transition focus:border-[#087f5b] focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500 dark:focus:ring-green-900/30"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                ফোন নম্বর <span className="text-red-500">*</span>
              </label>

              <div className="relative mt-2">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="01712345678"
                  inputMode="numeric"
                  maxLength={14}
                  autoComplete="tel"
                  className="h-13 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-gray-800 outline-none transition focus:border-[#087f5b] focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500 dark:focus:ring-green-900/30"
                />
              </div>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                উদাহরণ: 01712345678
              </p>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                ইমেইল ঠিকানা <span className="text-red-500">*</span>
              </label>

              <div className="relative mt-2">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="email"
                  type="email"
                  required
                  placeholder="আপনার ইমেইল লিখুন"
                  autoComplete="email"
                  className="h-13 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-gray-800 outline-none transition focus:border-[#087f5b] focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500 dark:focus:ring-green-900/30"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>

              <div className="relative mt-2">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন"
                  autoComplete="new-password"
                  className="h-13 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-12 text-gray-800 outline-none transition focus:border-[#087f5b] focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500 dark:focus:ring-green-900/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#087f5b] dark:hover:text-green-400"
                  title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                কমপক্ষে ৬ অক্ষর হতে হবে
              </p>
            </div>

            {/* TERMS */}
            <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
              <input
                type="checkbox"
                required
                className="mt-0.5 accent-[#075c46]"
              />

              <span>
                আমি{" "}
                <span className="font-semibold text-[#075c46] dark:text-green-400">
                  শর্তাবলী
                </span>{" "}
                এবং গোপনীয়তা নীতিতে সম্মত আছি।
              </span>
            </label>

            {/* REGISTER BUTTON */}
            <button
              disabled={loading}
              type="submit"
              className="h-13 w-full rounded-xl bg-[#075c46] font-semibold text-white shadow-lg shadow-green-900/20 transition hover:bg-[#064b3a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          {/* ==========================================
              DIVIDER
          ========================================== */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />

            <span className="text-xs font-medium text-gray-400">অথবা</span>

            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* ==========================================
              GOOGLE REGISTER
          ========================================== */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
            className="flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          >
            <FcGoogle size={22} />

            {loading
              ? "অনুগ্রহ করে অপেক্ষা করুন..."
              : "Google দিয়ে চালিয়ে যান"}
          </button>

          {/* ==========================================
              LOGIN
          ========================================== */}
          <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
            আপনার কি ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link
              to="/login"
              className="font-bold text-[#087f5b] hover:underline dark:text-green-400"
            >
              লগইন করুন
            </Link>
          </p>
        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} মসজিদ হাব • উম্মাহর জন্য ভালোবাসা
          দিয়ে তৈরি 🤍
        </p>
      </div>
    </div>
  );
};

export default Register;
