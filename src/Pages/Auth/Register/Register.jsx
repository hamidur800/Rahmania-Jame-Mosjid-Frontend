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
import { requestNotificationPermission } from "../../../firebase/messaging";

const Register = () => {
  const { createUser, googleLogin, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://rahmania-jame-mosjid-backend.onrender.com";

  // =========================
  // Phone Validation
  // =========================
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\s+/g, "");
    const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

    return phoneRegex.test(cleanPhone);
  };

  // =========================
  // Cleanup Firebase Auth
  // =========================
  const cleanupAuth = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Firebase logout failed:", error);
    }

    localStorage.removeItem("access-token");
  };

  // =========================
  // Save User to MongoDB
  // =========================
  const saveUser = async (user, extraData = {}) => {
    if (!user) {
      throw new Error("Firebase user not found");
    }

    const phone = extraData.phone?.replace(/\s+/g, "");

    if (!phone) {
      throw new Error("Phone number is required");
    }

    if (!validatePhone(phone)) {
      throw new Error("Invalid Bangladeshi phone number");
    }

    // Firebase ID Token
    const token = await user.getIdToken(true);

    const userData = {
      name: extraData.name?.trim() || user.displayName?.trim() || "User",

      phone,

      email: user.email,

      photoURL: user.photoURL || "",

      authProvider: extraData.authProvider || "password",

      createdAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(userData),
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned invalid response: ${text || "Empty response"}`,
      );
    }

    if (!response.ok) {
      throw new Error(data?.message || "Failed to save user in MongoDB");
    }

    return data;
  };

  // =========================
  // Get JWT Token
  // =========================
  const getJwtToken = async (email) => {
    const response = await fetch(`${API_URL}/jwt`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to get JWT token");
    }

    if (!data?.token) {
      throw new Error("JWT token was not returned");
    }

    localStorage.setItem("access-token", data.token);

    return data.token;
  };

  // =========================
  // Save FCM Token
  // =========================
  const saveFcmToken = async (user) => {
    if (!user) {
      throw new Error("Firebase user not found");
    }

    try {
      // Firebase ID Token
      const firebaseToken = await user.getIdToken(true);

      // Request Notification Permission + Get FCM Token
      const fcmToken = await requestNotificationPermission();

      console.log("FCM Token:", fcmToken);

      // Permission denied / token not available
      if (!fcmToken) {
        console.log("FCM token not available.");
        return;
      }

      // Save FCM Token to MongoDB
      const response = await fetch(`${API_URL}/users/fcm-token`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },

        body: JSON.stringify({
          email: user.email,
          fcmToken: fcmToken,
        }),
      });

      const data = await response.json();

      console.log("FCM Save Response:", data);

      if (!response.ok) {
        console.error("FCM token save failed:", data);

        return;
      }

      console.log("FCM token saved successfully.");
    } catch (error) {
      // FCM error হলে registration/login fail করাবে না
      console.error("FCM token error:", error);
    }
  };

  // =========================
  // Normal Registration
  // =========================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    const form = e.target;

    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/\s+/g, "");
    const email = form.email.value.trim();
    const password = form.password.value;
    const terms = form.terms.checked;

    // Name
    if (!name) {
      return Swal.fire({
        icon: "warning",
        title: "নাম দিন",
        text: "আপনার নাম লিখুন।",
      });
    }

    // Phone
    if (!validatePhone(phone)) {
      return Swal.fire({
        icon: "warning",
        title: "সঠিক ফোন নম্বর দিন",
        text: "যেমন: 01712345678 অথবা +8801712345678",
      });
    }

    // Password
    if (password.length < 6) {
      return Swal.fire({
        icon: "warning",
        title: "পাসওয়ার্ড ছোট",
        text: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
      });
    }

    // Terms
    if (!terms) {
      return Swal.fire({
        icon: "warning",
        title: "শর্তাবলী গ্রহণ করুন",
        text: "রেজিস্ট্রেশন করতে শর্তাবলী গ্রহণ করতে হবে।",
      });
    }

    setLoading(true);

    try {
      // =====================================================
      // 1. Firebase Account Create
      // =====================================================
      const result = await createUser(email, password);

      if (!result?.user) {
        throw new Error("Firebase user creation failed");
      }

      const firebaseUser = result.user;

      // =====================================================
      // 2. MongoDB Save
      // =====================================================
      await saveUser(firebaseUser, {
        name,
        phone,
        authProvider: "password",
      });

      // =====================================================
      // 3. JWT Token
      // =====================================================
      await getJwtToken(firebaseUser.email);

      // =====================================================
      // 4. FCM Token
      // =====================================================
      await saveFcmToken(firebaseUser);

      // =====================================================
      // 5. Success
      // =====================================================
      await Swal.fire({
        icon: "success",
        title: "রেজিস্ট্রেশন সফল!",
        text: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
        confirmButtonText: "ঠিক আছে",
      });

      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);

      await cleanupAuth();

      let message = "রেজিস্ট্রেশন করা যায়নি। আবার চেষ্টা করুন।";

      if (error?.code === "auth/email-already-in-use") {
        message = "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে।";
      } else if (error?.code === "auth/invalid-email") {
        message = "ইমেইল ঠিকানা সঠিক নয়।";
      } else if (error?.code === "auth/weak-password") {
        message = "পাসওয়ার্ড আরও শক্তিশালী দিন।";
      } else if (error?.message) {
        message = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "রেজিস্ট্রেশন ব্যর্থ",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Google Registration
  // =========================
  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // =====================================================
      // 1. Google Login
      // =====================================================
      const result = await googleLogin();

      const googleUser = result?.user;

      if (!googleUser) {
        throw new Error("Google user not found");
      }

      const googleName = googleUser.displayName?.trim() || "User";

      const googleEmail = googleUser.email;

      if (!googleEmail) {
        throw new Error("Google account email not found");
      }

      // =====================================================
      // 2. Firebase Token
      // =====================================================
      const token = await googleUser.getIdToken(true);

      // =====================================================
      // 3. Check if MongoDB user already exists
      // =====================================================
      const checkResponse = await fetch(
        `${API_URL}/users/check/${encodeURIComponent(googleEmail)}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // =====================================================
      // Already exists
      // =====================================================
      if (checkResponse.ok) {
        await getJwtToken(googleEmail);

        // Existing Google user-এর FCM token update
        await saveFcmToken(googleUser);

        await Swal.fire({
          icon: "info",
          title: "অ্যাকাউন্ট আগে থেকেই আছে",
          text: "আপনার Google account দিয়ে ইতিমধ্যে অ্যাকাউন্ট তৈরি করা হয়েছে।",
          confirmButtonText: "ঠিক আছে",
        });

        navigate("/");
        return;
      }

      // =====================================================
      // 4. Ask for phone number
      // =====================================================
      const phoneResult = await Swal.fire({
        title: "ফোন নম্বর দিন",
        input: "text",
        inputLabel: "আপনার মোবাইল নম্বর",
        inputPlaceholder: "01712345678",

        inputAttributes: {
          maxlength: 14,
          autocapitalize: "off",
          autocorrect: "off",
        },

        showCancelButton: true,

        confirmButtonText: "চালিয়ে যান",

        cancelButtonText: "বাতিল",

        inputValidator: (value) => {
          const phone = value?.replace(/\s+/g, "");

          if (!phone) {
            return "ফোন নম্বর দিন";
          }

          if (!validatePhone(phone)) {
            return "সঠিক বাংলাদেশি ফোন নম্বর দিন";
          }

          return undefined;
        },
      });

      // =====================================================
      // User Cancelled
      // =====================================================
      if (!phoneResult.isConfirmed) {
        await cleanupAuth();

        await Swal.fire({
          icon: "info",
          title: "বাতিল করা হয়েছে",
          text: "Google registration বাতিল করা হয়েছে।",
        });

        return;
      }

      const cleanPhone = phoneResult.value.replace(/\s+/g, "");

      // =====================================================
      // 5. Save Google User to MongoDB
      // =====================================================
      await saveUser(googleUser, {
        name: googleName,
        phone: cleanPhone,
        authProvider: "google",
      });

      // =====================================================
      // 6. JWT
      // =====================================================
      await getJwtToken(googleEmail);

      // =====================================================
      // 7. FCM Token
      // =====================================================
      await saveFcmToken(googleUser);

      // =====================================================
      // 8. Success
      // =====================================================
      await Swal.fire({
        icon: "success",
        title: "রেজিস্ট্রেশন সফল! 🎉",
        text: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
        confirmButtonText: "ঠিক আছে",
      });

      navigate("/");
    } catch (error) {
      console.error("Google registration error:", error);

      await cleanupAuth();

      let message = "Google দিয়ে রেজিস্ট্রেশন করা যায়নি। আবার চেষ্টা করুন।";

      if (error?.code === "auth/popup-closed-by-user") {
        message = "Google login popup বন্ধ করা হয়েছে।";
      } else if (error?.code === "auth/popup-blocked") {
        message =
          "Browser popup block করেছে। Popup allow করে আবার চেষ্টা করুন।";
      } else if (error?.message) {
        message = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Google Registration ব্যর্থ",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8f6] px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        {/* Logo / Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#075c46] text-[#e9c46a] shadow-lg">
            <FaMosque className="text-3xl" />
          </div>

          <h1 className="text-2xl font-bold text-[#075c46]">
            রহমানিয়া জামে মসজিদ
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            সংযুক্ত থাকুন • নামাজ পড়ুন • দ্বীনের পথে চলুন
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              অ্যাকাউন্ট তৈরি করুন
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              রহমানিয়া জামে মসজিদের সাথে যুক্ত হতে রেজিস্টার করুন।
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FcGoogle className="text-xl" />

            {loading ? "অপেক্ষা করুন..." : "Google দিয়ে চালিয়ে যান"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs text-gray-400">অথবা</span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                নাম
              </label>

              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="name"
                  placeholder="আপনার নাম"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-[#075c46] focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                ফোন নম্বর
              </label>

              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="01712345678"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-[#075c46] focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                ইমেইল
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-[#075c46] focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                পাসওয়ার্ড
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 outline-none transition focus:border-[#075c46] focus:bg-white"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#075c46]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="terms"
                className="mt-1 accent-[#075c46]"
              />

              <span>
                আমি মসজিদের{" "}
                <span className="font-semibold text-[#075c46]">
                  নিয়ম ও শর্তাবলী
                </span>{" "}
                মেনে চলতে সম্মত।
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#075c46] px-4 py-3 font-bold text-white shadow-md transition hover:bg-[#064b3a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "রেজিস্টার হচ্ছে..." : "রেজিস্টার করুন"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link
              to="/login"
              className="font-bold text-[#075c46] hover:underline"
            >
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
