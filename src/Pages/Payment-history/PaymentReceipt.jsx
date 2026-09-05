import { useContext, useEffect, useState } from "react";

import {
  FaArrowLeft,
  FaMosque,
  FaReceipt,
  FaCircleCheck,
  FaClock,
  FaCircleXmark,
  FaPrint,
  FaHandHoldingHeart,
} from "react-icons/fa6";

import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import axiosSecure from "../../api/axiosSecure";

const PaymentReceipt = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user, loading: authLoading } = useContext(AuthContext);

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH SINGLE PAYMENT
  // ========================================

  useEffect(() => {
    const getPayment = async () => {
      if (authLoading) return;

      if (!user?.email) {
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Invalid payment receipt.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // ========================================
        // GET FIREBASE ID TOKEN
        // ========================================

        const token = await user.getIdToken();

        if (!token) {
          setError("Authentication token not found. Please login again.");
          setLoading(false);
          return;
        }

        console.log("Receipt Token Available:", !!token);
        console.log("Receipt ID:", id);

        // ========================================
        // GET SINGLE PAYMENT
        // IMPORTANT:
        // axiosSecure sends Firebase token
        // ========================================

        const res = await axiosSecure.get(
          `/donations/receipt/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Payment Receipt:", res.data);

        setPayment(res.data);
      } catch (err) {
        console.error(
          "Payment Receipt Error:",
          err.response?.data || err.message,
        );

        if (err.response?.status === 401) {
          setError("Authentication failed. Please login again and try again.");
        } else if (err.response?.status === 403) {
          setError("You are not authorized to view this payment receipt.");
        } else if (err.response?.status === 404) {
          setError("This payment receipt could not be found.");
        } else {
          setError(
            err.response?.data?.message || "Failed to load payment receipt.",
          );
        }

        setPayment(null);
      } finally {
        setLoading(false);
      }
    };

    getPayment();
  }, [id, user, authLoading]);

  // ========================================
  // STATUS STYLE
  // ========================================

  const getStatus = (status) => {
    switch (status) {
      case "Paid":
        return {
          icon: <FaCircleCheck />,
          text: "Paid",
          className: "bg-green-50 text-green-600 border-green-200",
        };

      case "Rejected":
        return {
          icon: <FaCircleXmark />,
          text: "Rejected",
          className: "bg-red-50 text-red-600 border-red-200",
        };

      default:
        return {
          icon: <FaClock />,
          text: "Pending",
          className: "bg-yellow-50 text-yellow-600 border-yellow-200",
        };
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ========================================
  // PRINT RECEIPT
  // ========================================

  const handlePrint = () => {
    window.print();
  };

  // ========================================
  // LOADING
  // ========================================

  if (authLoading || loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaReceipt className="mx-auto animate-pulse text-4xl text-[#087443]" />

          <p className="mt-3 text-sm text-gray-500">
            Loading payment receipt...
          </p>
        </div>
      </section>
    );
  }

  // ========================================
  // LOGIN CHECK
  // ========================================

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl text-[#087443]">
            <FaHandHoldingHeart />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-800">
            Login Required
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Please login to your account to view this payment receipt.
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
  // ERROR
  // ========================================

  if (error || !payment) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <FaReceipt className="mx-auto text-4xl text-red-400" />

          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Receipt Not Found
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error || "This payment receipt could not be found."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/payment-history")}
              className="flex-1 rounded-xl bg-[#087443] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#065d36]"
            >
              Back to Payment History
            </button>

            {error?.toLowerCase().includes("authentication") && (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Login Again
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  const status = getStatus(payment.status);

  return (
    <section className="min-h-screen bg-[#f7faf8] px-4 py-6 pb-28 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        {/* HEADER BUTTONS */}

        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-green-50 hover:text-[#087443]"
          >
            <FaArrowLeft />
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#087443] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#065d36]"
          >
            <FaPrint />
            Print Receipt
          </button>
        </div>

        {/* RECEIPT */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg print:rounded-none print:shadow-none">
          {/* RECEIPT HEADER */}

          <div className="bg-[#087443] p-8 text-center text-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
              <FaMosque />
            </div>

            <h1 className="mt-4 text-2xl font-bold">Rahmania Jame Masjid</h1>

            <p className="mt-2 text-sm text-green-100">
              Donation Payment Receipt
            </p>
          </div>

          {/* RECEIPT BODY */}

          <div className="p-6 sm:p-8">
            {/* RECEIPT STATUS */}

            <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-gray-400">RECEIPT NUMBER</p>

                <p className="mt-1 font-bold text-gray-800">
                  #
                  {payment.receiptNo
                    ? payment.receiptNo.toString().padStart(6, "0")
                    : "N/A"}
                </p>
              </div>

              <div
                className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${status.className}`}
              >
                {status.icon}
                {status.text}
              </div>
            </div>

            {/* DONOR INFO */}

            <div className="mt-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <FaHandHoldingHeart className="text-[#087443]" />
                Donor Information
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">Donor Name</p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {payment.name || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">Phone Number</p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {payment.phone || payment.donorPhone || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">Email</p>

                  <p className="mt-1 break-all font-semibold text-gray-800">
                    {payment.email || payment.userEmail || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">Donation Date</p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* DONATION INFO */}

            <div className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <FaReceipt className="text-[#087443]" />
                Donation Details
              </h2>

              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100">
                <div className="flex flex-col gap-1 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-gray-500">
                    Donation Category
                  </span>

                  <span className="font-semibold text-gray-800">
                    {payment.category || "General Donation"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-gray-500">Payment Month</span>

                  <span className="font-semibold text-gray-800">
                    {payment.paymentMonth || payment.donationPeriod || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-gray-500">Payment Method</span>

                  <span className="font-semibold text-gray-800">
                    {payment.paymentMethod || "N/A"}
                  </span>
                </div>

                {payment.paymentMethod !== "Cash" && (
                  <div className="flex flex-col gap-1 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500">
                      Transaction ID
                    </span>

                    <span className="break-all font-semibold text-gray-800">
                      {payment.transactionId || "N/A"}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between bg-green-50 p-5">
                  <span className="font-semibold text-[#087443]">
                    Donation Amount
                  </span>

                  <span className="text-2xl font-bold text-[#087443]">
                    ৳{Number(payment.amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* MESSAGE */}

            {payment.message && (
              <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">Message</p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {payment.message}
                </p>
              </div>
            )}

            {/* FOOTER */}

            <div className="mt-8 border-t border-gray-100 pt-6 text-center">
              <FaHandHoldingHeart className="mx-auto text-2xl text-[#087443]" />

              <h3 className="mt-3 font-bold text-gray-800">JazakAllah Khair</h3>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                May Allah accept your generous contribution and reward you
                abundantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentReceipt;
