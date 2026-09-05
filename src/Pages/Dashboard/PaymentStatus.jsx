import React, { useEffect, useMemo, useState } from "react";

import axiosSecure from "../../api/axiosSecure";

import {
  FaMagnifyingGlass,
  FaCircleCheck,
  FaClock,
  FaCircleXmark,
  FaFilter,
  FaEye,
  FaXmark,
  FaMoneyBillWave,
  FaPhone,
  FaCalendarDays,
  FaCreditCard,
  FaRotate,
} from "react-icons/fa6";

const PaymentStatus = () => {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);

  // =====================================================
  // CURRENT DATE
  // =====================================================

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // =====================================================
  // BANGLA DIGITS
  // =====================================================

  const toBanglaDigits = (value) => {
    return String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
  };

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("bn-BD").format(Number(amount) || 0);
  };

  // =====================================================
  // MONTH LABEL
  // Backend matching এর জন্য English value রাখা হয়েছে
  // UI তে Bangla label দেখানো হবে
  // =====================================================

  const months = useMemo(() => {
    return Array.from({ length: currentMonth + 1 }, (_, index) => {
      const date = new Date(currentYear, index, 1);

      return {
        value: date.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        }),

        label: date.toLocaleString("bn-BD", {
          month: "long",
          year: "numeric",
        }),

        year: currentYear,
        monthIndex: index,
      };
    });
  }, [currentYear, currentMonth]);

  // =====================================================
  // DEFAULT SELECTED MONTH
  // =====================================================

  useEffect(() => {
    if (months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[months.length - 1].value);
    }
  }, [months, selectedMonth]);

  // =====================================================
  // LOAD USERS + DONATIONS
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, donationsResponse] = await Promise.all([
        axiosSecure.get("/users"),
        axiosSecure.get("/donations"),
      ]);

      const usersData = Array.isArray(usersResponse.data)
        ? usersResponse.data
        : usersResponse.data?.users || usersResponse.data?.data || [];

      const donationsData = Array.isArray(donationsResponse.data)
        ? donationsResponse.data
        : donationsResponse.data?.donations ||
          donationsResponse.data?.data ||
          [];

      setUsers(Array.isArray(usersData) ? usersData : []);
      setDonations(Array.isArray(donationsData) ? donationsData : []);
    } catch (err) {
      console.error(
        "Failed to load payment status data:",
        err.response?.data || err.message,
      );

      if (err.response?.status === 401) {
        setError(
          "অনুমতি নেই! আপনার লগইন সেশন শেষ হয়ে যেতে পারে। অনুগ্রহ করে আবার লগইন করুন।",
        );
      } else if (err.response?.status === 403) {
        setError(
          "অ্যাক্সেস প্রত্যাখ্যাত। পেমেন্ট স্ট্যাটাস দেখতে অ্যাডমিন অনুমতি প্রয়োজন।",
        );
      } else {
        setError(
          "পেমেন্টের তথ্য লোড করা যায়নি। অনুগ্রহ করে সার্ভার চালু আছে কিনা এবং /users ও /donations API ঠিকভাবে কাজ করছে কিনা নিশ্চিত করুন।",
        );
      }

      setUsers([]);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // GET MONTH/YEAR FROM DATE
  // =====================================================

  const getMonthYear = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // SELECTED MONTH OBJECT
  // =====================================================

  const selectedMonthInfo = useMemo(() => {
    return (
      months.find((month) => month.value === selectedMonth) ||
      months[months.length - 1]
    );
  }, [months, selectedMonth]);

  // =====================================================
  // GET MONTHLY FEE
  // =====================================================

  const getMonthlyFee = (user) => {
    const amount = Number(user?.monthlyFee);

    if (!Number.isNaN(amount) && amount > 0) {
      return amount;
    }

    return 500;
  };

  // =====================================================
  // PAYMENT METHOD LABEL
  // =====================================================

  const paymentMethodLabels = {
    Cash: "ক্যাশ",
    bKash: "বিকাশ",
    Nagad: "নগদ",
    Rocket: "রকেট",
    "Bank Transfer": "ব্যাংক ট্রান্সফার",
    Card: "কার্ড",
    Other: "অন্যান্য",
  };

  // =====================================================
  // CATEGORY LABEL
  // =====================================================

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
    "Mosque Development": "মসজিদ উন্নয়ন",
    "Mosque Maintenance": "মসজিদ রক্ষণাবেক্ষণ",
    Other: "অন্যান্য",
  };

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const statusLabels = {
    Paid: "পরিশোধিত",
    Pending: "অপেক্ষমাণ",
    Defaulted: "ডিফল্টেড",
  };

  // =====================================================
  // FIND PAYMENT FOR USER + SELECTED MONTH
  // =====================================================

  const findUserPayment = (user) => {
    if (!selectedMonth) return null;

    const userEmail = user?.email?.toLowerCase();
    const userPhone = user?.phone;

    const matchingPayments = donations.filter((donation) => {
      const donationMonth = getMonthYear(donation?.createdAt);

      if (donationMonth !== selectedMonth) {
        return false;
      }

      const donationEmail = donation?.email?.toLowerCase();
      const donationPhone = donation?.phone;

      const emailMatch =
        userEmail && donationEmail && userEmail === donationEmail;

      const phoneMatch =
        userPhone &&
        donationPhone &&
        String(userPhone) === String(donationPhone);

      return emailMatch || phoneMatch;
    });

    if (matchingPayments.length === 0) {
      return null;
    }

    const paidPayment = matchingPayments.find(
      (payment) => payment?.status?.toLowerCase() === "paid",
    );

    if (paidPayment) {
      return paidPayment;
    }

    return matchingPayments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  };

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const getPaymentStatus = (user) => {
    const payment = findUserPayment(user);

    if (!payment) {
      return {
        status: "Defaulted",
        payment: null,
      };
    }

    const status = payment?.status?.toLowerCase();

    if (status === "paid") {
      return {
        status: "Paid",
        payment,
      };
    }

    if (status === "pending") {
      return {
        status: "Pending",
        payment,
      };
    }

    if (status === "defaulted" || status === "overdue" || status === "failed") {
      return {
        status: "Defaulted",
        payment,
      };
    }

    return {
      status: "Pending",
      payment,
    };
  };

  // =====================================================
  // PAYMENT STATUS DATA
  // =====================================================

  const paymentStatusData = useMemo(() => {
    return users.map((user) => {
      const paymentInfo = getPaymentStatus(user);

      const payment = paymentInfo.payment;

      const rawCategory = payment?.category || payment?.donationType || "-";

      return {
        id: user?._id,

        name: user?.name || "অজানা ব্যবহারকারী",

        email: user?.email || "",

        phone: user?.phone || "যোগ করা হয়নি",

        monthlyAmount: getMonthlyFee(user),

        status: paymentInfo.status,

        paymentDate: payment?.createdAt
          ? new Date(payment.createdAt).toLocaleDateString("bn-BD", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "-",

        paymentMethod: payment?.paymentMethod || "-",

        paymentAmount: Number(payment?.amount || 0),

        category: rawCategory,

        message: payment?.message || payment?.note || "",

        paymentId: payment?._id || null,

        rawPayment: payment,
      };
    });
  }, [users, donations, selectedMonth]);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredData = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return paymentStatusData;
    }

    return paymentStatusData.filter((user) => {
      const name = user?.name?.toLowerCase() || "";
      const email = user?.email?.toLowerCase() || "";
      const phone = user?.phone?.toString().toLowerCase() || "";

      return (
        name.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText)
      );
    });
  }, [paymentStatusData, search]);

  // =====================================================
  // STATS
  // =====================================================

  const totalUsers = paymentStatusData.length;

  const paidUsers = paymentStatusData.filter((user) => user.status === "Paid");

  const pendingUsers = paymentStatusData.filter(
    (user) => user.status === "Pending",
  );

  const defaultedUsers = paymentStatusData.filter(
    (user) => user.status === "Defaulted",
  );

  const paidAmount = paidUsers.reduce(
    (total, user) =>
      total + Number(user.paymentAmount || user.monthlyAmount || 0),
    0,
  );

  const pendingAmount = pendingUsers.reduce(
    (total, user) => total + Number(user.monthlyAmount || 0),
    0,
  );

  const defaultedAmount = defaultedUsers.reduce(
    (total, user) => total + Number(user.monthlyAmount || 0),
    0,
  );

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400";
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400";
    }

    return "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400";
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    if (status === "Paid") {
      return <FaCircleCheck />;
    }

    if (status === "Pending") {
      return <FaClock />;
    }

    return <FaCircleXmark />;
  };

  // =====================================================
  // MONTH LABEL
  // =====================================================

  const selectedMonthLabel = selectedMonthInfo?.label || "বর্তমান মাস";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-green-600"></span>

          <p className="mt-4 text-gray-500 dark:text-gray-400">
            পেমেন্ট স্ট্যাটাস লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
        <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400">
            <FaCircleXmark size={24} />
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
            তথ্য লোড করা যায়নি
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error}
          </p>

          <button
            onClick={loadData}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <FaRotate />
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-white">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            পেমেন্ট স্ট্যাটাস
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            সকল মসজিদ সদস্যের মাসিক পেমেন্টের স্ট্যাটাস দেখুন ও পর্যবেক্ষণ করুন।
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* MONTH SELECT */}

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-green-900/40"
          >
            {months.map((month) => (
              <option
                key={month.value}
                value={month.value}
                className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white"
              >
                {month.label}
              </option>
            ))}
          </select>

          {/* REFRESH */}

          <button
            onClick={loadData}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FaRotate />
            রিফ্রেশ
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL USERS */}

        <div className="rounded-xl border border-transparent bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                মোট ব্যবহারকারী
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                {toBanglaDigits(totalUsers)}
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                নিবন্ধিত মসজিদ সদস্য
              </p>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <FaFilter size={20} />
            </div>
          </div>
        </div>

        {/* PAID */}

        <div className="rounded-xl border border-transparent bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                পরিশোধিত
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                {toBanglaDigits(paidUsers.length)}
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                সংগৃহীত: ৳{formatMoney(paidAmount)}
              </p>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-950/40 dark:text-green-400">
              <FaCircleCheck size={20} />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="rounded-xl border border-transparent bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                অপেক্ষমাণ
              </p>

              <h2 className="mt-2 text-2xl font-bold text-yellow-500 dark:text-yellow-400">
                {toBanglaDigits(pendingUsers.length)}
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                পরিমাণ: ৳{formatMoney(pendingAmount)}
              </p>
            </div>

            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-500 dark:bg-yellow-950/40 dark:text-yellow-400">
              <FaClock size={20} />
            </div>
          </div>
        </div>

        {/* DEFAULTED */}

        <div className="rounded-xl border border-transparent bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ডিফল্টেড
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-500 dark:text-red-400">
                {toBanglaDigits(defaultedUsers.length)}
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                পরিমাণ: ৳{formatMoney(defaultedAmount)}
              </p>
            </div>

            <div className="rounded-xl bg-red-100 p-3 text-red-500 dark:bg-red-950/40 dark:text-red-400">
              <FaCircleXmark size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="rounded-xl border border-transparent bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="relative max-w-lg">
          <FaMagnifyingGlass className="absolute left-4 top-3.5 text-gray-400" />

          <input
            type="text"
            placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-green-900/40"
          />
        </div>
      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-xl border border-transparent bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* TABLE HEADER */}

        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white">
              ব্যবহারকারীদের পেমেন্ট স্ট্যাটাস
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedMonthLabel}-এর পেমেন্টের তথ্য
            </p>
          </div>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {toBanglaDigits(filteredData.length)} / {toBanglaDigits(totalUsers)}{" "}
            জন ব্যবহারকারী দেখানো হচ্ছে
          </span>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-gray-50 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">ব্যবহারকারী</th>

                <th className="px-6 py-4">ফোন</th>

                <th className="px-6 py-4">মাসিক পরিমাণ</th>

                <th className="px-6 py-4">স্ট্যাটাস</th>

                <th className="px-6 py-4">পেমেন্টের তারিখ</th>

                <th className="px-6 py-4">পদ্ধতি</th>

                <th className="px-6 py-4">অ্যাকশন</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-100 text-sm transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60"
                >
                  {/* USER */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-semibold text-green-600 dark:bg-green-950/40 dark:text-green-400">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {user.name}
                        </p>

                        <p className="max-w-[220px] truncate text-xs text-gray-500 dark:text-gray-400">
                          {user.email || "ইমেইল নেই"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* PHONE */}

                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {user.phone}
                  </td>

                  {/* AMOUNT */}

                  <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">
                    ৳{formatMoney(user.monthlyAmount)}
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        user.status,
                      )}`}
                    >
                      {getStatusIcon(user.status)}

                      {statusLabels[user.status] || user.status}
                    </span>
                  </td>

                  {/* DATE */}

                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {user.paymentDate}
                  </td>

                  {/* METHOD */}

                  <td className="px-6 py-4">
                    {user.paymentMethod !== "-" ? (
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {paymentMethodLabels[user.paymentMethod] ||
                          user.paymentMethod}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        -
                      </span>
                    )}
                  </td>

                  {/* ACTION */}

                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedPayment(user)}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-green-800 dark:hover:bg-green-950/30 dark:hover:text-green-400"
                    >
                      <FaEye />
                      দেখুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY */}

          {filteredData.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <FaMagnifyingGlass size={20} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-700 dark:text-gray-200">
                কোনো ব্যবহারকারী পাওয়া যায়নি
              </h3>

              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                অন্য কোনো সার্চ বা অন্য মাস নির্বাচন করে আবার চেষ্টা করুন।
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* INFO SECTION */}
      {/* ================================================= */}

      <div className="rounded-xl border border-green-100 bg-green-50 p-5 dark:border-green-900/50 dark:bg-green-950/30">
        <h3 className="font-semibold text-green-800 dark:text-green-300">
          পেমেন্ট স্ট্যাটাস সম্পর্কে তথ্য
        </h3>

        <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-green-700 dark:text-green-300 md:grid-cols-3">
          <p>
            <span className="font-semibold">✅ পরিশোধিত</span> — পেমেন্ট সফলভাবে
            সম্পন্ন হয়েছে।
          </p>

          <p>
            <span className="font-semibold">⏳ অপেক্ষমাণ</span> — পেমেন্ট জমা
            দেওয়া হয়েছে, কিন্তু এখনও সম্পন্ন বা যাচাই করা হয়নি।
          </p>

          <p>
            <span className="font-semibold">❌ ডিফল্টেড</span> — এই মাসের কোনো
            পেমেন্ট রেকর্ড পাওয়া যায়নি।
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* VIEW PAYMENT MODAL */}
      {/* ================================================= */}

      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  পেমেন্টের বিস্তারিত
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedMonthLabel}
                </p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-red-100 hover:text-red-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <FaXmark />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-6">
              {/* USER INFO */}

              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600 dark:bg-green-950/40 dark:text-green-400">
                  {selectedPayment?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {selectedPayment.name}
                  </h3>

                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {selectedPayment.email || "ইমেইল নেই"}
                  </p>
                </div>
              </div>

              {/* DETAILS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* PHONE */}

                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <FaPhone />
                    ফোন
                  </div>

                  <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">
                    {selectedPayment.phone}
                  </p>
                </div>

                {/* AMOUNT */}

                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <FaMoneyBillWave />
                    পরিমাণ
                  </div>

                  <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">
                    ৳
                    {formatMoney(
                      selectedPayment.paymentAmount ||
                        selectedPayment.monthlyAmount ||
                        0,
                    )}
                  </p>
                </div>

                {/* STATUS */}

                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <FaCircleCheck />
                    স্ট্যাটাস
                  </div>

                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      selectedPayment.status,
                    )}`}
                  >
                    {getStatusIcon(selectedPayment.status)}

                    {statusLabels[selectedPayment.status] ||
                      selectedPayment.status}
                  </span>
                </div>

                {/* DATE */}

                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <FaCalendarDays />
                    পেমেন্টের তারিখ
                  </div>

                  <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">
                    {selectedPayment.paymentDate}
                  </p>
                </div>

                {/* METHOD */}

                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <FaCreditCard />
                    পেমেন্ট পদ্ধতি
                  </div>

                  <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">
                    {paymentMethodLabels[selectedPayment.paymentMethod] ||
                      selectedPayment.paymentMethod}
                  </p>
                </div>

                {/* CATEGORY */}

                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <FaFilter />
                    বিভাগ
                  </div>

                  <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">
                    {categoryLabels[selectedPayment.category] ||
                      selectedPayment.category}
                  </p>
                </div>
              </div>

              {/* MESSAGE */}

              {selectedPayment.message && (
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    বার্তা
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {selectedPayment.message}
                  </p>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800">
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
