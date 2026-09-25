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
import { requestNotificationPermission } from "../../../firebase/messaging";

const Login = () => {
  const { signInUser, googleLogin } = useContext(AuthContext);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // EMAIL / PASSWORD LOGIN
  // =========================================================
  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   const form = e.target;

  //   const email = form.email.value.trim();
  //   const password = form.password.value;

  //   try {
  //     setLoading(true);

  //     // Firebase Login
  //     const result = await signInUser(email, password);

  //     // =====================================================
  //     // JWT TOKEN
  //     // =====================================================
  //     const res = await fetch(
  //       "https://rahmania-jame-mosjid-backend.onrender.com/jwt",
  //       {
  //         method: "POST",
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email: result.user.email,
  //         }),
  //       },
  //     );

  //     const data = await res.json();

  //     if (data?.token) {
  //       localStorage.setItem("access-token", data.token);
  //     }

  //     // Firebase auth token refresh
  //     await result.user.getIdToken(true);
  //     const fcmToken = await requestNotificationPermission();

  //     if (fcmToken) {
  //       await fetch(
  //         "https://rahmania-jame-mosjid-backend.onrender.com/users/fcm-token",
  //         {
  //           method: "PATCH",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({
  //             email: firebaseUser.email,
  //             fcmToken,
  //           }),
  //         },
  //       );
  //     }
  //     await Swal.fire({
  //       icon: "success",
  //       title: "আবারও স্বাগতম! ",
  //       text: "লগইন সফল হয়েছে।",
  //       timer: 1500,
  //       showConfirmButton: false,
  //     });

  //     navigate("/");
  //   } catch (err) {
  //     console.error("Login Error:", err);

  //     Swal.fire({
  //       icon: "error",
  //       title: "লগইন ব্যর্থ হয়েছে",
  //       text:
  //         err?.response?.data?.message ||
  //         err?.message ||
  //         "কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      setLoading(true);

      // =====================================================
      // 1. Firebase Login
      // =====================================================
      const result = await signInUser(email, password);

      const firebaseUser = result.user;

      // Firebase ID Token
      const token = await firebaseUser.getIdToken(true);

      // =====================================================
      // 2. JWT TOKEN
      // =====================================================
      const res = await fetch(
        "https://rahmania-jame-mosjid-backend.onrender.com/jwt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: firebaseUser.email,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data?.token) {
        throw new Error(data?.message || "লগইন টোকেন তৈরি করা যায়নি");
      }

      // MongoDB API-এর জন্য JWT
      localStorage.setItem("access-token", data.token);

      // =====================================================
      // 3. Notification Permission + FCM Token
      // =====================================================
      const fcmToken = await requestNotificationPermission();

      console.log("FCM Token:", fcmToken);

      if (fcmToken) {
        const fcmResponse = await fetch(
          "https://rahmania-jame-mosjid-backend.onrender.com/users/fcm-token",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: firebaseUser.email,
              fcmToken: fcmToken,
            }),
          },
        );

        const fcmData = await fcmResponse.json();

        console.log("FCM Save Response:", fcmData);

        if (!fcmResponse.ok) {
          console.error("FCM token save failed:", fcmData);
        }
      }

      // =====================================================
      // 4. Success
      // =====================================================
      await Swal.fire({
        icon: "success",
        title: "আবারও স্বাগতম!",
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
          err?.message ||
          "কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     setLoading(true);

  //     // 1. Google Login
  //     const result = await googleLogin();
  //     const firebaseUser = result.user;

  //     const email = firebaseUser.email;
  //     const name = firebaseUser.displayName || "User";
  //     const photoURL = firebaseUser.photoURL || "";

  //     // 2. Firebase ID Token
  //     const token = await firebaseUser.getIdToken();

  //     // 3. Check MongoDB user
  //     const checkUserResponse = await fetch(
  //       `https://rahmania-jame-mosjid-backend.onrender.com/users/check/${encodeURIComponent(
  //         email,
  //       )}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );

  //     const checkUserData = await checkUserResponse.json();

  //     let phone = "";

  //     // 4. User doesn't exist in MongoDB
  //     if (!checkUserData.exists) {
  //       const { value: phoneNumber } = await Swal.fire({
  //         title: "Phone Number",
  //         input: "tel",
  //         inputLabel: "Enter your Bangladesh phone number",
  //         inputPlaceholder: "01XXXXXXXXX",
  //         inputValue: "",
  //         showCancelButton: true,
  //         confirmButtonText: "Continue",
  //         cancelButtonText: "Cancel",
  //         inputValidator: (value) => {
  //           if (!value) {
  //             return "Phone number is required";
  //           }

  //           const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

  //           if (!phoneRegex.test(value.replace(/\s+/g, ""))) {
  //             return "Please enter a valid Bangladesh phone number";
  //           }

  //           return null;
  //         },
  //       });

  //       if (!phoneNumber) {
  //         await logOut();
  //         return;
  //       }

  //       phone = phoneNumber.replace(/\s+/g, "");

  //       // 5. Save user to MongoDB
  //       const createUserResponse = await fetch(
  //         "https://rahmania-jame-mosjid-backend.onrender.com/users",
  //         {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             name,
  //             email,
  //             phone,
  //             photoURL,
  //             authProvider: "google",
  //             createdAt: new Date().toISOString(),
  //           }),
  //         },
  //       );

  //       const createUserData = await createUserResponse.json();

  //       // console.log("Create User Response:", createUserData);

  //       if (!createUserResponse.ok) {
  //         throw new Error(createUserData.message || "Failed to create user");
  //       }
  //     }

  //     // 6. Get JWT token
  //     const jwtResponse = await fetch(
  //       "https://rahmania-jame-mosjid-backend.onrender.com/jwt",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email,
  //         }),
  //       },
  //     );

  //     const jwtData = await jwtResponse.json();

  //     if (!jwtResponse.ok) {
  //       throw new Error(jwtData.message || "Failed to get JWT token");
  //     }

  //     localStorage.setItem("access-token", jwtData.token);

  //     // 7. Success
  //     await Swal.fire({
  //       icon: "success",
  //       title: "Login Successful",
  //       text: "Welcome to Rahmania Jame Mosjid!",
  //       timer: 1500,
  //       showConfirmButton: false,
  //     });

  //     navigate("/");
  //   } catch (error) {
  //     console.error("Google Login Error:", error);

  //     Swal.fire({
  //       icon: "error",
  //       title: "Login Failed",
  //       text: error.message || "Something went wrong",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // ১. Google Login
      const result = await googleLogin();
      const firebaseUser = result.user;

      const email = firebaseUser.email;
      const name = firebaseUser.displayName || "ব্যবহারকারী";
      const photoURL = firebaseUser.photoURL || "";

      // ২. Firebase ID Token
      const token = await firebaseUser.getIdToken();

      // ৩. MongoDB-তে User আছে কিনা চেক করা
      const checkUserResponse = await fetch(
        `https://rahmania-jame-mosjid-backend.onrender.com/users/check/${encodeURIComponent(
          email,
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const checkUserData = await checkUserResponse.json();

      let phone = "";

      // ৪. MongoDB-তে User না থাকলে Phone Number চাইবে
      if (!checkUserData.exists) {
        const { value: phoneNumber } = await Swal.fire({
          title: "মোবাইল নম্বর দিন",
          input: "tel",
          inputLabel: "আপনার বাংলাদেশের মোবাইল নম্বর দিন",
          inputPlaceholder: "01XXXXXXXXX",
          inputValue: "",
          showCancelButton: true,
          confirmButtonText: "চালিয়ে যান",
          cancelButtonText: "বাতিল করুন",
          inputValidator: (value) => {
            if (!value) {
              return "মোবাইল নম্বর দেওয়া আবশ্যক";
            }

            const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

            if (!phoneRegex.test(value.replace(/\s+/g, ""))) {
              return "সঠিক বাংলাদেশের মোবাইল নম্বর দিন";
            }

            return null;
          },
        });

        // User Cancel করলে Google Logout
        if (!phoneNumber) {
          await logOut();
          return;
        }

        phone = phoneNumber.replace(/\s+/g, "");

        // ৫. User-কে MongoDB-তে Save করা
        const createUserResponse = await fetch(
          "https://rahmania-jame-mosjid-backend.onrender.com/users",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              phone,
              photoURL,
              authProvider: "google",
              createdAt: new Date().toISOString(),
            }),
          },
        );

        const createUserData = await createUserResponse.json();

        if (!createUserResponse.ok) {
          throw new Error(
            createUserData.message || "ব্যবহারকারীর তথ্য সংরক্ষণ করা যায়নি",
          );
        }
      }

      // ৬. JWT Token নেওয়া
      const jwtResponse = await fetch(
        "https://rahmania-jame-mosjid-backend.onrender.com/jwt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const jwtData = await jwtResponse.json();

      if (!jwtResponse.ok) {
        throw new Error(jwtData.message || "লগইন টোকেন তৈরি করা যায়নি");
      }

      localStorage.setItem("access-token", jwtData.token);

      // 🔔 Notification permission + FCM token
      const fcmToken = await requestNotificationPermission();

      if (fcmToken) {
        await fetch(
          "https://rahmania-jame-mosjid-backend.onrender.com/users/fcm-token",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: firebaseUser.email,
              fcmToken,
            }),
          },
        );
      }

      // 7. Success
      await Swal.fire({
        icon: "success",
        title: "লগইন সফল হয়েছে",
        text: "রহমানিয়া জামে মসজিদে আপনাকে স্বাগতম!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");

      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);

      Swal.fire({
        icon: "error",
        title: "লগইন ব্যর্থ হয়েছে",
        text:
          error.message || "দুঃখিত, কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।",
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
