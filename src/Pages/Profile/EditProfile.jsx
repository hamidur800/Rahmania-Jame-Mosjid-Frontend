import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Swal from "sweetalert2";

import {
  FaArrowLeft,
  FaCamera,
  FaUser,
  FaEnvelope,
  FaSave,
} from "react-icons/fa";

import { AuthContext } from "../../provider/AuthProvider";
import axiosSecure from "../../api/axiosSecure";

const EditProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================================================
  // LOAD USER DATA
  // =========================================================
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.displayName || "",
        email: user?.email || "",
        photoURL: user?.photoURL || "",
      });
    }
  }, [user]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // UPDATE PROFILE
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      Swal.fire({
        icon: "error",
        title: "অথেন্টিকেশন সমস্যা",
        text: "অনুগ্রহ করে আবার লগইন করুন।",
      });

      return;
    }

    setLoading(true);

    try {
      // =====================================================
      // 1. UPDATE FIREBASE PROFILE
      // =====================================================
      await updateUserProfile({
        displayName: formData.name,
        photoURL: formData.photoURL,
      });

      // =====================================================
      // 2. UPDATE MONGODB USER
      //
      // axiosSecure automatically sends:
      // Authorization: Bearer Firebase_ID_TOKEN
      // =====================================================
      const response = await axiosSecure.patch(
        `/users/${encodeURIComponent(user.email)}`,
        {
          name: formData.name,
          email: formData.email,
          photoURL: formData.photoURL,
        },
      );

      console.log("Profile updated:", response.data);

      // =====================================================
      // SUCCESS
      // =====================================================
      await Swal.fire({
        icon: "success",
        title: "প্রোফাইল আপডেট হয়েছে!",
        text: "আপনার প্রোফাইলের তথ্য সফলভাবে আপডেট করা হয়েছে।",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/profile");
    } catch (error) {
      console.error(
        "Profile Update Error:",
        error.response?.data || error.message,
      );

      Swal.fire({
        icon: "error",
        title: "আপডেট ব্যর্থ হয়েছে",
        text:
          error.response?.data?.message ||
          error.message ||
          "কিছু একটা সমস্যা হয়েছে!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#f5f8f6]
        pb-10
        transition-colors duration-300
        dark:bg-gray-950
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          bg-[#075c46]
          px-5
          pb-20
          pt-8
          text-white
          dark:bg-[#064d3b]
        "
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="পেছনে যান"
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              bg-white/10
              transition
              hover:bg-white/20
              active:scale-95
            "
          >
            <FaArrowLeft />
          </button>

          <div>
            <p className="text-xs text-green-100">আপনার তথ্য পরিচালনা করুন</p>

            <h1 className="text-2xl font-bold">প্রোফাইল সম্পাদনা</h1>
          </div>
        </div>
      </div>

      {/* =====================================================
          PROFILE PHOTO
      ====================================================== */}
      <div className="relative mx-auto -mt-12 flex w-fit flex-col items-center">
        <div className="relative">
          {formData.photoURL ? (
            <img
              src={formData.photoURL}
              alt="প্রোফাইল ছবি"
              className="
                h-28 w-28
                rounded-3xl
                border-4 border-white
                object-cover
                shadow-lg
                dark:border-gray-900
              "
            />
          ) : (
            <div
              className="
                flex h-28 w-28
                items-center justify-center
                rounded-3xl
                border-4 border-white
                bg-[#e8f4ef]
                text-[#075c46]
                shadow-lg
                dark:border-gray-900
                dark:bg-green-950
                dark:text-green-400
              "
            >
              <FaUser className="text-4xl" />
            </div>
          )}

          <div
            className="
              absolute -bottom-2 -right-2
              flex h-10 w-10
              items-center justify-center
              rounded-full
              bg-[#087443]
              text-white
              shadow-md
              dark:bg-green-600
            "
          >
            <FaCamera />
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          নিচে প্রোফাইল ছবির URL আপডেট করুন
        </p>
      </div>

      {/* =====================================================
          FORM
      ====================================================== */}
      <div
        className="
          mx-4 mt-7
          rounded-3xl
          border border-transparent
          bg-white
          p-5
          shadow-sm
          transition-colors duration-300
          dark:border-gray-800
          dark:bg-gray-900
        "
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* =================================================
              NAME
          ================================================== */}
          <div>
            <label
              className="
                mb-2 block
                text-sm font-semibold
                text-gray-700
                dark:text-gray-200
              "
            >
              পুরো নাম
            </label>

            <div
              className="
                flex items-center gap-3
                rounded-xl
                border border-gray-200
                bg-white
                px-4
                transition
                focus-within:border-[#087443]
                dark:border-gray-700
                dark:bg-gray-800
                dark:focus-within:border-green-500
              "
            >
              <FaUser className="text-gray-400 dark:text-gray-500" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="আপনার নাম লিখুন"
                required
                className="
                  w-full
                  bg-transparent
                  py-4
                  text-gray-800
                  outline-none
                  placeholder:text-gray-400
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />
            </div>
          </div>

          {/* =================================================
              EMAIL
          ================================================== */}
          <div>
            <label
              className="
                mb-2 block
                text-sm font-semibold
                text-gray-700
                dark:text-gray-200
              "
            >
              ইমেইল ঠিকানা
            </label>

            <div
              className="
                flex items-center gap-3
                rounded-xl
                border border-gray-200
                bg-white
                px-4
                dark:border-gray-700
                dark:bg-gray-800
              "
            >
              <FaEnvelope className="text-gray-400 dark:text-gray-500" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="আপনার ইমেইল লিখুন"
                className="
                  w-full
                  bg-transparent
                  py-4
                  text-gray-800
                  outline-none
                  placeholder:text-gray-400
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />
            </div>

            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              ইমেইল পরিবর্তনের জন্য Firebase Authentication প্রয়োজন।
            </p>
          </div>

          {/* =================================================
              PHOTO URL
          ================================================== */}
          <div>
            <label
              className="
                mb-2 block
                text-sm font-semibold
                text-gray-700
                dark:text-gray-200
              "
            >
              প্রোফাইল ছবির URL
            </label>

            <input
              type="url"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="
                w-full
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-4
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-[#087443]
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-white
                dark:placeholder:text-gray-500
                dark:focus:border-green-500
              "
            />
          </div>

          {/* =================================================
              SAVE BUTTON
          ================================================== */}
          <button
            type="submit"
            disabled={loading}
            className="
              flex w-full
              items-center justify-center gap-3
              rounded-2xl
              bg-[#075c46]
              py-4
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#064936]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-green-700
              dark:hover:bg-green-600
            "
          >
            <FaSave />

            {loading ? "আপডেট হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
          </button>
        </form>
      </div>

      {/* =====================================================
          BOTTOM INFO
      ====================================================== */}
      <p className="mt-6 px-5 text-center text-[10px] text-gray-400 dark:text-gray-600">
        আপনার তথ্য নিরাপদ রাখুন • মসজিদ হাব
      </p>
    </div>
  );
};

export default EditProfile;
