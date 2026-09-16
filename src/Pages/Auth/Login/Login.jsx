import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMosque,
} from "react-icons/fa";
import Swal from "sweetalert2";

import { AuthContext } from "../../../provider/AuthProvider";
import axiosSecure from "../../../api/axiosSecure";

const Login = () => {
  const { signInUser, googleLogin } = useContext(AuthContext);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // EMAIL / PASSWORD LOGIN
  // =========================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      setLoading(true);

      // Firebase Login
      const result = await signInUser(email, password);

      // =====================================================
      // JWT TOKEN
      // =====================================================
      const res = await fetch(
        "https://rahmania-jame-mosjid-backend.onrender.com/jwt",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: result.user.email,
          }),
        },
      );

      const data = await res.json();

      if (data?.token) {
        localStorage.setItem("access-token", data.token);
      }

      // Firebase auth token refresh
      await result.user.getIdToken(true);

      await Swal.fire({
        icon: "success",
        title: "আবারও স্বাগতম! 🌙",
        text: "লগইন সফল হয়েছে।",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);

      Swal.fire({
        icon: "error",
        title: "লগইন ব্যর্থ হয়েছে",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // Firebase Google Login
      const result = await googleLogin();

      const firebaseUser = result.user;

      // =====================================================
      // SAVE / CREATE USER IN MONGODB
      // =====================================================
      try {
        await axiosSecure.post("/users", {
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || "",
          role: "user",
          authProvider: "google",
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        // User already exists হলে Google login বন্ধ হবে না
        console.log(
          "MongoDB user save info:",
          error.response?.data || error.message,
        );
      }

      // =====================================================
      // JWT TOKEN
      // =====================================================
      const res = await fetch(
        "https://rahmania-jame-mosjid-backend.onrender.com/jwt",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: firebaseUser.email,
          }),
        },
      );

      const data = await res.json();

      if (data?.token) {
        localStorage.setItem("access-token", data.token);
      }

      // Firebase token refresh
      await firebaseUser.getIdToken(true);

      await Swal.fire({
        icon: "success",
        title: "স্বাগতম! 🎉",
        text: "Google দিয়ে লগইন সফল হয়েছে।",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);

      Swal.fire({
        icon: "error",
        title: "Google লগইন ব্যর্থ হয়েছে",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 pt-10 pb-25 transition-colors duration-300 dark:bg-gray-950">
      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}
      <div className="w-full max-w-md">
        {/* ===================================================
            LOGO
        ==================================================== */}
        <div className="mb-7 text-center">
          <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#075c46] shadow-lg shadow-green-900/20">
            <FaMosque className="text-3xl text-[#e9c46a]" />
          </div>

          <h1 className="text-2xl font-bold text-[#075c46] dark:text-green-400">
            রহমানিয়া জামে মসজিদ
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            সংযুক্ত থাকুন • নামাজ পড়ুন • দ্বীনের পথে চলুন
          </p>
        </div>

        {/* ===================================================
            LOGIN CARD
        ==================================================== */}
        <div className="rounded-[28px] border border-green-50 bg-white p-6 shadow-[0_15px_50px_rgba(0,70,50,0.08)] transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/30 sm:p-8">
          {/* =================================================
              TITLE
          ================================================== */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              আবারও স্বাগতম 👋
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              আপনার দ্বীনি যাত্রা চালিয়ে যেতে লগইন করুন।
            </p>
          </div>

          {/* =================================================
              EMAIL / PASSWORD FORM
          ================================================== */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                ইমেইল ঠিকানা
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  পাসওয়ার্ড
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#087f5b] transition hover:underline dark:text-green-400"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              <div className="relative mt-2">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  autoComplete="current-password"
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
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-13 w-full rounded-xl bg-[#075c46] font-semibold text-white shadow-lg shadow-green-900/20 transition hover:bg-[#064b3a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "অনুগ্রহ করে অপেক্ষা করুন..." : "লগইন করুন"}
            </button>
          </form>

          {/* =================================================
              DIVIDER
          ================================================== */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />

            <span className="text-xs font-medium text-gray-400">অথবা</span>

            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* =================================================
              GOOGLE LOGIN
          ================================================== */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          >
            <FcGoogle size={22} />

            {loading
              ? "অনুগ্রহ করে অপেক্ষা করুন..."
              : "Google দিয়ে চালিয়ে যান"}
          </button>

          {/* =================================================
              REGISTER
          ================================================== */}
          <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
            আপনার কি এখনো অ্যাকাউন্ট নেই?{" "}
            <Link
              to="/register"
              className="font-bold text-[#087f5b] hover:underline dark:text-green-400"
            >
              অ্যাকাউন্ট তৈরি করুন
            </Link>
          </p>
        </div>

        {/* ===================================================
            FOOTER
        ==================================================== */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} রহমানিয়া জামে মসজিদ • উম্মাহর জন্য
          ভালোবাসা দিয়ে তৈরি 🤍
        </p>
      </div>
    </div>
  );
};

export default Login;
