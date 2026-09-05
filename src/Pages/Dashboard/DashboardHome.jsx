import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import axiosSecure from "../../api/axiosSecure";

import {
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaChartLine,
  FaArrowTrendUp,
  FaRotate,
  FaCircleCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";

const DashboardHome = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // CURRENT DATE
  // ==========================================
  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthName = now.toLocaleDateString("bn-BD", {
    month: "long",
  });

  const currentMonthYear = `${currentMonthName} ${new Intl.NumberFormat(
    "bn-BD",
  ).format(currentYear)}`;

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [paymentsRes, usersRes] = await Promise.all([
        axiosSecure.get("/donations"),
        axiosSecure.get("/users"),
      ]);

      setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
    } catch (err) {
      console.error(
        "Dashboard data loading error:",
        err.response?.data || err.message,
      );

      if (err.response?.status === 401) {
        setError("অনুমতি নেই! অনুগ্রহ করে আবার লগইন করুন।");
      } else {
        setError("ড্যাশবোর্ডের তথ্য লোড করা যায়নি।");
      }

      setPayments([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ==========================================
  // HELPERS
  // ==========================================
  const getStatus = (payment) => {
    return payment?.status || "Pending";
  };

  const getAmount = (payment) => {
    return Number(payment?.amount || 0);
  };

  const getPaymentDate = (payment) => {
    if (!payment?.createdAt) return null;

    const date = new Date(payment.createdAt);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("bn-BD").format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("bn-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // STATUS LABEL
  // ==========================================
  const getStatusLabel = (status) => {
    if (status === "Paid") return "পরিশোধিত";
    if (status === "Pending") return "অপেক্ষমাণ";
    if (status === "Defaulted") return "বকেয়া";
    return status;
  };

  // ==========================================
  // CATEGORY LABEL
  // ==========================================
  const getCategoryLabel = (category) => {
    const categoryMap = {
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

    return categoryMap[category] || category || "-";
  };

  // ==========================================
  // CURRENT MONTH PAYMENTS
  // ==========================================
  const currentMonthPayments = useMemo(() => {
    return payments.filter((payment) => {
      const date = getPaymentDate(payment);

      if (!date) return false;

      return (
        date.getFullYear() === currentYear && date.getMonth() === currentMonth
      );
    });
  }, [payments, currentYear, currentMonth]);

  // ==========================================
  // STATUS FILTERS
  // ==========================================
  const currentMonthPaidPayments = useMemo(() => {
    return currentMonthPayments.filter(
      (payment) => getStatus(payment) === "Paid",
    );
  }, [currentMonthPayments]);

  const currentMonthPendingPayments = useMemo(() => {
    return currentMonthPayments.filter(
      (payment) => getStatus(payment) === "Pending",
    );
  }, [currentMonthPayments]);

  const currentMonthDefaultedPayments = useMemo(() => {
    return currentMonthPayments.filter(
      (payment) => getStatus(payment) === "Defaulted",
    );
  }, [currentMonthPayments]);

  // ==========================================
  // AMOUNTS
  // ==========================================
  const totalCollected = useMemo(() => {
    return currentMonthPaidPayments.reduce(
      (total, payment) => total + getAmount(payment),
      0,
    );
  }, [currentMonthPaidPayments]);

  const pendingAmount = useMemo(() => {
    return currentMonthPendingPayments.reduce(
      (total, payment) => total + getAmount(payment),
      0,
    );
  }, [currentMonthPendingPayments]);

  const defaultedAmount = useMemo(() => {
    return currentMonthDefaultedPayments.reduce(
      (total, payment) => total + getAmount(payment),
      0,
    );
  }, [currentMonthDefaultedPayments]);

  // ==========================================
  // USERS
  // ==========================================
  const totalUsers = users.length;

  const paidUsersThisMonth = useMemo(() => {
    const emails = new Set();

    currentMonthPaidPayments.forEach((payment) => {
      if (payment?.email) {
        emails.add(payment.email);
      } else if (payment?.phone) {
        emails.add(payment.phone);
      } else if (payment?.name) {
        emails.add(payment.name);
      }
    });

    return emails.size;
  }, [currentMonthPaidPayments]);

  const pendingUsers = currentMonthPendingPayments.length;
  const defaultedUsers = currentMonthDefaultedPayments.length;

  // ==========================================
  // MONTHLY DATA
  // ==========================================
  const monthlyData = useMemo(() => {
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthName = date.toLocaleDateString("bn-BD", {
        month: "short",
      });

      const monthPayments = payments.filter((payment) => {
        const paymentDate = getPaymentDate(payment);

        if (!paymentDate) return false;

        return (
          paymentDate.getFullYear() === year && paymentDate.getMonth() === month
        );
      });

      const collected = monthPayments
        .filter((payment) => getStatus(payment) === "Paid")
        .reduce((total, payment) => total + getAmount(payment), 0);

      const pending = monthPayments
        .filter((payment) => getStatus(payment) === "Pending")
        .reduce((total, payment) => total + getAmount(payment), 0);

      const defaulted = monthPayments
        .filter((payment) => getStatus(payment) === "Defaulted")
        .reduce((total, payment) => total + getAmount(payment), 0);

      months.push({
        month: monthName,
        year,
        collected,
        pending,
        defaulted,
      });
    }

    return months;
  }, [payments, currentYear, currentMonth]);

  // ==========================================
  // MAX CHART VALUE
  // ==========================================
  const maxChartValue = useMemo(() => {
    const values = monthlyData.flatMap((item) => [
      item.collected,
      item.pending,
      item.defaulted,
    ]);

    const max = Math.max(...values, 0);

    return max || 1;
  }, [monthlyData]);

  // ==========================================
  // RECENT PAYMENTS
  // ==========================================
  const recentPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => {
        const dateA = getPaymentDate(a)?.getTime() || 0;
        const dateB = getPaymentDate(b)?.getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [payments]);

  // ==========================================
  // TOP PAYERS
  // ==========================================
  const topPayers = useMemo(() => {
    const yearlyPayments = payments.filter((payment) => {
      const date = getPaymentDate(payment);

      if (!date) return false;

      return (
        date.getFullYear() === currentYear && getStatus(payment) === "Paid"
      );
    });

    const payerMap = {};

    yearlyPayments.forEach((payment) => {
      const key =
        payment?.email || payment?.phone || payment?.name || "Unknown User";

      if (!payerMap[key]) {
        payerMap[key] = {
          name: payment?.name || "Unknown User",
          email: payment?.email || "",
          phone: payment?.phone || "",
          amount: 0,
        };
      }

      payerMap[key].amount += getAmount(payment);
    });

    return Object.values(payerMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [payments, currentYear]);

  // ==========================================
  // COLLECTION RATE
  // ==========================================
  const collectionRate = useMemo(() => {
    const total = totalCollected + pendingAmount + defaultedAmount;

    if (!total) return 0;

    return Math.round((totalCollected / total) * 100);
  }, [totalCollected, pendingAmount, defaultedAmount]);

  // ==========================================
  // YEARLY COLLECTION
  // ==========================================
  const yearlyCollection = useMemo(() => {
    return payments
      .filter((payment) => {
        const date = getPaymentDate(payment);

        return (
          date &&
          date.getFullYear() === currentYear &&
          getStatus(payment) === "Paid"
        );
      })
      .reduce((total, payment) => total + getAmount(payment), 0);
  }, [payments, currentYear]);

  // ==========================================
  // BEST MONTH
  // ==========================================
  const bestCollectionMonth = useMemo(() => {
    if (!monthlyData.length) {
      return {
        month: "-",
        collected: 0,
      };
    }

    return monthlyData.reduce((best, current) => {
      return current.collected > best.collected ? current : best;
    });
  }, [monthlyData]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-green-600" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            ড্যাশবোর্ড লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/40">
            <FaTriangleExclamation />
          </div>

          <p className="mt-4 text-sm text-red-500">{error}</p>

          <button
            onClick={loadDashboardData}
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
    <div className="w-full space-y-4 overflow-hidden sm:space-y-5 lg:space-y-6">
      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm transition-colors dark:bg-gray-900 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">
            আসসালামু আলাইকুম, অ্যাডমিন 👋
          </h1>

          <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
            আজ আপনার মসজিদের কার্যক্রমের সর্বশেষ তথ্য দেখুন।
          </p>
        </div>

        <div className="flex w-full items-center gap-2 lg:w-auto">
          <div className="flex flex-1 items-center justify-center rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:px-4 sm:text-sm lg:flex-none">
            {currentMonthYear}
          </div>

          <button
            onClick={loadDashboardData}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-4"
          >
            <FaRotate />

            <span className="hidden sm:inline">রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          STATS CARDS
      ========================================== */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {/* TOTAL USERS */}
        <div className="rounded-xl bg-white p-4 shadow-sm transition-colors dark:bg-gray-900 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                মোট ব্যবহারকারী
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">
                {formatMoney(totalUsers)}
              </h2>

              <p className="mt-2 text-[11px] leading-4 text-green-600 dark:text-green-400 sm:text-xs">
                <FaArrowTrendUp className="mr-1 inline" />
                নিবন্ধিত মসজিদ ব্যবহারকারী
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-green-100 p-2.5 text-green-600 dark:bg-green-950/50 dark:text-green-400 sm:p-3">
              <FaUsers size={20} />
            </div>
          </div>
        </div>

        {/* TOTAL COLLECTED */}
        <div className="rounded-xl bg-white p-4 shadow-sm transition-colors dark:bg-gray-900 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                মোট সংগ্রহ
              </p>

              <h2 className="mt-2 text-xl font-bold text-green-600 sm:text-2xl">
                ৳{formatMoney(totalCollected)}
              </h2>

              <p className="mt-2 text-[11px] leading-4 text-green-600 dark:text-green-400 sm:text-xs">
                <FaArrowTrendUp className="mr-1 inline" />
                এই মাসে {formatMoney(paidUsersThisMonth)} জন পরিশোধ করেছেন
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-green-100 p-2.5 text-green-600 dark:bg-green-950/50 dark:text-green-400 sm:p-3">
              <FaMoneyBillWave size={20} />
            </div>
          </div>
        </div>

        {/* PENDING */}
        <div className="rounded-xl bg-white p-4 shadow-sm transition-colors dark:bg-gray-900 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                অপেক্ষমাণ পরিমাণ
              </p>

              <h2 className="mt-2 text-xl font-bold text-yellow-500 sm:text-2xl">
                ৳{formatMoney(pendingAmount)}
              </h2>

              <p className="mt-2 text-[11px] leading-4 text-yellow-600 dark:text-yellow-400 sm:text-xs">
                {formatMoney(pendingUsers)}টি পেমেন্ট থেকে
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-yellow-100 p-2.5 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400 sm:p-3">
              <FaClock size={20} />
            </div>
          </div>
        </div>

        {/* DEFAULTED */}
        <div className="rounded-xl bg-white p-4 shadow-sm transition-colors dark:bg-gray-900 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                বকেয়া পরিমাণ
              </p>

              <h2 className="mt-2 text-xl font-bold text-red-500 sm:text-2xl">
                ৳{formatMoney(defaultedAmount)}
              </h2>

              <p className="mt-2 text-[11px] leading-4 text-red-500 sm:text-xs">
                {formatMoney(defaultedUsers)}টি পেমেন্ট থেকে
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-red-100 p-2.5 text-red-500 dark:bg-red-950/40 dark:text-red-400 sm:p-3">
              <FaChartLine size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          MIDDLE SECTION
      ========================================== */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-3">
        {/* COLLECTION OVERVIEW */}
        <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm transition-colors dark:bg-gray-900 sm:p-5 lg:p-6 xl:col-span-2">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white">
                সংগ্রহের সারসংক্ষেপ
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                গত ৬ মাসের সংগ্রহের অগ্রগতি
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] sm:text-xs">
              <span className="text-green-600 dark:text-green-400">
                ● সংগ্রহ
              </span>

              <span className="text-yellow-500">● অপেক্ষমাণ</span>

              <span className="text-red-500">● বকেয়া</span>
            </div>
          </div>

          {/* CHART */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex h-64 min-w-[520px] items-end gap-3 border-b border-l border-gray-200 px-3 pt-5 dark:border-gray-700 sm:h-72 sm:gap-4 sm:px-4">
              {monthlyData.map((item, index) => {
                const collectedHeight = (item.collected / maxChartValue) * 100;

                const pendingHeight = (item.pending / maxChartValue) * 100;

                const defaultedHeight = (item.defaulted / maxChartValue) * 100;

                return (
                  <div
                    key={`${item.month}-${item.year}-${index}`}
                    className="flex h-full min-w-0 flex-1 flex-col justify-end"
                  >
                    <div className="flex h-full items-end justify-center gap-0.5 sm:gap-1">
                      {/* COLLECTED */}
                      <div
                        title={`সংগ্রহ: ৳${formatMoney(item.collected)}`}
                        style={{
                          height: `${Math.max(
                            collectedHeight,
                            item.collected > 0 ? 3 : 0,
                          )}%`,
                        }}
                        className="w-3 rounded-t-md bg-green-500 transition-all hover:opacity-80 sm:w-5"
                      />

                      {/* PENDING */}
                      <div
                        title={`অপেক্ষমাণ: ৳${formatMoney(item.pending)}`}
                        style={{
                          height: `${Math.max(
                            pendingHeight,
                            item.pending > 0 ? 3 : 0,
                          )}%`,
                        }}
                        className="w-3 rounded-t-md bg-yellow-400 transition-all hover:opacity-80 sm:w-5"
                      />

                      {/* DEFAULTED */}
                      <div
                        title={`বকেয়া: ৳${formatMoney(item.defaulted)}`}
                        style={{
                          height: `${Math.max(
                            defaultedHeight,
                            item.defaulted > 0 ? 3 : 0,
                          )}%`,
                        }}
                        className="w-3 rounded-t-md bg-red-500 transition-all hover:opacity-80 sm:w-5"
                      />
                    </div>

                    <span className="mt-2 text-center text-[10px] text-gray-500 dark:text-gray-400 sm:mt-3 sm:text-xs">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHART TOTALS */}
          <div className="mt-4 grid grid-cols-1 gap-2 min-[400px]:grid-cols-3 sm:gap-3">
            <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-950/30">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
                সংগ্রহ
              </p>

              <p className="mt-1 text-sm font-bold text-green-600 dark:text-green-400 sm:text-base">
                ৳
                {formatMoney(
                  monthlyData.reduce((sum, item) => sum + item.collected, 0),
                )}
              </p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 text-center dark:bg-yellow-950/30">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
                অপেক্ষমাণ
              </p>

              <p className="mt-1 text-sm font-bold text-yellow-600 dark:text-yellow-400 sm:text-base">
                ৳
                {formatMoney(
                  monthlyData.reduce((sum, item) => sum + item.pending, 0),
                )}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-950/30">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
                বকেয়া
              </p>

              <p className="mt-1 text-sm font-bold text-red-600 dark:text-red-400 sm:text-base">
                ৳
                {formatMoney(
                  monthlyData.reduce((sum, item) => sum + item.defaulted, 0),
                )}
              </p>
            </div>
          </div>
        </div>

        {/* THIS MONTH SUMMARY */}
        <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm transition-colors dark:bg-gray-900 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="font-bold text-gray-800 dark:text-white">
                এই মাসের সারসংক্ষেপ
              </h2>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {currentMonthYear}
              </p>
            </div>

            <div className="shrink-0 rounded-lg bg-green-100 p-2 text-green-600 dark:bg-green-950/40 dark:text-green-400">
              <FaChartLine />
            </div>
          </div>

          <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800 sm:pb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                মোট সংগ্রহ
              </span>

              <span className="shrink-0 text-sm font-semibold text-green-600 dark:text-green-400">
                ৳{formatMoney(totalCollected)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800 sm:pb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                মোট অপেক্ষমাণ
              </span>

              <span className="shrink-0 text-sm font-semibold text-yellow-500">
                ৳{formatMoney(pendingAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800 sm:pb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                মোট বকেয়া
              </span>

              <span className="shrink-0 text-sm font-semibold text-red-500">
                ৳{formatMoney(defaultedAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800 sm:pb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                মোট ব্যবহারকারী
              </span>

              <span className="shrink-0 text-sm font-semibold text-gray-800 dark:text-white">
                {formatMoney(totalUsers)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                সংগ্রহের হার
              </span>

              <span className="shrink-0 text-sm font-semibold text-green-600 dark:text-green-400">
                {formatMoney(collectionRate)}%
              </span>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mt-5 sm:mt-6">
            <div className="mb-2 flex justify-between text-[11px] sm:text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                সংগ্রহের অগ্রগতি
              </span>

              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatMoney(collectionRate)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 sm:h-2.5">
              <div
                style={{
                  width: `${collectionRate}%`,
                }}
                className="h-full rounded-full bg-green-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          BOTTOM SECTION
      ========================================== */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-3">
        {/* RECENT PAYMENTS */}
        <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm transition-colors dark:bg-gray-900 sm:p-5 lg:p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <div className="min-w-0">
              <h2 className="font-bold text-gray-800 dark:text-white">
                সাম্প্রতিক পেমেন্ট
              </h2>

              <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500 sm:text-xs">
                সর্বশেষ দান ও পেমেন্টের তথ্য
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard/payments")}
              className="shrink-0 text-xs font-medium text-green-600 hover:underline dark:text-green-400 sm:text-sm"
            >
              সব দেখুন
            </button>
          </div>

          {recentPayments.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                <FaMoneyBillWave />
              </div>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                কোনো পেমেন্টের তথ্য পাওয়া যায়নি।
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-3 py-3 sm:px-4">ব্যবহারকারী</th>

                    <th className="px-3 py-3 sm:px-4">বিভাগ</th>

                    <th className="px-3 py-3 sm:px-4">পরিমাণ</th>

                    <th className="px-3 py-3 sm:px-4">অবস্থা</th>

                    <th className="px-3 py-3 sm:px-4">তারিখ</th>
                  </tr>
                </thead>

                <tbody>
                  {recentPayments.map((payment, index) => (
                    <tr
                      key={payment?._id || index}
                      className="border-b border-gray-100 last:border-none hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60"
                    >
                      {/* USER */}
                      <td className="max-w-[220px] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-600 dark:bg-green-950/50 dark:text-green-400">
                            {payment?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-800 dark:text-white">
                              {payment?.name || "অজানা ব্যবহারকারী"}
                            </p>

                            <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                              {payment?.email || "ইমেইল নেই"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-3 py-3 sm:px-4 sm:py-4">
                        <span className="whitespace-nowrap rounded-lg bg-blue-50 px-2.5 py-1 text-xs text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                          {getCategoryLabel(payment?.category)}
                        </span>
                      </td>

                      {/* AMOUNT */}
                      <td className="whitespace-nowrap px-3 py-3 font-semibold text-gray-800 dark:text-white sm:px-4 sm:py-4">
                        ৳{formatMoney(getAmount(payment))}
                      </td>

                      {/* STATUS */}
                      <td className="px-3 py-3 sm:px-4 sm:py-4">
                        <span
                          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                            getStatus(payment) === "Paid"
                              ? "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                              : getStatus(payment) === "Pending"
                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400"
                                : "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          }`}
                        >
                          {getStatus(payment) === "Paid" && <FaCircleCheck />}

                          {getStatus(payment) === "Pending" && <FaClock />}

                          {getStatus(payment) === "Defaulted" && (
                            <FaTriangleExclamation />
                          )}

                          {getStatusLabel(getStatus(payment))}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="whitespace-nowrap px-3 py-3 text-gray-500 dark:text-gray-400 sm:px-4 sm:py-4">
                        {formatDate(payment?.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TOP PAYERS */}
        <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm transition-colors dark:bg-gray-900 sm:p-5 lg:p-6">
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white">
              এই বছরের শীর্ষ দাতাগণ
            </h2>

            <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500 sm:text-xs">
              {formatMoney(currentYear)} সালের সর্বোচ্চ দানের পরিমাণ
            </p>
          </div>

          {topPayers.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                <FaUsers />
              </div>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                কোনো পরিশোধকারী ব্যবহারকারী পাওয়া যায়নি।
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4 sm:space-y-5">
              {topPayers.map((payer, index) => (
                <div
                  key={payer.email || payer.phone || payer.name || index}
                  className="flex items-center justify-between gap-3"
                >
                  {/* LEFT */}
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        index === 0
                          ? "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {formatMoney(index + 1)}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800 dark:text-white">
                        {payer.name}
                      </p>

                      {payer.email && (
                        <p className="max-w-[150px] truncate text-[10px] text-gray-400 dark:text-gray-500 sm:max-w-[180px] sm:text-xs">
                          {payer.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AMOUNT */}
                  <span className="shrink-0 text-xs font-semibold text-green-600 dark:text-green-400 sm:text-sm">
                    ৳{formatMoney(payer.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          YEARLY SUMMARY
      ========================================== */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {/* YEARLY COLLECTION */}
        <div className="rounded-xl border border-green-100 bg-green-50 p-4 transition-colors dark:border-green-900/40 dark:bg-green-950/20 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <FaMoneyBillWave />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                {formatMoney(currentYear)} সালের মোট সংগ্রহ
              </p>

              <h3 className="mt-1 text-lg font-bold text-green-600 dark:text-green-400 sm:text-xl">
                ৳{formatMoney(yearlyCollection)}
              </h3>
            </div>
          </div>
        </div>

        {/* BEST MONTH */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 transition-colors dark:border-blue-900/40 dark:bg-blue-950/20 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <FaArrowTrendUp />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                সাম্প্রতিক সেরা মাস
              </p>

              <h3 className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400 sm:text-xl">
                {bestCollectionMonth.month}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                ৳{formatMoney(bestCollectionMonth.collected)} সংগ্রহ
              </p>
            </div>
          </div>
        </div>

        {/* PAID USERS */}
        <div className="rounded-xl border border-purple-100 bg-purple-50 p-4 transition-colors dark:border-purple-900/40 dark:bg-purple-950/20 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <FaUsers />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                এই মাসে পরিশোধ করেছেন
              </p>

              <h3 className="mt-1 text-lg font-bold text-purple-600 dark:text-purple-400 sm:text-xl">
                {formatMoney(paidUsersThisMonth)} জন
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentMonthYear}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
