import { useContext, useEffect, useState } from "react";

import {
  FaArrowLeft,
  FaClock,
  FaCircleCheck,
  FaCircleXmark,
  FaMagnifyingGlass,
  FaFilter,
  FaReceipt,
  FaMoneyBillTransfer,
  FaHandHoldingHeart,
  FaSpinner,
} from "react-icons/fa6";

import { useNavigate } from "react-router";

import { AuthContext } from "../../provider/AuthProvider";

import axiosSecure from "../../api/axiosSecure";

const PaymentHistory = () => {
  const navigate = useNavigate();

  const { user, loading: authLoading } = useContext(AuthContext);

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [error, setError] = useState("");

  // ========================================
  // FETCH USER DONATION HISTORY
  // ========================================

  useEffect(() => {
    const getPaymentHistory = async () => {
      if (authLoading) {
        return;
      }

      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        setError("");

        const res = await axiosSecure.get(
          `/donations/${encodeURIComponent(user.email)}`,
        );

        console.log("PAYMENT HISTORY RESPONSE:", res.data);

        const data = res.data;

        const donationList = Array.isArray(data)
          ? data
          : Array.isArray(data?.donations)
            ? data.donations
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setPayments(donationList);
      } catch (error) {
        console.error(
          "Payment History Error:",
          error.response?.data || error.message,
        );

        setError(
          error.response?.data?.message ||
            "Failed to load payment history. Please try again.",
        );

        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    getPaymentHistory();
  }, [user, authLoading]);

  // ========================================
  // LOGIN REQUIRED
  // ========================================

  if (!authLoading && !user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl text-[#087443]">
            <FaHandHoldingHeart />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-800">
            Login Required
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Please login to your account to view your payment history.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-xl bg-[#087443] px-5 py-3 font-semibold text-white transition hover:bg-[#065d36]"
          >
            Login to Continue
          </button>
        </div>
      </section>
    );
  }

  // ========================================
  // FILTER + SEARCH
  // ========================================

  const filteredPayments = payments.filter((payment) => {
    const searchText = search.toLowerCase().trim();

    const category = String(
      payment.category || payment.donationType || "",
    ).toLowerCase();

    const transactionId = String(
      payment.transactionId || payment.receiptNo || "",
    ).toLowerCase();

    const id = String(payment._id || "").toLowerCase();

    const paymentMethod = String(payment.paymentMethod || "").toLowerCase();

    const donationPeriod = String(
      payment.paymentMonth || payment.donationPeriod || "",
    ).toLowerCase();

    const matchesSearch =
      !searchText ||
      category.includes(searchText) ||
      transactionId.includes(searchText) ||
      id.includes(searchText) ||
      paymentMethod.includes(searchText) ||
      donationPeriod.includes(searchText);

    const status = payment.status || "Pending";

    const matchesFilter = filter === "All" || status === filter;

    return matchesSearch && matchesFilter;
  });

  // ========================================
  // STATUS STYLE
  // ========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
      case "Completed":
        return {
          icon: <FaCircleCheck />,
          className: "bg-green-50 text-green-600 border border-green-100",
          label: status === "Completed" ? "Completed" : "Approved",
        };

      case "Rejected":
        return {
          icon: <FaCircleXmark />,
          className: "bg-red-50 text-red-600 border border-red-100",
          label: "Rejected",
        };

      default:
        return {
          icon: <FaClock />,
          className: "bg-yellow-50 text-yellow-600 border border-yellow-100",
          label: "Pending",
        };
    }
  };

  // ========================================
  // TOTAL DONATION
  // ========================================

  const totalDonation = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0,
  );

  // ========================================
  // APPROVED DONATION
  // ========================================

  const approvedDonation = payments
    .filter(
      (payment) =>
        payment.status === "Approved" || payment.status === "Completed",
    )
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  // ========================================
  // PENDING
  // ========================================

  const pendingDonation = payments.filter(
    (payment) => payment.status === "Pending",
  ).length;

  // ========================================
  // LOADING
  // ========================================

  if (authLoading || loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f7faf8]">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-[#087443]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading payment history...
          </p>
        </div>
      </section>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <section className="min-h-screen bg-[#f7faf8] px-3 py-6 pb-28 sm:px-5 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-green-50 hover:text-[#087443]"
            >
              <FaArrowLeft />
            </button>

            <div>
              <p className="text-xs font-medium text-[#087443]">My Donations</p>

              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Payment History
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Track all your mosque donations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/donate")}
            className="rounded-xl bg-[#087443] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#065d36]"
          >
            Make a Donation
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* SUMMARY */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* TOTAL */}

          <div className="rounded-2xl bg-[#087443] p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-100">Total Donations</p>

                <h2 className="mt-2 text-2xl font-bold">
                  ৳{totalDonation.toLocaleString()}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-xl">
                <FaMoneyBillTransfer />
              </div>
            </div>
          </div>

          {/* APPROVED */}

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Approved</p>

                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  ৳{approvedDonation.toLocaleString()}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
                <FaCircleCheck />
              </div>
            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Pending</p>

                <h2 className="mt-2 text-2xl font-bold text-yellow-500">
                  {pendingDonation}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-xl text-yellow-500">
                <FaClock />
              </div>
            </div>
          </div>

          {/* TOTAL TRANSACTIONS */}

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Total Transactions</p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                  {payments.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-xl text-[#087443]">
                <FaReceipt />
              </div>
            </div>
          </div>
        </div>

        {/* HISTORY */}

        <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Donation History
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and track your donation payments.
              </p>
            </div>

            {/* SEARCH + FILTER */}

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-[#087443]">
                <FaMagnifyingGlass className="text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search transaction..."
                  className="w-full text-sm outline-none sm:w-[200px]"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                <FaFilter className="text-gray-400" />

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent py-2.5 text-sm outline-none"
                >
                  <option value="All">All Status</option>

                  <option value="Pending">Pending</option>

                  <option value="Approved">Approved</option>

                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* PAYMENT LIST */}

          <div className="mt-6 space-y-3">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => {
                const status = getStatusStyle(payment.status);

                const donationType =
                  payment.category ||
                  payment.donationType ||
                  "General Donation";

                const donationPeriod =
                  payment.paymentMonth || payment.donationPeriod || "N/A";

                const transactionId =
                  payment.transactionId || payment.receiptNo || payment._id;

                return (
                  <div
                    key={payment._id}
                    className="rounded-2xl border border-gray-100 p-4 transition-all hover:border-green-100 hover:bg-green-50/30"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* LEFT */}

                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg text-[#087443]">
                          <FaHandHoldingHeart />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-800">
                              {donationType}
                            </h3>

                            <span
                              className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${status.className}`}
                            >
                              {status.icon}

                              {status.label}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                            <span>{donationPeriod}</span>

                            <span>{payment.paymentMethod || "N/A"}</span>

                            <span>TXN: {transactionId}</span>
                          </div>
                        </div>
                      </div>

                      {/* AMOUNT */}

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <div>
                          <p className="text-xs text-gray-400">
                            Donation Amount
                          </p>

                          <p className="text-xl font-bold text-[#087443]">
                            ৳{Number(payment.amount || 0).toLocaleString()}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/payment-receipt/${payment._id}`)
                          }
                          className="mt-2 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-2 text-xs font-semibold text-[#087443] transition hover:bg-[#087443] hover:text-white"
                        >
                          <FaReceipt />
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-2xl text-gray-400">
                  <FaReceipt />
                </div>

                <h3 className="mt-4 font-bold text-gray-700">
                  No Payment Found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  {payments.length === 0
                    ? "You haven't made any donations yet."
                    : "We couldn't find any payment matching your search."}
                </p>

                {payments.length === 0 && (
                  <button
                    type="button"
                    onClick={() => navigate("/donate")}
                    className="mt-5 rounded-xl bg-[#087443] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#065d36]"
                  >
                    Make Your First Donation
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER MESSAGE */}

        <div className="mt-6 rounded-3xl bg-[#087443] p-6 text-center text-white shadow-lg">
          <FaHandHoldingHeart className="mx-auto text-3xl text-[#f3d04e]" />

          <h2 className="mt-3 text-lg font-bold">JazakAllah Khair</h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-green-100">
            Thank you for supporting our mosque and community. May Allah accept
            your generous contribution.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PaymentHistory;
