import { useContext, useEffect, useState } from "react";
import Logo from "../../assets/logo.jpg";
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
import Loading from "../../Componant/Loading/Loading";

const PaymentReceipt = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user, loading: authLoading } = useContext(AuthContext);

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // একক পেমেন্ট তথ্য সংগ্রহ
  // ========================================

  useEffect(() => {
    const getPayment = async () => {
      if (authLoading) return;

      if (!user?.email) {
        setLoading(false);
        return;
      }

      if (!id) {
        setError("অবৈধ পেমেন্ট রসিদ।");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = await user.getIdToken();

        if (!token) {
          setError(
            "অথেনটিকেশন টোকেন পাওয়া যায়নি। অনুগ্রহ করে আবার লগইন করুন।",
          );
          setLoading(false);
          return;
        }

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
          setError(
            "অথেনটিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার লগইন করে চেষ্টা করুন।",
          );
        } else if (err.response?.status === 403) {
          setError("আপনার এই পেমেন্ট রসিদটি দেখার অনুমতি নেই।");
        } else if (err.response?.status === 404) {
          setError("এই পেমেন্ট রসিদটি পাওয়া যায়নি।");
        } else {
          setError(
            err.response?.data?.message ||
              "পেমেন্ট রসিদ লোড করতে সমস্যা হয়েছে।",
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
  // পেমেন্ট স্ট্যাটাস
  // ========================================

  const getStatus = (status) => {
    switch (status) {
      case "Paid":
      case "Approved":
      case "Completed":
        return {
          icon: <FaCircleCheck />,
          text: "পরিশোধিত",
          className:
            "bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30",
        };

      case "Rejected":
        return {
          icon: <FaCircleXmark />,
          text: "বাতিল",
          className:
            "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30",
        };

      default:
        return {
          icon: <FaClock />,
          text: "অপেক্ষমাণ",
          className:
            "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30",
        };
    }
  };

  // ========================================
  // তারিখ ফরম্যাট
  // ========================================

  const formatDate = (date) => {
    if (!date) return "প্রযোজ্য নয়";

    return new Date(date).toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ========================================
  // রসিদ প্রিন্ট
  // ========================================

  const handlePrint = () => {
    window.print();
  };

  // ========================================
  // লোডিং
  // ========================================

  if (authLoading || loading) {
    return <Loading />;
  }

  // ========================================
  // লগইন চেক
  // ========================================

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#111827]">
        {" "}
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg dark:bg-[#1f2937] dark:shadow-black/30">
          {" "}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl text-[#087443] dark:bg-green-500/10">
            {" "}
            <FaHandHoldingHeart />{" "}
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-800 dark:text-white">
            লগইন প্রয়োজন
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            এই পেমেন্ট রসিদটি দেখতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
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
  // ERROR
  // ========================================

  if (error || !payment) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#111827]">
        {" "}
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg dark:bg-[#1f2937] dark:shadow-black/30">
          {" "}
          <FaReceipt className="mx-auto text-4xl text-red-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
            রসিদ পাওয়া যায়নি
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error || "এই পেমেন্ট রসিদটি পাওয়া যায়নি।"}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/payment-history")}
              className="flex-1 rounded-xl bg-[#087443] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#065d36]"
            >
              পেমেন্ট ইতিহাসে ফিরে যান
            </button>

            {error?.toLowerCase().includes("authentication") && (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-[#111827] dark:text-gray-200 dark:hover:bg-gray-800"
              >
                আবার লগইন করুন
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  const status = getStatus(payment.status);

  return (
    <section className="min-h-screen bg-[#f7faf8] px-4 py-6 pb-28 dark:bg-[#111827] print:bg-white print:p-0">
      {" "}
      <div className="mx-auto max-w-3xl">
        {/* HEADER BUTTONS */}

        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-green-50 hover:text-[#087443] dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-300 dark:hover:bg-green-500/10"
          >
            <FaArrowLeft />
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#087443] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#065d36]"
          >
            <FaPrint />
            রসিদ প্রিন্ট করুন
          </button>
        </div>

        {/* RECEIPT */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-[#1f2937] dark:shadow-black/30 print:rounded-none print:bg-white print:shadow-none">
          {/* RECEIPT HEADER */}

          <div className="bg-[#087443] p-8 text-center text-white">
            <div className="mx-auto flex h-30 w-30 items-center justify-center rounded-2xl bg-white/15 text-3xl">
              <img
                src={Logo}
                alt="Rahmania Mosque Logo"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>

            <h1 className="mt-4 text-2xl font-bold">রাহমানিয়া জামে মসজিদ</h1>

            <p className="mt-2 text-sm text-green-100">অনুদান প্রদানের রসিদ</p>
          </div>

          {/* RECEIPT BODY */}

          <div className="p-6 sm:p-8">
            {/* RECEIPT STATUS */}

            <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-gray-400">রসিদ নম্বর</p>

                <p className="mt-1 font-bold text-gray-800 dark:text-white">
                  #
                  {payment.receiptNo
                    ? payment.receiptNo.toString().padStart(6, "0")
                    : "প্রযোজ্য নয়"}
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
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
                <FaHandHoldingHeart className="text-[#087443]" />
                দাতার তথ্য
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#111827]">
                  <p className="text-xs text-gray-400">দাতার নাম</p>

                  <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                    {payment.donorName || payment.name || "প্রযোজ্য নয়"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#111827]">
                  <p className="text-xs text-gray-400">ফোন নম্বর</p>

                  <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                    {payment.phone || payment.donorPhone || "প্রযোজ্য নয়"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#111827]">
                  <p className="text-xs text-gray-400">ইমেইল</p>

                  <p className="mt-1 break-all font-semibold text-gray-800 dark:text-gray-100">
                    {payment.email || payment.userEmail || "প্রযোজ্য নয়"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#111827]">
                  <p className="text-xs text-gray-400">অনুদানের তারিখ</p>

                  <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* DONATION INFO */}

            <div className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
                <FaReceipt className="text-[#087443]" />
                অনুদানের বিস্তারিত তথ্য
              </h2>

              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col gap-1 border-b border-gray-100 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    অনুদানের ধরন
                  </span>

                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {payment.category || "সাধারণ অনুদান"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-b border-gray-100 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    অনুদানের মাস
                  </span>

                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {payment.paymentMonth ||
                      payment.donationPeriod ||
                      "প্রযোজ্য নয়"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-b border-gray-100 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    পেমেন্ট পদ্ধতি
                  </span>

                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {payment.paymentMethod || "প্রযোজ্য নয়"}
                  </span>
                </div>

                {payment.paymentMethod !== "Cash" && (
                  <div className="flex flex-col gap-1 border-b border-gray-100 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ট্রানজেকশন আইডি
                    </span>

                    <span className="break-all font-semibold text-gray-800 dark:text-gray-100">
                      {payment.transactionId || "প্রযোজ্য নয়"}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between bg-green-50 p-5 dark:bg-green-500/10">
                  <span className="font-semibold text-[#087443] dark:text-green-400">
                    অনুদানের পরিমাণ
                  </span>

                  <span className="text-2xl font-bold text-[#087443] dark:text-green-400">
                    ৳{Number(payment.amount || 0).toLocaleString("bn-BD")}
                  </span>
                </div>
              </div>
            </div>

            {/* MESSAGE */}

            {payment.message && (
              <div className="mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-[#111827]">
                <p className="text-xs text-gray-400">বার্তা</p>

                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {payment.message}
                </p>
              </div>
            )}

            {/* FOOTER */}

            <div className="mt-8 border-t border-gray-100 pt-6 text-center dark:border-gray-700">
              <FaHandHoldingHeart className="mx-auto text-2xl text-[#087443]" />

              <h3 className="mt-3 font-bold text-gray-800 dark:text-white">
                জাযাকাল্লাহু খাইরান
              </h3>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                আল্লাহ তায়ালা আপনার উদার অনুদান কবুল করুন এবং আপনাকে উত্তম
                প্রতিদান দান করুন। আমিন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentReceipt;
