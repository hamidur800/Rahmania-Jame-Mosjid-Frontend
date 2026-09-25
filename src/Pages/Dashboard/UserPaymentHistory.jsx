import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import axiosSecure from "../../api/axiosSecure";

const UserPaymentHistory = () => {
  const { email } = useParams();

  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);

        const decodedEmail = decodeURIComponent(email);

        const [userRes, paymentRes] = await Promise.all([
          axiosSecure.get(`/users/${decodedEmail}`),
          axiosSecure.get(
            `/users/${encodeURIComponent(decodedEmail)}/payment-history`,
          ),
        ]);

        setUser(userRes.data);
        setPayments(paymentRes.data);
      } catch (error) {
        console.error("Payment history error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [email]);

  const getStatusIcon = (status) => {
    if (status === "Paid" || status === "Approved" || status === "completed") {
      return <FaCheckCircle className="text-green-600" />;
    }

    if (status === "Pending") {
      return <FaClock className="text-amber-500" />;
    }

    return <FaTimesCircle className="text-red-500" />;
  };

  const getStatusText = (status) => {
    if (status === "Paid" || status === "Approved" || status === "completed")
      return "পরিশোধিত";
    if (status === "Pending") return "অপেক্ষমাণ";
    if (status === "failed" || status === "Defaulted") return "বাতিল";

    return status || "Unknown";
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <FaSpinner className="mx-auto mb-3 animate-spin text-4xl text-[#087443]" />
          <p className="font-medium text-gray-600 dark:text-gray-300">
            পেমেন্ট হিস্টোরি লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6] p-4 dark:bg-gray-950 md:p-6">
      {/* Back */}
      <Link
        to="/dashboard/users"
        className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#075c46] shadow-sm transition hover:bg-[#075c46] hover:text-white dark:bg-gray-900"
      >
        <FaArrowLeft />
        সকল ইউজার
      </Link>

      {/* User Profile */}
      <div className="mb-6 overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-gray-900">
        <div className="h-28 bg-gradient-to-r from-[#075c46] to-[#087443]" />

        <div className="px-5 pb-6 md:px-7">
          <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-[#e8f3ef] shadow-lg dark:border-gray-900">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#087443]">
                  <FaUser className="text-4xl" />
                </div>
              )}
            </div>

            <div className="pb-1">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {user?.name || "নাম নেই"}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                ইউজারের পেমেন্ট হিস্টোরি
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
              <FaEnvelope className="text-[#087443]" />
              <span className="truncate text-sm text-gray-600 dark:text-gray-300">
                {user?.email}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
              <FaPhone className="text-[#087443]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user?.phone || "ফোন নম্বর নেই"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Payment History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            মোট {payments.length} টি পেমেন্ট
          </p>
        </div>

        <div className="rounded-2xl bg-[#087443]/10 p-3 text-[#087443]">
          <FaMoneyBillWave className="text-xl" />
        </div>
      </div>

      {/* Payments */}
      {payments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <FaMoneyBillWave className="mx-auto mb-4 text-5xl text-gray-300" />

          <h3 className="font-bold text-gray-700 dark:text-gray-200">
            কোনো পেমেন্ট পাওয়া যায়নি
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            এই ইউজারের এখনো কোনো payment history নেই।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 grid grid-cols-1 gap-3 border-b border-gray-100 pt-4 sm:grid-cols-2 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
                  <FaCalendarAlt className="text-[#087443]" />

                  <span className="">
                    {/* {payment.createdAt
                      ? new Date(payment.createdAt).toLocaleDateString(
                          "bn-BD",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "তারিখ নেই"} */}
                    {payment.donationPeriod || "তারিখ নেই"}
                  </span>
                </div>

                {payment.transactionId && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaCreditCard className="text-[#087443]" />

                    <span className="truncate">
                      TXN: {payment.transactionId}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-[#087443]/10 p-4 text-[#087443]">
                    <FaMoneyBillWave className="text-xl" />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      ৳{payment.amount}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {payment.paymentMethod || "Payment"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
                  {getStatusIcon(payment.status)}
                  <span>{getStatusText(payment.status)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPaymentHistory;
