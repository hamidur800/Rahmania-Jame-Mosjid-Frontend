import { useEffect, useMemo, useState } from "react";

import {
  FaFileArrowDown,
  FaChartColumn,
  FaMoneyBillTrendUp,
  FaUsers,
  FaRotate,
  FaCalendarDays,
} from "react-icons/fa6";

import axiosSecure from "../../api/axiosSecure";

const Reports = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // =========================================
  // BANGLA DIGITS
  // =========================================

  const toBanglaDigits = (value) => {
    return String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
  };

  // =========================================
  // FORMAT MONEY
  // =========================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("bn-BD").format(
      Math.round(Number(amount) || 0),
    );
  };

  // =========================================
  // CATEGORY LABEL
  // =========================================

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

  // =========================================
  // PAYMENT METHOD LABEL
  // =========================================

  const paymentMethodLabels = {
    Cash: "ক্যাশ",
    bKash: "বিকাশ",
    Nagad: "নগদ",
    Rocket: "রকেট",
    "Bank Transfer": "ব্যাংক ট্রান্সফার",
    Card: "কার্ড",
    Other: "অন্যান্য",
  };

  // =========================================
  // LOAD DONATIONS
  // =========================================

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosSecure.get("/donations");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.donations || res.data?.data || [];

      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Failed to load reports:",
        err.response?.data || err.message,
      );

      if (err.response?.status === 401) {
        setError("আপনার লগইন সেশন শেষ হয়ে গেছে। অনুগ্রহ করে আবার লগইন করুন।");
      } else if (err.response?.status === 403) {
        setError(
          "রিপোর্ট দেখার অনুমতি আপনার নেই। শুধুমাত্র অ্যাডমিনরা এই পেজ দেখতে পারবেন।",
        );
      } else {
        setError(
          "রিপোর্টের তথ্য লোড করা যায়নি। অনুগ্রহ করে সার্ভার চালু আছে কিনা নিশ্চিত করুন।",
        );
      }

      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    loadPayments();
  }, []);

  // =========================================
  // AVAILABLE YEARS
  // =========================================

  const availableYears = useMemo(() => {
    const years = payments
      .map((payment) => {
        if (!payment?.createdAt) return null;

        const date = new Date(payment.createdAt);

        if (Number.isNaN(date.getTime())) return null;

        return date.getFullYear();
      })
      .filter((year) => year !== null);

    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);

    return uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()];
  }, [payments]);

  // =========================================
  // KEEP SELECTED YEAR VALID
  // =========================================

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // =========================================
  // FILTER PAYMENTS BY YEAR
  // =========================================

  const yearlyPayments = useMemo(() => {
    return payments.filter((payment) => {
      if (!payment?.createdAt) return false;

      const date = new Date(payment.createdAt);

      if (Number.isNaN(date.getTime())) return false;

      return date.getFullYear() === Number(selectedYear);
    });
  }, [payments, selectedYear]);

  // =========================================
  // MONTH NAMES
  // =========================================

  const monthNames = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  // =========================================
  // MONTHLY REPORT
  // =========================================

  const monthlyReports = useMemo(() => {
    return monthNames.map((month, monthIndex) => {
      const monthPayments = yearlyPayments.filter((payment) => {
        const date = new Date(payment.createdAt);

        return date.getMonth() === monthIndex;
      });

      const paidPayments = monthPayments.filter(
        (payment) => payment.status === "Paid",
      );

      const pendingPayments = monthPayments.filter(
        (payment) => payment.status === "Pending",
      );

      const defaultedPayments = monthPayments.filter(
        (payment) => payment.status === "Defaulted",
      );

      const collected = paidPayments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0,
      );

      return {
        month,
        monthIndex,
        collected,
        paid: paidPayments.length,
        pending: pendingPayments.length,
        defaulted: defaultedPayments.length,
        total: monthPayments.length,
      };
    });
  }, [yearlyPayments]);

  // =========================================
  // YEARLY COLLECTION
  // =========================================

  const yearlyCollection = useMemo(() => {
    return yearlyPayments
      .filter((payment) => payment.status === "Paid")
      .reduce((total, payment) => {
        return total + Number(payment.amount || 0);
      }, 0);
  }, [yearlyPayments]);

  // =========================================
  // UNIQUE MEMBERS / USERS
  // =========================================

  const totalMembers = useMemo(() => {
    const users = yearlyPayments
      .map((payment) => payment.email || payment.phone || payment.name)
      .filter(Boolean);

    return new Set(users).size;
  }, [yearlyPayments]);

  // =========================================
  // PAID USERS
  // =========================================

  const paidCount = useMemo(() => {
    return yearlyPayments.filter((payment) => payment.status === "Paid").length;
  }, [yearlyPayments]);

  // =========================================
  // PENDING USERS
  // =========================================

  const pendingCount = useMemo(() => {
    return yearlyPayments.filter((payment) => payment.status === "Pending")
      .length;
  }, [yearlyPayments]);

  // =========================================
  // DEFAULTED USERS
  // =========================================

  const defaultedCount = useMemo(() => {
    return yearlyPayments.filter((payment) => payment.status === "Defaulted")
      .length;
  }, [yearlyPayments]);

  // =========================================
  // TOTAL PAYMENT RECORDS
  // =========================================

  const totalPaymentRecords = yearlyPayments.length;

  // =========================================
  // COLLECTION RATE
  // =========================================

  const collectionRate = useMemo(() => {
    if (totalPaymentRecords === 0) return 0;

    return Math.round((paidCount / totalPaymentRecords) * 100);
  }, [paidCount, totalPaymentRecords]);

  // =========================================
  // PAYMENT PERFORMANCE %
  // =========================================

  const paidPercentage = useMemo(() => {
    if (!totalPaymentRecords) return 0;

    return Math.round((paidCount / totalPaymentRecords) * 100);
  }, [paidCount, totalPaymentRecords]);

  const pendingPercentage = useMemo(() => {
    if (!totalPaymentRecords) return 0;

    return Math.round((pendingCount / totalPaymentRecords) * 100);
  }, [pendingCount, totalPaymentRecords]);

  const defaultedPercentage = useMemo(() => {
    if (!totalPaymentRecords) return 0;

    return Math.round((defaultedCount / totalPaymentRecords) * 100);
  }, [defaultedCount, totalPaymentRecords]);

  // =========================================
  // BEST COLLECTION MONTH
  // =========================================

  const bestCollectionMonth = useMemo(() => {
    const monthsWithCollection = monthlyReports.filter(
      (month) => month.collected > 0,
    );

    if (monthsWithCollection.length === 0) {
      return null;
    }

    return monthsWithCollection.reduce((best, current) => {
      return current.collected > best.collected ? current : best;
    });
  }, [monthlyReports]);

  // =========================================
  // HIGHEST COLLECTION
  // =========================================

  const highestCollection = bestCollectionMonth?.collected || 0;

  // =========================================
  // DOWNLOAD CSV REPORT
  // =========================================

  const handleDownloadReport = () => {
    if (yearlyPayments.length === 0) {
      alert(
        `${toBanglaDigits(selectedYear)} সালের কোনো পেমেন্ট তথ্য পাওয়া যায়নি।`,
      );
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Category",
      "Amount",
      "Payment Method",
      "Status",
      "Date",
      "Message",
    ];

    const rows = yearlyPayments.map((payment) => [
      payment.name || "",
      payment.email || "",
      payment.phone || "",
      payment.category || payment.donationType || "",
      payment.amount || 0,
      payment.paymentMethod || "",
      payment.status || "",
      payment.createdAt
        ? new Date(payment.createdAt).toLocaleDateString("en-BD")
        : "",
      payment.message || payment.note || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const text = String(value).replace(/"/g, '""');

            return `"${text}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `mosque-payment-report-${selectedYear}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-green-600"></span>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            রিপোর্ট লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
        <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400">
            <FaChartColumn size={24} />
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
            রিপোর্ট লোড করা যায়নি
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-500 dark:text-red-400">
            {error}
          </p>

          <button
            onClick={loadPayments}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <FaRotate />
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="space-y-6 bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-white">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            রিপোর্ট ও অ্যানালিটিক্স
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            মসজিদের পেমেন্ট রিপোর্ট ও বিভিন্ন পরিসংখ্যান দেখুন।
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* YEAR SELECT */}

          <div className="relative">
            <FaCalendarDays className="absolute left-3 top-3 text-gray-400" />

            <select
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full rounded-xl border border-green-200 bg-white py-2 pl-9 pr-4 font-semibold text-green-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-green-900 dark:bg-gray-800 dark:text-green-400 dark:focus:ring-green-900/40 sm:w-auto"
            >
              {availableYears.map((year) => (
                <option
                  key={year}
                  value={year}
                  className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white"
                >
                  {toBanglaDigits(year)}
                </option>
              ))}
            </select>
          </div>

          {/* DOWNLOAD */}

          <button
            onClick={handleDownloadReport}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <FaFileArrowDown />
            রিপোর্ট ডাউনলোড
          </button>

          {/* REFRESH */}

          <button
            onClick={loadPayments}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FaRotate />
            রিফ্রেশ
          </button>
        </div>
      </div>

      {/* =====================================
          YEAR INFO
      ===================================== */}

      <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30">
        <p className="text-sm text-green-700 dark:text-green-300">
          <span className="font-semibold">{toBanglaDigits(selectedYear)}</span>{" "}
          সালের পেমেন্ট রিপোর্ট দেখানো হচ্ছে।
        </p>
      </div>

      {/* =====================================
          REPORT CARDS
      ===================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* YEARLY COLLECTION */}

        <div className="rounded-xl border border-transparent bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                বার্ষিক মোট সংগ্রহ
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                ৳{formatMoney(yearlyCollection)}
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {toBanglaDigits(paidCount)}টি পরিশোধিত পেমেন্ট
              </p>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-950/40 dark:text-green-400">
              <FaMoneyBillTrendUp size={22} />
            </div>
          </div>
        </div>

        {/* TOTAL MEMBERS */}

        <div className="rounded-xl border border-transparent bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                মোট সদস্য
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                {toBanglaDigits(totalMembers)}
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {toBanglaDigits(selectedYear)} সালের ইউনিক ব্যবহারকারী
              </p>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <FaUsers size={22} />
            </div>
          </div>
        </div>

        {/* COLLECTION RATE */}

        <div className="rounded-xl border border-transparent bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                সংগ্রহের হার
              </p>

              <h2 className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
                {toBanglaDigits(collectionRate)}%
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {toBanglaDigits(paidCount)}টির মধ্যে{" "}
                {toBanglaDigits(totalPaymentRecords)}টি পরিশোধিত
              </p>
            </div>

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <FaChartColumn size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          MONTHLY REPORT
      ===================================== */}

      <div className="rounded-xl border border-transparent bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              মাসিক সংগ্রহের রিপোর্ট
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {toBanglaDigits(selectedYear)} সালের মাসভিত্তিক পেমেন্টের
              সারসংক্ষেপ।
            </p>
          </div>

          <span className="w-fit rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {toBanglaDigits(yearlyPayments.length)}টি পেমেন্ট রেকর্ড
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-gray-100 bg-gray-50 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th className="px-4 py-4">মাস</th>

                <th className="px-4 py-4">মোট সংগ্রহ</th>

                <th className="px-4 py-4">পরিশোধিত</th>

                <th className="px-4 py-4">অপেক্ষমাণ</th>

                <th className="px-4 py-4">ডিফল্টেড</th>

                <th className="px-4 py-4">মোট রেকর্ড</th>
              </tr>
            </thead>

            <tbody>
              {monthlyReports.map((report) => (
                <tr
                  key={report.month}
                  className="border-b border-gray-100 text-sm transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60"
                >
                  <td className="px-4 py-4 font-semibold text-gray-800 dark:text-white">
                    {report.month} {toBanglaDigits(selectedYear)}
                  </td>

                  <td className="px-4 py-4 font-semibold text-green-600 dark:text-green-400">
                    ৳{formatMoney(report.collected)}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-950/40 dark:text-green-400">
                      {toBanglaDigits(report.paid)} জন
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400">
                      {toBanglaDigits(report.pending)} জন
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
                      {toBanglaDigits(report.defaulted)} জন
                    </span>
                  </td>

                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                    {toBanglaDigits(report.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================
          QUICK REPORT
      ===================================== */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* PAYMENT PERFORMANCE */}

        <div className="rounded-xl border border-transparent bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-bold text-gray-800 dark:text-white">
            পেমেন্টের পারফরম্যান্স
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {toBanglaDigits(selectedYear)} সালের পেমেন্ট স্ট্যাটাসের বণ্টন।
          </p>

          <div className="mt-5 space-y-5">
            {/* PAID */}

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  পরিশোধিত
                </span>

                <span className="font-semibold text-green-600 dark:text-green-400">
                  {toBanglaDigits(paidPercentage)}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-3 rounded-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${paidPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {toBanglaDigits(paidCount)}টি পেমেন্ট
              </p>
            </div>

            {/* PENDING */}

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  অপেক্ষমাণ
                </span>

                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {toBanglaDigits(pendingPercentage)}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-3 rounded-full bg-yellow-400 transition-all duration-500"
                  style={{
                    width: `${pendingPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {toBanglaDigits(pendingCount)}টি পেমেন্ট
              </p>
            </div>

            {/* DEFAULTED */}

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  ডিফল্টেড
                </span>

                <span className="font-semibold text-red-600 dark:text-red-400">
                  {toBanglaDigits(defaultedPercentage)}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-3 rounded-full bg-red-500 transition-all duration-500"
                  style={{
                    width: `${defaultedPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {toBanglaDigits(defaultedCount)}টি পেমেন্ট
              </p>
            </div>
          </div>
        </div>

        {/* REPORT SUMMARY */}

        <div className="rounded-xl border border-transparent bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-bold text-gray-800 dark:text-white">
            রিপোর্টের সারসংক্ষেপ
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {toBanglaDigits(selectedYear)} সালের সামগ্রিক পেমেন্ট সারসংক্ষেপ।
          </p>

          <div className="mt-5 space-y-4 text-sm">
            {/* BEST MONTH */}

            <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">
                সেরা সংগ্রহের মাস
              </span>

              <span className="font-semibold text-gray-800 dark:text-white">
                {bestCollectionMonth
                  ? `${bestCollectionMonth.month} ${toBanglaDigits(
                      selectedYear,
                    )}`
                  : "-"}
              </span>
            </div>

            {/* HIGHEST */}

            <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">
                সর্বোচ্চ সংগ্রহ
              </span>

              <span className="font-semibold text-green-600 dark:text-green-400">
                ৳{formatMoney(highestCollection)}
              </span>
            </div>

            {/* TOTAL */}

            <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">
                মোট সংগ্রহ
              </span>

              <span className="font-semibold text-green-600 dark:text-green-400">
                ৳{formatMoney(yearlyCollection)}
              </span>
            </div>

            {/* RECORDS */}

            <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">
                মোট পেমেন্ট রেকর্ড
              </span>

              <span className="font-semibold text-gray-800 dark:text-white">
                {toBanglaDigits(totalPaymentRecords)}
              </span>
            </div>

            {/* PAID */}

            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                পরিশোধিত পেমেন্ট
              </span>

              <span className="font-semibold text-green-600 dark:text-green-400">
                {toBanglaDigits(paidCount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {yearlyPayments.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-14 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
            <FaChartColumn size={22} />
          </div>

          <h3 className="mt-4 font-semibold text-gray-700 dark:text-gray-200">
            কোনো পেমেন্ট তথ্য পাওয়া যায়নি
          </h3>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            {toBanglaDigits(selectedYear)} সালের কোনো দানের রেকর্ড নেই।
          </p>
        </div>
      )}

      {/* =====================================
          REPORT FOOTER INFO
      ===================================== */}

      <div className="rounded-xl border border-green-100 bg-green-50 p-5 dark:border-green-900/50 dark:bg-green-950/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
            <FaChartColumn />
          </div>

          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">
              রিপোর্ট ও হিসাবের তথ্য
            </h3>

            <p className="mt-1 text-sm leading-6 text-green-700 dark:text-green-400">
              এই রিপোর্টে শুধুমাত্র নির্বাচিত বছরের দানের তথ্য দেখানো হচ্ছে।
              পরিশোধিত পেমেন্টের পরিমাণকে মোট সংগ্রহ হিসেবে গণনা করা হয়েছে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
