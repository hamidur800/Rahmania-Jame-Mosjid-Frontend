import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router";

import {
  FaMagnifyingGlass,
  FaFilter,
  FaMoneyBillWave,
  FaClock,
  FaTriangleExclamation,
  FaRotate,
  FaEye,
} from "react-icons/fa6";

import Swal from "sweetalert2";

import axiosSecure from "../../api/axiosSecure";

const Payments = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================
  // CATEGORY LABEL
  // =====================================

  const categoryLabels = {
    "Mosque Fund": "মসজিদ তহবিল",
    "Imam Food Fee": "ইমামের খাবার",
    Zakat: "যাকাত",
    Sadaqah: "সাদাকাহ",
    Fitrah: "ফিতরা",
    "Construction Fund": "নির্মাণ তহবিল",
    "Iftar Fund": "ইফতার তহবিল",
    "Madrasa Fund": "মাদরাসা তহবিল",
    "Orphan Fund": "এতিম তহবিল",
    Other: "অন্যান্য",
  };

  // =====================================
  // PAYMENT METHOD LABEL
  // =====================================

  const paymentMethodLabels = {
    Cash: "ক্যাশ",
    bKash: "বিকাশ",
    Nagad: "নগদ",
    Rocket: "রকেট",
    "Bank Transfer": "ব্যাংক ট্রান্সফার",
    Card: "কার্ড",
    Other: "অন্যান্য",
  };

  // =====================================
  // STATUS LABEL
  // =====================================

  const statusLabels = {
    Paid: "পরিশোধিত",
    Pending: "অপেক্ষমাণ",
    Defaulted: "ডিফল্টেড",
  };

  // =====================================
  // GET CATEGORY
  // =====================================

  const getCategory = (payment) => {
    return payment?.category || payment?.donationType || "";
  };

  // =====================================
  // GET ALL PAYMENTS
  // =====================================

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosSecure.get("/donations");

      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(
        "Failed to load payments:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        setError("অনুমতি নেই! অনুগ্রহ করে আবার লগইন করুন।");
      } else if (error.response?.status === 403) {
        setError("অ্যাক্সেস প্রত্যাখ্যাত। অ্যাডমিন অনুমতি প্রয়োজন।");
      } else {
        setError("পেমেন্টের তথ্য লোড করা যায়নি।");
      }

      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD PAYMENTS
  // =====================================

  useEffect(() => {
    loadPayments();
  }, []);

  // =====================================
  // UNIQUE PAYMENT METHODS
  // =====================================

  const paymentMethods = useMemo(() => {
    return [
      ...new Set(
        payments.map((payment) => payment?.paymentMethod).filter(Boolean),
      ),
    ];
  }, [payments]);

  // =====================================
  // UNIQUE CATEGORIES
  // =====================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        payments.map((payment) => getCategory(payment)).filter(Boolean),
      ),
    ];
  }, [payments]);

  // =====================================
  // FILTER PAYMENTS
  // =====================================

  const filteredPayments = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const name = payment?.name?.toLowerCase() || "";
      const email = payment?.email?.toLowerCase() || "";
      const phone = payment?.phone?.toString().toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText);

      const matchesStatus =
        statusFilter === "All" || payment?.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || payment?.paymentMethod === methodFilter;

      const matchesCategory =
        categoryFilter === "All" || getCategory(payment) === categoryFilter;

      return matchesSearch && matchesStatus && matchesMethod && matchesCategory;
    });
  }, [payments, search, statusFilter, methodFilter, categoryFilter]);

  // =====================================
  // TOTAL COLLECTED
  // =====================================

  const totalCollected = useMemo(() => {
    return payments
      .filter((payment) => payment?.status === "Paid")
      .reduce((total, payment) => total + Number(payment?.amount || 0), 0);
  }, [payments]);

  // =====================================
  // PENDING AMOUNT
  // =====================================

  const pendingAmount = useMemo(() => {
    return payments
      .filter((payment) => payment?.status === "Pending")
      .reduce((total, payment) => total + Number(payment?.amount || 0), 0);
  }, [payments]);

  // =====================================
  // DEFAULTED AMOUNT
  // =====================================

  const defaultedAmount = useMemo(() => {
    return payments
      .filter((payment) => payment?.status === "Defaulted")
      .reduce((total, payment) => total + Number(payment?.amount || 0), 0);
  }, [payments]);

  // =====================================
  // PAID COUNT
  // =====================================

  const paidCount = useMemo(() => {
    return payments.filter((payment) => payment?.status === "Paid").length;
  }, [payments]);

  // =====================================
  // PENDING COUNT
  // =====================================

  const pendingCount = useMemo(() => {
    return payments.filter((payment) => payment?.status === "Pending").length;
  }, [payments]);

  // =====================================
  // DEFAULTED COUNT
  // =====================================

  const defaultedCount = useMemo(() => {
    return payments.filter((payment) => payment?.status === "Defaulted").length;
  }, [payments]);

  // =====================================
  // FORMAT MONEY
  // =====================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("bn-BD").format(Number(amount || 0));
  };

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("bn-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================
  // CHANGE PAYMENT STATUS
  // =====================================

  const handleStatusChange = async (payment, newStatus) => {
    if (!payment?._id) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "পেমেন্ট আইডি পাওয়া যায়নি।",
        confirmButtonColor: "#dc2626",
      });

      return;
    }

    // Same status হলে কিছু করবে না
    if (payment.status === newStatus) {
      return;
    }

    try {
      const result = await Swal.fire({
        title: "পেমেন্ট স্ট্যাটাস পরিবর্তন করবেন?",
        html: `
          <div style="font-size:14px;color:#6b7280;text-align:left;">
            <p>
              ব্যবহারকারী:
              <strong style="color:#111827;">
                ${payment.name || "অজানা ব্যবহারকারী"}
              </strong>
            </p>

            <p style="margin-top:8px;">
              নতুন স্ট্যাটাস:
              <strong style="color:#16a34a;">
                ${statusLabels[newStatus] || newStatus}
              </strong>
            </p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "হ্যাঁ, পরিবর্তন করুন",
        cancelButtonText: "বাতিল",
      });

      if (!result.isConfirmed) {
        return;
      }

      setUpdatingId(payment._id);

      // =====================================
      // UPDATE DATABASE
      // =====================================

      const res = await axiosSecure.patch(`/donations/${payment._id}`, {
        status: newStatus,
      });

      if (res.data) {
        // =====================================
        // UPDATE UI WITHOUT RELOADING
        // =====================================

        setPayments((prevPayments) =>
          prevPayments.map((item) =>
            item._id === payment._id
              ? {
                  ...item,
                  status: newStatus,
                }
              : item,
          ),
        );

        Swal.fire({
          icon: "success",
          title: "স্ট্যাটাস আপডেট হয়েছে!",
          text: `${payment.name || "পেমেন্ট"} এর স্ট্যাটাস ${
            statusLabels[newStatus] || newStatus
          } করা হয়েছে।`,
          confirmButtonColor: "#16a34a",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(
        "Failed to update payment status:",
        error.response?.data || error.message,
      );

      Swal.fire({
        icon: "error",
        title: "আপডেট ব্যর্থ",
        text:
          error?.response?.data?.message ||
          "পেমেন্টের স্ট্যাটাস আপডেট করা যায়নি।",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================
  // VIEW PAYMENT
  // =====================================

  const handleViewPayment = (payment) => {
    const category = getCategory(payment);

    const paymentMethod =
      paymentMethodLabels[payment?.paymentMethod] ||
      payment?.paymentMethod ||
      "-";

    const categoryLabel = categoryLabels[category] || category || "-";

    const statusLabel = statusLabels[payment?.status] || payment?.status || "-";

    const statusColor =
      payment?.status === "Paid"
        ? "#16a34a"
        : payment?.status === "Pending"
          ? "#ca8a04"
          : "#dc2626";

    Swal.fire({
      title: "পেমেন্টের বিস্তারিত",
      width: 520,
      html: `
        <div
          style="
            text-align:left;
            font-size:14px;
            color:#374151;
          "
        >

          <div
            style="
              display:flex;
              justify-content:space-between;
              gap:20px;
              padding:10px 0;
              border-bottom:1px solid #e5e7eb;
            "
          >
            <strong>নাম:</strong>
            <span>${payment?.name || "-"}</span>
          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              gap:20px;
              padding:10px 0;
              border-bottom:1px solid #e5e7eb;
            "
          >
            <strong>ইমেইল:</strong>
            <span>${payment?.email || "-"}</span>
          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              gap:20px;
              padding:10px 0;
              border-bottom:1px solid #e5e7eb;
            "
          >
            <strong>ফোন:</strong>
            <span>${payment?.phone || "-"}</span>
          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              gap:20px;
              padding:10px 0;
              border-bottom:1px solid #e5e7eb;
            "
          >
            <strong>বিভাগ:</strong>
            <span>${categoryLabel}</span>
          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              gap:20px;
              padding:10px 0;
              border-bottom:1px solid #e5e7eb;
            "
          >
            <strong>পেমেন্ট মাধ্যম:</strong>
            <span>${paymentMethod}</span>
          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              gap:20px;
              padding:10px 0;
              border-bottom:1px solid #e5e7eb;
            "
          >
            <strong>পরিমাণ:</strong>

            <strong style="color:#16a34a;">
              ৳${formatMoney(payment?.amount)}
            </strong>
          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              gap:20px;
              padding:10px 0;
              border-bottom:1px solid #e5e7eb;
            "
          >
            <strong>স্ট্যাটাস:</strong>

            <span
              style="
                font-weight:600;
                color:${statusColor};
              "
            >
              ${statusLabel}
            </span>
          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              gap:20px;
              padding:10px 0;
              border-bottom:1px solid #e5e7eb;
            "
          >
            <strong>তারিখ:</strong>

            <span>
              ${formatDate(payment?.createdAt)}
            </span>
          </div>

          <div style="padding-top:12px;">
            <strong>বার্তা:</strong>

            <p
              style="
                margin-top:6px;
                padding:10px;
                background:#f9fafb;
                border-radius:8px;
                color:#6b7280;
              "
            >
              ${payment?.message || "কোনো বার্তা নেই"}
            </p>
          </div>

        </div>
      `,
      confirmButtonText: "বন্ধ করুন",
      confirmButtonColor: "#16a34a",
    });
  };

  // =====================================
  // STATUS STYLE
  // =====================================

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400";
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400";
    }

    if (status === "Defaulted") {
      return "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400";
    }

    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-green-600"></span>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            পেমেন্টের তথ্য লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400">
            <FaTriangleExclamation />
          </div>

          <p className="mt-4 text-red-500 dark:text-red-400">{error}</p>

          <button
            onClick={loadPayments}
            className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <FaRotate />
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            পেমেন্ট ব্যবস্থাপনা
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            মসজিদের সকল পেমেন্ট ও দানের তথ্য পরিচালনা ও পর্যবেক্ষণ করুন।
          </p>
        </div>

        <button
          onClick={loadPayments}
          className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FaRotate />
          রিফ্রেশ
        </button>
      </div>

      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* TOTAL COLLECTED */}

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                মোট সংগ্রহ
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                ৳{formatMoney(totalCollected)}
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {paidCount} টি পরিশোধিত পেমেন্ট
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <FaMoneyBillWave />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                বকেয়া পরিমাণ
              </p>

              <h2 className="mt-2 text-2xl font-bold text-yellow-500">
                ৳{formatMoney(pendingAmount)}
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {pendingCount} টি অপেক্ষমাণ পেমেন্ট
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 text-yellow-500 dark:bg-yellow-950/50 dark:text-yellow-400">
              <FaClock />
            </div>
          </div>
        </div>

        {/* DEFAULTED */}

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ডিফল্টেড পরিমাণ
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-500 dark:text-red-400">
                ৳{formatMoney(defaultedAmount)}
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {defaultedCount} টি ডিফল্টেড পেমেন্ট
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/50 dark:text-red-400">
              <FaTriangleExclamation />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          SEARCH + FILTER
      ===================================== */}

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* SEARCH */}

          <div className="relative flex-1">
            <FaMagnifyingGlass className="absolute left-4 top-3.5 text-gray-400" />

            <input
              type="text"
              placeholder="নাম, ইমেইল অথবা ফোন দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-green-900/40"
            />
          </div>

          {/* FILTER BUTTON */}

          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition ${
              showFilter
                ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <FaFilter />
            ফিল্টার
          </button>
        </div>

        {/* FILTER OPTIONS */}

        {showFilter && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 md:grid-cols-3 dark:border-gray-800">
            {/* STATUS */}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                স্ট্যাটাস
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="All">সব স্ট্যাটাস</option>
                <option value="Paid">পরিশোধিত</option>
                <option value="Pending">অপেক্ষমাণ</option>
                <option value="Defaulted">ডিফল্টেড</option>
              </select>
            </div>

            {/* METHOD */}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                পেমেন্ট মাধ্যম
              </label>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="All">সব মাধ্যম</option>

                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {paymentMethodLabels[method] || method}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                বিভাগ
              </label>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="All">সব বিভাগ</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category] || category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* =====================================
          PAYMENT TABLE
      ===================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* TABLE HEADER */}

        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white">
              পেমেন্টের রেকর্ড
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filteredPayments.length} টি দেখানো হচ্ছে, মোট {payments.length}{" "}
              টি পেমেন্টের মধ্যে
            </p>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-gray-50 text-sm text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">ব্যবহারকারী</th>
                <th className="px-6 py-4">ফোন</th>
                <th className="px-6 py-4">বিভাগ</th>
                <th className="px-6 py-4">পরিমাণ</th>
                <th className="px-6 py-4">মাধ্যম</th>
                <th className="px-6 py-4">স্ট্যাটাস</th>
                <th className="px-6 py-4">তারিখ</th>
                <th className="px-6 py-4">অ্যাকশন</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => {
                const category = getCategory(payment);

                return (
                  <tr
                    key={payment?._id}
                    className="border-t border-gray-100 text-sm transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    {/* USER */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-600 dark:bg-green-950/50 dark:text-green-400">
                          {payment?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {payment?.name || "অজানা ব্যবহারকারী"}
                          </p>

                          <p className="max-w-[220px] truncate text-xs text-gray-500 dark:text-gray-400">
                            {payment?.email || "ইমেইল নেই"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PHONE */}

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {payment?.phone || "যোগ করা হয়নি"}
                    </td>

                    {/* CATEGORY */}

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        {categoryLabels[category] || category || "-"}
                      </span>
                    </td>

                    {/* AMOUNT */}

                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">
                      ৳{formatMoney(payment?.amount)}
                    </td>

                    {/* METHOD */}

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {paymentMethodLabels[payment?.paymentMethod] ||
                          payment?.paymentMethod ||
                          "-"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">
                      <select
                        value={payment?.status || "Pending"}
                        disabled={updatingId === payment?._id}
                        onChange={(e) =>
                          handleStatusChange(payment, e.target.value)
                        }
                        className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700 ${getStatusStyle(
                          payment?.status,
                        )} ${
                          updatingId === payment?._id
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }`}
                      >
                        <option value="Pending">অপেক্ষমাণ</option>

                        <option value="Paid">পরিশোধিত</option>

                        <option value="Defaulted">ডিফল্টেড</option>
                      </select>
                    </td>

                    {/* DATE */}

                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(payment?.createdAt)}
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewPayment(payment)}
                        className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/70"
                      >
                        <FaEye />
                        দেখুন
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* EMPTY */}

          {filteredPayments.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <FaMoneyBillWave />
              </div>

              <h3 className="mt-4 font-semibold text-gray-700 dark:text-gray-200">
                কোনো পেমেন্ট পাওয়া যায়নি
              </h3>

              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                আপনার সার্চ অথবা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          INFORMATION
      ===================================== */}

      <div className="rounded-xl border border-green-100 bg-green-50 p-5 dark:border-green-900/50 dark:bg-green-950/30">
        <h3 className="font-semibold text-green-800 dark:text-green-400">
          পেমেন্ট স্ট্যাটাস সম্পর্কে তথ্য
        </h3>

        <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-green-700 md:grid-cols-3 dark:text-green-300">
          <p>✅ পরিশোধিত — পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।</p>

          <p>⏳ অপেক্ষমাণ — পেমেন্ট এখনো সম্পন্ন হয়নি।</p>

          <p>❌ ডিফল্টেড — পেমেন্টের নির্ধারিত সময়সীমা শেষ হয়েছে।</p>
        </div>
      </div>
    </div>
  );
};

export default Payments;
