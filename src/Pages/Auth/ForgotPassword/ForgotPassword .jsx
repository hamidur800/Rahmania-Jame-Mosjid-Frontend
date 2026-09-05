import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../../provider/AuthProvider";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { resetPassword } = useContext(AuthContext);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "ইমেইল প্রয়োজন",
        text: "অনুগ্রহ করে আপনার ইমেইল ঠিকানা লিখুন।",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    try {
      setLoading(true);

      await resetPassword(email);

      Swal.fire({
        icon: "success",
        title: "রিসেট লিংক পাঠানো হয়েছে!",
        text: "আপনার ইমেইল ইনবক্স দেখুন এবং পাসওয়ার্ড রিসেট করুন।",
        confirmButtonColor: "#16a34a",
      });

      setEmail("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "ব্যর্থ হয়েছে!",
        text:
          error.message || "কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 transition-colors dark:bg-gray-950">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-xl transition-colors sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600 dark:bg-green-900/30 dark:text-green-400">
          🔐
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
          পাসওয়ার্ড রিসেট করুন
        </h2>

        <p className="mb-6 text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
          আপনার অ্যাকাউন্টের ইমেইল ঠিকানা লিখুন। আমরা আপনার ইমেইলে একটি
          পাসওয়ার্ড রিসেট লিংক পাঠিয়ে দেব।
        </p>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              ইমেইল ঠিকানা
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল লিখুন"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500 dark:focus:ring-green-900/30"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3.5 font-semibold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:from-green-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                রিসেট লিংক পাঠানো হচ্ছে...
              </>
            ) : (
              "রিসেট লিংক পাঠান"
            )}
          </button>
        </form>

        {/* Back Login */}
        <div className="mt-6 border-t border-gray-100 pt-5 text-center dark:border-gray-800">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            পাসওয়ার্ড মনে পড়েছে?
          </p>

          <Link
            to="/login"
            className="font-semibold text-green-600 transition hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            লগইন পেজে ফিরে যান
          </Link>
        </div>

        {/* Bottom Message */}
        <div className="mt-6 rounded-xl bg-green-50 p-3 text-center dark:bg-green-900/20">
          <p className="text-xs leading-5 text-green-700 dark:text-green-300">
            🔒 আপনার অ্যাকাউন্টের নিরাপত্তা আমাদের কাছে গুরুত্বপূর্ণ।
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
