import { useEffect, useState, useContext } from "react";

import {
  FaMosque,
  FaHandHoldingHeart,
  FaMobileScreenButton,
  FaBuildingColumns,
  FaCircleCheck,
  FaCopy,
} from "react-icons/fa6";

import { useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import axiosSecure from "../../api/axiosSecure";
import Loading from "../../Componant/Loading/Loading";
const Donate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ========================================
  // CURRENT MONTH
  // ========================================
  const getCurrentPaymentMonth = () => {
    const today = new Date();

    const monthName = today.toLocaleString("bn-BD", {
      month: "long",
    });

    const year = today.toLocaleString("bn-BD", {
      year: "numeric",
    });

    return `${monthName} ${year}`;
  };

  const [amount, setAmount] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "Imam Food",
    paymentMethod: "Cash",
    transactionId: "",
    paymentMonth: getCurrentPaymentMonth(),
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // ========================================
  // GENERATE PAYMENT MONTHS
  // ========================================
  const generatePaymentMonths = () => {
    const months = [];
    const today = new Date();

    // Previous 12 months + Current month + Next 12 months
    for (let i = -12; i <= 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);

      const monthName = date.toLocaleString("bn-BD", {
        month: "long",
      });

      const year = date.toLocaleString("bn-BD", {
        year: "numeric",
      });

      const value = `${date.toLocaleString("en-US", {
        month: "long",
      })} ${date.getFullYear()}`;

      const label = `${monthName} ${year}`;

      months.push({
        value,
        label,
      });
    }

    return months;
  };

  const paymentMonths = generatePaymentMonths();

  // ========================================
  // GET USER INFORMATION FROM MONGODB
  // ========================================
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.email) return;

      try {
        setUserLoading(true);

        // Firebase user data
        const firebaseName = user.displayName || "";
        const firebaseEmail = user.email || "";

        setFormData((prev) => ({
          ...prev,
          name: firebaseName,
          email: firebaseEmail,
        }));

        // ========================================
        // GET FIREBASE ID TOKEN
        // ========================================
        const token = await user.getIdToken();

        // console.log("Firebase Token Available:", !!token);

        // ========================================
        // GET MONGODB USER DATA
        // ========================================
        const res = await axiosSecure.get(
          `/users/${encodeURIComponent(user.email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const mongoUser = res.data;

        // console.log("MongoDB User:", mongoUser);

        setFormData((prev) => ({
          ...prev,

          // MongoDB name first
          name: mongoUser?.name || mongoUser?.displayName || firebaseName || "",

          // MongoDB phone
          phone: mongoUser?.phone || "",

          // Email
          email: mongoUser?.email || firebaseEmail,
        }));
      } catch (err) {
        console.error(
          "Failed to load user information:",
          err.response?.data || err.message,
        );

        // Keep Firebase data if MongoDB fails
        setFormData((prev) => ({
          ...prev,
          name: user.displayName || prev.name || "",
          email: user.email || prev.email || "",
          phone: prev.phone || "",
        }));
      } finally {
        setUserLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // ========================================
  // DONATION CATEGORIES
  // ========================================
  const categories = [
    {
      value: "Imam Food",
      label: "ইমামের খাবার",
    },
    {
      value: "Sadaqah",
      label: "সাদাকাহ",
    },
    {
      value: "Mosque Development",
      label: "মসজিদ উন্নয়ন",
    },
    {
      value: "Iftar",
      label: "ইফতার",
    },
    {
      value: "Zakat",
      label: "যাকাত",
    },
    {
      value: "Mosque Maintenance",
      label: "মসজিদ রক্ষণাবেক্ষণ",
    },
  ];

  // ========================================
  // SUGGESTED AMOUNTS
  // ========================================
  const amounts = [100, 500, 1000, 2000, 5000];

  // ========================================
  // PAYMENT METHODS
  // ========================================
  const paymentMethods = [
    {
      name: "Cash",
      label: "নগদ",
      icon: <FaHandHoldingHeart />,
    },
    {
      name: "bKash",
      label: "বিকাশ",
      icon: <FaMobileScreenButton />,
    },
    {
      name: "Nagad",
      label: "নগদ",
      icon: <FaMobileScreenButton />,
    },
    {
      name: "Bank",
      label: "ব্যাংক",
      icon: <FaBuildingColumns />,
      disabled: true,
    },
  ];

  // ========================================
  // PAYMENT ACCOUNTS
  // ========================================
  const paymentAccounts = {
    bKash: {
      number: "01927990665",
      type: "বিকাশ পার্সোনাল",
    },

    Nagad: {
      number: "01650053800",
      type: "নগদ পার্সোনাল",
    },
  };

  // ========================================
  // INPUT CHANGE
  // ========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ========================================
  // COPY PAYMENT NUMBER
  // ========================================
  const handleCopyNumber = async () => {
    const number = paymentAccounts[formData.paymentMethod]?.number;

    if (!number) return;

    try {
      await navigator.clipboard.writeText(number);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy Error:", error);
    }
  };

  // ========================================
  // SUBMIT DONATION
  // ========================================
  const handleDonate = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    // ========================================
    // LOGIN CHECK
    // ========================================
    if (!user) {
      setError("অনুদান দেওয়ার আগে অনুগ্রহ করে লগইন করুন।");
      return;
    }

    // ========================================
    // AMOUNT VALIDATION
    // ========================================
    const donationAmount = Number(amount);

    if (!donationAmount || donationAmount <= 0) {
      setError("অনুগ্রহ করে সঠিক অনুদানের পরিমাণ লিখুন।");
      return;
    }

    // ========================================
    // PAYMENT MONTH VALIDATION
    // ========================================
    if (!formData.paymentMonth) {
      setError(
        "অনুগ্রহ করে কোন মাসের জন্য অর্থ প্রদান করছেন তা নির্বাচন করুন।",
      );
      return;
    }

    // ========================================
    // NAME VALIDATION
    // ========================================
    if (!formData.name.trim()) {
      setError("অনুগ্রহ করে আপনার নাম লিখুন।");
      return;
    }

    // ========================================
    // PHONE VALIDATION
    // ========================================
    if (!formData.phone.trim()) {
      setError("অনুগ্রহ করে আপনার ফোন নম্বর লিখুন।");
      return;
    }

    // ========================================
    // TRANSACTION ID VALIDATION
    // ========================================
    if (
      (formData.paymentMethod === "bKash" ||
        formData.paymentMethod === "Nagad") &&
      !formData.transactionId.trim()
    ) {
      setError("অনুগ্রহ করে ট্রানজেকশন আইডি লিখুন।");
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // MAKE SURE FIREBASE TOKEN EXISTS
      // ========================================
      const token = await user.getIdToken();

      if (!token) {
        setError(
          "অথেন্টিকেশন টোকেন পাওয়া যায়নি। অনুগ্রহ করে আবার লগইন করুন।",
        );
        return;
      }

      // ========================================
      // DONATION DATA
      // ========================================
      const donationData = {
        ...formData,

        // Logged in user's email
        userEmail: user.email,

        // Donation amount
        amount: donationAmount,

        // Default status
        status: "Pending",

        // Cash verification
        receivedBy: formData.paymentMethod === "Cash" ? "" : null,

        // Date
        createdAt: new Date().toISOString(),
      };

      // console.log("Donation Data:", donationData);

      // ========================================
      // API REQUEST
      // ========================================
      const res = await axiosSecure.post("/donations", donationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Donation Response:", res.data);

      if (res.data) {
        setSuccess(
          "আলহামদুলিল্লাহ! আপনার অনুদানের তথ্য সফলভাবে জমা হয়েছে। মসজিদ কর্তৃপক্ষ আপনার পেমেন্ট যাচাই করবে।",
        );

        // ========================================
        // RESET AMOUNT
        // ========================================
        setAmount("");

        // ========================================
        // KEEP USER INFORMATION
        // ========================================
        setFormData((prev) => ({
          ...prev,

          // Keep user information
          name: prev.name,
          phone: prev.phone,
          email: user.email,

          // Reset donation information
          category: "Imam Food",
          paymentMethod: "Cash",
          transactionId: "",

          // Automatically select current month
          paymentMonth: getCurrentPaymentMonth(),

          message: "",
        }));

        // ========================================
        // SCROLL TOP
        // ========================================
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (err) {
      console.error("Donation Error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        setError(
          "অথেন্টিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার লগইন করে অনুদান দেওয়ার চেষ্টা করুন।",
        );
      } else {
        setError(
          err.response?.data?.message ||
            "কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <Loading />;
  }

  // ========================================
  // LOGIN REQUIRED PAGE
  // ========================================
  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 transition-colors duration-300 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-lg transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl text-[#087443] dark:bg-green-950/50 dark:text-green-400">
            <FaHandHoldingHeart />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-800 dark:text-white">
            লগইন প্রয়োজন
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            অনুদান দেওয়ার আগে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-xl bg-[#087443] px-5 py-3 font-semibold text-white transition hover:bg-[#065d36]"
          >
            লগইন করুন
          </button>
        </div>
      </section>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================
  return (
    <section className="min-h-screen bg-gray-50 px-3 py-6 pb-30 transition-colors duration-300 dark:bg-gray-950 sm:px-5 md:py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-[#087443] p-6 text-white shadow-lg sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
              <FaHandHoldingHeart />
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              আমাদের মসজিদে সহযোগিতা করুন
            </h1>

            <p className="mt-3 text-sm leading-6 text-green-100 sm:text-base">
              আপনার উদার অনুদান মসজিদের রক্ষণাবেক্ষণ, কমিউনিটি কার্যক্রম এবং
              সবার জন্য একটি সুন্দর পরিবেশ তৈরি করতে সহায়তা করে।
            </p>
          </div>

          <FaMosque className="absolute -bottom-10 -right-5 text-[150px] text-white/5 sm:text-[200px]" />
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700 transition-colors dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <FaCircleCheck className="mt-0.5 shrink-0 text-lg" />

                <p className="text-sm font-medium">{success}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/payment-history")}
                className="shrink-0 rounded-xl bg-[#087443] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#065d36]"
              >
                পেমেন্টের ইতিহাস
              </button>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 transition-colors dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* DONATION FORM */}
        <form
          onSubmit={handleDonate}
          className="mt-6 grid gap-5 lg:grid-cols-3"
        >
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 sm:p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              অনুদান দিন
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              অনুদানের বিভাগ, মাস এবং পরিমাণ নির্বাচন করুন।
            </p>

            {/* DONATION CATEGORY */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                অনুদানের বিভাগ
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#087443] focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-green-500 dark:focus:ring-green-900/40"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* PAYMENT MONTH */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                কোন মাসের জন্য অর্থ প্রদান করছেন? *
              </label>

              <select
                name="paymentMonth"
                value={formData.paymentMonth}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#087443] focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-green-500 dark:focus:ring-green-900/40"
              >
                {paymentMonths.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                যে মাসের জন্য অর্থ প্রদান করছেন সেই মাসটি নির্বাচন করুন।
              </p>
            </div>

            {/* AMOUNT BUTTONS */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                অনুদানের পরিমাণ নির্বাচন করুন
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {amounts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setAmount(item);
                      setError("");
                    }}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                      Number(amount) === item
                        ? "border-[#087443] bg-[#087443] text-white"
                        : "border-gray-200 text-gray-600 hover:border-[#087443] hover:text-[#087443] dark:border-gray-700 dark:text-gray-300 dark:hover:border-green-500 dark:hover:text-green-400"
                    }`}
                  >
                    ৳{item}
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOM AMOUNT */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                অনুদানের পরিমাণ লিখুন
              </label>

              <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-[#087443] dark:border-gray-700 dark:bg-gray-800">
                <span className="flex items-center bg-gray-50 px-4 font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                  ৳
                </span>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  placeholder="অনুদানের পরিমাণ লিখুন"
                  className="w-full bg-transparent px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* DONOR INFORMATION */}
            <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                আপনার তথ্য
              </h3>

              {userLoading && (
                <p className="mt-2 text-xs text-[#087443] dark:text-green-400">
                  আপনার অ্যাকাউন্টের তথ্য লোড হচ্ছে...
                </p>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {/* NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    পূর্ণ নাম *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#087443] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ফোন নম্বর *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#087443] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500"
                  />
                </div>

                {/* EMAIL */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ইমেইল
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                পেমেন্টের মাধ্যম
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.name}
                    type="button"
                    disabled={method.disabled}
                    onClick={() => {
                      if (method.disabled) return;

                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: method.name,
                        transactionId: "",
                      }));
                    }}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${
                      method.disabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300 opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600"
                        : formData.paymentMethod === method.name
                          ? "border-[#087443] bg-green-50 text-[#087443] dark:border-green-700 dark:bg-green-950/50 dark:text-green-400"
                          : "border-gray-200 text-gray-500 hover:border-[#087443] dark:border-gray-700 dark:text-gray-400 dark:hover:border-green-500"
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>

                    <span className="mt-1 text-xs font-semibold">
                      {method.label}
                    </span>

                    {method.disabled && (
                      <span className="mt-1 text-[9px] text-gray-400 dark:text-gray-500">
                        বর্তমানে বন্ধ
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* BKASH / NAGAD PAYMENT INFORMATION */}
            {(formData.paymentMethod === "bKash" ||
              formData.paymentMethod === "Nagad") && (
              <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-4 transition-colors dark:border-green-900/60 dark:bg-green-950/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#087443] dark:bg-gray-800 dark:text-green-400">
                    <FaMobileScreenButton />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">
                      {formData.paymentMethod === "bKash"
                        ? "বিকাশের মাধ্যমে টাকা পাঠান"
                        : "নগদের মাধ্যমে টাকা পাঠান"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      অনুগ্রহ করে নিচের নম্বরে আপনার অনুদানের টাকা পাঠান:
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-3 dark:bg-gray-800">
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {paymentAccounts[formData.paymentMethod].type}
                        </p>

                        <p className="mt-1 text-lg font-bold tracking-wide text-[#087443] dark:text-green-400">
                          {paymentAccounts[formData.paymentMethod].number}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#087443] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#065d36]"
                      >
                        {copied ? (
                          <>
                            <FaCircleCheck />
                            কপি হয়েছে
                          </>
                        ) : (
                          <>
                            <FaCopy />
                            কপি
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* TRANSACTION ID */}
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ট্রানজেকশন আইডি *
                  </label>

                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    placeholder="ট্রানজেকশন আইডি লিখুন"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#087443] focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500 dark:focus:ring-green-900/40"
                  />

                  <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                    টাকা পাঠানোর পর এখানে ট্রানজেকশন আইডি লিখুন।
                  </p>
                </div>
              </div>
            )}

            {/* CASH PAYMENT */}
            {formData.paymentMethod === "Cash" && (
              <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-5 transition-colors dark:border-green-900/60 dark:bg-green-950/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#087443] dark:bg-gray-800 dark:text-green-400">
                    <FaHandHoldingHeart />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">
                      নগদ অনুদান
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      অনুগ্রহ করে আপনার অনুদানের টাকা সরাসরি মসজিদ কর্তৃপক্ষের
                      কাছে প্রদান করুন।
                    </p>

                    <p className="mt-2 text-xs font-medium text-[#087443] dark:text-green-400">
                      নগদ পেমেন্টের জন্য কোনো ট্রানজেকশন আইডি প্রয়োজন নেই।
                    </p>

                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      মসজিদ কর্তৃপক্ষ যাচাই না করা পর্যন্ত আপনার পেমেন্টটি
                      Pending অবস্থায় থাকবে।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MESSAGE */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                বার্তা
                <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                  (ঐচ্ছিক)
                </span>
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="আপনার কোনো বার্তা থাকলে লিখুন..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#087443] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500"
              />
            </div>

            {/* DONATE BUTTON */}
            <button
              type="submit"
              disabled={loading || userLoading}
              className="mt-6 w-full rounded-xl bg-[#087443] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:bg-[#065d36] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "জমা দেওয়া হচ্ছে..." : `৳${amount || "0"} অনুদান দিন`}
            </button>
          </div>
        </form>

        {/* BOTTOM MESSAGE */}
        <div className="mt-5 rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
          <FaHandHoldingHeart className="mx-auto text-3xl text-[#087443] dark:text-green-400" />

          <h2 className="mt-3 text-lg font-bold text-gray-800 dark:text-white">
            আপনার প্রতিটি অনুদান গুরুত্বপূর্ণ
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            আল্লাহ আপনার দান ও উদারতার উত্তম প্রতিদান দিন এবং আপনার অনুদান কবুল
            করুন। আমিন।
          </p>
        </div>
      </div>
    </section>
  );
};

export default Donate;
