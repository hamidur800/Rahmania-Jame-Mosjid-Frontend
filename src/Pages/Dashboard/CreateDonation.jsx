import { useEffect, useMemo, useState } from "react";

import {
  FaUser,
  FaUsers,
  FaMoneyBillWave,
  FaMosque,
  FaHandHoldingHeart,
  FaCreditCard,
  FaCalendarDays,
  FaNoteSticky,
  FaReceipt,
  FaWhatsapp,
  FaPrint,
  FaArrowRight,
  FaSpinner,
  FaCircleInfo,
  FaXmark,
} from "react-icons/fa6";

import { FaCheckCircle, FaSearch } from "react-icons/fa";

import Swal from "sweetalert2";

import axiosSecure from "../../api/axiosSecure";

const CreateDonation = () => {
  const currentYear = new Date().getFullYear();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [showUsers, setShowUsers] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    donationType: "Mosque Fund",
    paymentMethod: "Cash",
    donationMonth: String(new Date().getMonth() + 1),
    donationYear: String(currentYear),
    note: "",
  });

  const [receipt, setReceipt] = useState(null);
  const [saved, setSaved] = useState(false);

  // ==========================================
  // LOAD USERS
  // ==========================================
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);

        const res = await axiosSecure.get("/users");

        console.log("USERS API RESPONSE:", res.data);

        const data = res.data;

        const userList = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
            ? data.users
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setUsers(userList);

        console.log("USERS LOADED:", userList);
      } catch (error) {
        console.error(
          "Failed to load users:",
          error.response?.data || error.message,
        );

        if (error.response?.status === 401) {
          Swal.fire({
            icon: "error",
            title: "সেশন শেষ হয়েছে",
            text: "অনুগ্রহ করে আবার লগইন করুন।",
            confirmButtonColor: "#15803d",
          });
        } else if (error.response?.status === 403) {
          Swal.fire({
            icon: "error",
            title: "অনুমতি নেই",
            text: "শুধুমাত্র অ্যাডমিন ব্যবহারকারীদের তথ্য দেখতে পারবেন।",
            confirmButtonColor: "#15803d",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ব্যর্থ হয়েছে",
            text: "ব্যবহারকারীদের তথ্য লোড করা যায়নি।",
            confirmButtonColor: "#15803d",
          });
        }
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  // ==========================================
  // SEARCH USERS
  // ==========================================
  const filteredUsers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return users.slice(0, 8);
    }

    return users
      .filter((user) => {
        const name = String(user?.name || "").toLowerCase();
        const email = String(user?.email || "").toLowerCase();
        const phone = String(user?.phone || "").toLowerCase();

        return (
          name.includes(searchText) ||
          email.includes(searchText) ||
          phone.includes(searchText)
        );
      })
      .slice(0, 8);
  }, [users, search]);

  // ==========================================
  // FORM CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  // ==========================================
  // SELECT USER
  // ==========================================
  const handleSelectUser = (user) => {
    console.log("SELECTED USER:", user);

    setSelectedUser(user);
    setSearch(user?.name || user?.email || "");
    setShowUsers(false);
    setSaved(false);
    setReceipt(null);
  };

  // ==========================================
  // CLEAR USER
  // ==========================================
  const clearSelectedUser = () => {
    setSelectedUser(null);
    setSearch("");
    setShowUsers(true);
    setReceipt(null);
    setSaved(false);
  };

  // ==========================================
  // GENERATE RECEIPT NUMBER
  // ==========================================
  const generateReceiptNumber = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const random = Math.floor(1000 + Math.random() * 9000);

    return `RJM-${year}${month}${day}-${random}`;
  };

  // ==========================================
  // DONATION PERIOD
  // ==========================================
  const getDonationPeriod = (month, year) => {
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
      "bn-BD",
      {
        month: "long",
        year: "numeric",
      },
    );
  };

  // ==========================================
  // DONATION TYPE LABEL
  // ==========================================
  const getDonationTypeLabel = (type) => {
    const labels = {
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

    return labels[type] || type;
  };

  // ==========================================
  // PAYMENT METHOD LABEL
  // ==========================================
  const getPaymentMethodLabel = (method) => {
    const labels = {
      Cash: "ক্যাশ",
      bKash: "বিকাশ",
      Nagad: "নগদ",
      Rocket: "রকেট",
      "Bank Transfer": "ব্যাংক ট্রান্সফার",
      Card: "কার্ড",
      Other: "অন্যান্য",
    };

    return labels[method] || method;
  };

  // ==========================================
  // CREATE RECEIPT
  // ==========================================
  const handleCreateReceipt = (e) => {
    e.preventDefault();

    if (!selectedUser) {
      Swal.fire({
        icon: "warning",
        title: "দাতা নির্বাচন করুন",
        text: "অনুগ্রহ করে প্রথমে একজন দাতা নির্বাচন করুন।",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    if (!selectedUser.email) {
      Swal.fire({
        icon: "warning",
        title: "ব্যবহারকারীর ইমেইল নেই",
        text: "নির্বাচিত ব্যবহারকারীর কোনো ইমেইল ঠিকানা নেই।",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "অবৈধ পরিমাণ",
        text: "অনুগ্রহ করে সঠিক দানের পরিমাণ লিখুন।",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    if (!formData.donationMonth || !formData.donationYear) {
      Swal.fire({
        icon: "warning",
        title: "দানের মাস প্রয়োজন",
        text: "অনুগ্রহ করে দানের মাস ও বছর নির্বাচন করুন।",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    const receiptNumber = generateReceiptNumber();

    const donationPeriod = getDonationPeriod(
      formData.donationMonth,
      formData.donationYear,
    );

    const donationDate = `${formData.donationYear}-${String(
      formData.donationMonth,
    ).padStart(2, "0")}-01`;

    const receiptData = {
      receiptNo: receiptNumber,

      userId: selectedUser?._id || selectedUser?.id || "",

      name: selectedUser?.name || "Unknown User",
      email: selectedUser?.email || "",
      userEmail: selectedUser?.email || "",

      donorName: selectedUser?.name || "Unknown User",
      donorEmail: selectedUser?.email || "",
      donorPhone: selectedUser?.phone || "",

      amount: Number(formData.amount),

      donationType: formData.donationType,
      paymentMethod: formData.paymentMethod,

      donationMonth: formData.donationMonth,
      donationYear: formData.donationYear,

      donationPeriod,
      donationDate,

      note: formData.note,
    };

    console.log("RECEIPT DATA:", receiptData);

    setReceipt(receiptData);
    setSaved(false);

    setTimeout(() => {
      document.getElementById("receipt-preview")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ==========================================
  // SAVE DONATION
  // ==========================================
  const handleSaveReceipt = async () => {
    if (!receipt || !selectedUser) {
      return;
    }

    if (!selectedUser.email) {
      Swal.fire({
        icon: "error",
        title: "ব্যবহারকারীর ইমেইল নেই",
        text: "নির্বাচিত ব্যবহারকারীর কোনো ইমেইল ঠিকানা নেই।",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    try {
      setSaving(true);

      const donationData = {
        receiptNo: receipt.receiptNo,

        userId: selectedUser?._id || selectedUser?.id || "",

        name: selectedUser?.name || receipt.donorName || "Unknown User",

        email: selectedUser?.email || receipt.donorEmail || "",

        userEmail: selectedUser?.email || receipt.donorEmail || "",

        donorName: selectedUser?.name || receipt.donorName || "Unknown User",

        donorEmail: selectedUser?.email || receipt.donorEmail || "",

        donorPhone: selectedUser?.phone || receipt.donorPhone || "",

        amount: Number(receipt.amount),

        donationType: receipt.donationType,

        paymentMethod: receipt.paymentMethod,

        donationMonth: receipt.donationMonth,

        donationYear: receipt.donationYear,

        donationPeriod: receipt.donationPeriod,

        donationDate: receipt.donationDate,

        note: receipt.note || "",

        status: "Paid",

        createdAt: new Date().toISOString(),
      };

      console.log("SAVING DONATION:", donationData);

      const res = await axiosSecure.post("/donations", donationData);

      console.log("DONATION SAVED:", res.data);

      setSaved(true);

      await Swal.fire({
        icon: "success",
        title: "রসিদ সংরক্ষণ হয়েছে!",
        text: `রসিদ ${receipt.receiptNo} সফলভাবে সংরক্ষণ করা হয়েছে।`,
        confirmButtonColor: "#15803d",
      });
    } catch (error) {
      console.error(
        "Save donation error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "সেশন শেষ হয়েছে",
          text: "অনুগ্রহ করে আবার লগইন করুন।",
          confirmButtonColor: "#15803d",
        });
      } else if (error.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "অনুমতি নেই",
          text:
            error.response?.data?.message ||
            "এই দান তৈরি করার অনুমতি আপনার নেই।",
          confirmButtonColor: "#15803d",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "সংরক্ষণ ব্যর্থ",
          text:
            error.response?.data?.message ||
            "দান সংরক্ষণ করার সময় একটি সমস্যা হয়েছে।",
          confirmButtonColor: "#15803d",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // WHATSAPP
  // ==========================================
  const handleWhatsApp = () => {
    if (!receipt) return;

    let phone = String(receipt.donorPhone || "").replace(/\D/g, "");

    if (!phone) {
      Swal.fire({
        icon: "warning",
        title: "ফোন নম্বর নেই",
        text: "এই ব্যবহারকারীর কোনো ফোন নম্বর নেই।",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    // Bangladesh number handling
    if (phone.startsWith("01")) {
      phone = `880${phone.substring(1)}`;
    } else if (phone.startsWith("1") && phone.length === 10) {
      phone = `880${phone}`;
    }

    const message = `আসসালামু আলাইকুম,

রাহমানিয়া জামে মসজিদ থেকে আপনার দানের রসিদ:

━━━━━━━━━━━━━━━━━━

🧾 রসিদ নম্বর: ${receipt.receiptNo}

👤 দাতার নাম: ${receipt.donorName}

📧 ইমেইল: ${receipt.donorEmail || "নেই"}

📞 ফোন: ${receipt.donorPhone || "নেই"}

🕌 দানের ধরন: ${getDonationTypeLabel(receipt.donationType)}

💳 পেমেন্ট পদ্ধতি: ${getPaymentMethodLabel(receipt.paymentMethod)}

💰 দানের পরিমাণ: ৳${receipt.amount.toLocaleString("bn-BD")}

📅 দানের মাস: ${receipt.donationPeriod}

${receipt.note ? `📝 নোট: ${receipt.note}` : ""}

━━━━━━━━━━━━━━━━━━

জাযাকাল্লাহু খাইরান 🤲

রাহমানিয়া জামে মসজিদ`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // ==========================================
  // PRINT
  // ==========================================
  const handlePrint = () => {
    if (!receipt) return;

    const printWindow = window.open("", "_blank", "width=800,height=900");

    if (!printWindow) {
      Swal.fire({
        icon: "warning",
        title: "পপআপ বন্ধ করা হয়েছে",
        text: "রসিদ প্রিন্ট করার জন্য আপনার ব্রাউজারে পপআপ অনুমতি দিন।",
        confirmButtonColor: "#15803d",
      });

      return;
    }

    const donationType = getDonationTypeLabel(receipt.donationType);
    const paymentMethod = getPaymentMethodLabel(receipt.paymentMethod);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
        <head>
          <meta charset="UTF-8" />
          <title>${receipt.receiptNo}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              background: #f5f5f5;
              font-family: Arial, "Noto Sans Bengali", sans-serif;
              color: #1f2937;
            }

            .receipt {
              width: 100%;
              max-width: 700px;
              margin: auto;
              background: white;
              padding: 40px;
              border: 1px solid #d1d5db;
              border-radius: 12px;
            }

            .header {
              text-align: center;
              border-bottom: 2px solid #15803d;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }

            .logo {
              width: 65px;
              height: 65px;
              margin: 0 auto 12px;
              border-radius: 50%;
              background: #15803d;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 30px;
            }

            h1 {
              margin: 0;
              color: #166534;
              font-size: 25px;
            }

            h2 {
              margin: 5px 0 0;
              color: #374151;
              font-size: 18px;
              font-weight: normal;
            }

            .receipt-no {
              margin-top: 15px;
              color: #166534;
              font-weight: bold;
            }

            .row {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
            }

            .label {
              color: #6b7280;
            }

            .value {
              font-weight: 600;
              text-align: right;
            }

            .amount {
              margin-top: 25px;
              padding: 20px;
              text-align: center;
              border-radius: 10px;
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
            }

            .amount-label {
              color: #166534;
              font-size: 14px;
            }

            .amount-value {
              margin-top: 5px;
              color: #166534;
              font-size: 32px;
              font-weight: bold;
            }

            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px dashed #9ca3af;
              color: #4b5563;
            }

            .thanks {
              color: #166534;
              font-weight: bold;
              margin-bottom: 8px;
            }

            @media print {
              body {
                padding: 0;
                background: white;
              }

              .receipt {
                border: none;
                max-width: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="receipt">

            <div class="header">
              <div class="logo">
                🕌
              </div>

              <h1>
                রাহমানিয়া জামে মসজিদ
              </h1>

              <h2>
                দানের রসিদ
              </h2>

              <div class="receipt-no">
                রসিদ নম্বর: ${receipt.receiptNo}
              </div>
            </div>

            <div class="row">
              <span class="label">
                দাতার নাম
              </span>

              <span class="value">
                ${receipt.donorName}
              </span>
            </div>

            <div class="row">
              <span class="label">
                ইমেইল
              </span>

              <span class="value">
                ${receipt.donorEmail || "নেই"}
              </span>
            </div>

            <div class="row">
              <span class="label">
                ফোন
              </span>

              <span class="value">
                ${receipt.donorPhone || "নেই"}
              </span>
            </div>

            <div class="row">
              <span class="label">
                দানের ধরন
              </span>

              <span class="value">
                ${donationType}
              </span>
            </div>

            <div class="row">
              <span class="label">
                পেমেন্ট পদ্ধতি
              </span>

              <span class="value">
                ${paymentMethod}
              </span>
            </div>

            <div class="row">
              <span class="label">
                দানের মাস
              </span>

              <span class="value">
                ${receipt.donationPeriod}
              </span>
            </div>

            ${
              receipt.note
                ? `
                  <div class="row">
                    <span class="label">
                      নোট
                    </span>

                    <span class="value">
                      ${receipt.note}
                    </span>
                  </div>
                `
                : ""
            }

            <div class="amount">
              <div class="amount-label">
                মোট দানের পরিমাণ
              </div>

              <div class="amount-value">
                ৳${receipt.amount.toLocaleString("bn-BD")}
              </div>
            </div>

            <div class="footer">
              <div class="thanks">
                জাযাকাল্লাহু খাইরান 🤲
              </div>

              <div>
                রাহমানিয়া জামে মসজিদকে সহযোগিতা করার জন্য আপনাকে ধন্যবাদ।
              </div>
            </div>

          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // ==========================================
  // RESET
  // ==========================================
  const handleReset = () => {
    setSelectedUser(null);
    setSearch("");
    setShowUsers(false);

    setFormData({
      amount: "",
      donationType: "Mosque Fund",
      paymentMethod: "Cash",
      donationMonth: String(new Date().getMonth() + 1),
      donationYear: String(new Date().getFullYear()),
      note: "",
    });

    setReceipt(null);
    setSaved(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-3 py-5 text-gray-800 transition-colors dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-gray-100 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-green-800 via-emerald-700 to-green-900 p-5 shadow-xl sm:p-7">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[20px] border-white/10" />

          <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full border-[25px] border-white/5" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl text-white backdrop-blur-sm sm:h-16 sm:w-16">
                <FaReceipt />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-300/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                    অ্যাডমিন প্যানেল
                  </span>
                </div>

                <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                  দানের রসিদ তৈরি করুন
                </h1>

                <p className="mt-1 text-sm text-green-100 sm:text-base">
                  মসজিদের সদস্যদের জন্য দানের রসিদ তৈরি, সংরক্ষণ ও পাঠান।
                </p>
              </div>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-right backdrop-blur-sm md:block">
              <p className="text-xs text-green-100">
                বিসমিল্লাহির রাহমানির রাহিম
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                صدقة جارية
              </p>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 xl:grid-cols-12">
          {/* LEFT FORM */}
          <div className="xl:col-span-7">
            <form
              onSubmit={handleCreateReceipt}
              className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
            >
              {/* FORM HEADER */}
              <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-5 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 text-white shadow-md">
                    <FaHandHoldingHeart />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                      দানের তথ্য
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      দাতা ও দানের প্রয়োজনীয় তথ্য পূরণ করুন।
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-7">
                {/* USER */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                    <FaUser className="text-green-700" />
                    দাতা নির্বাচন করুন
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:focus-within:ring-green-900/30">
                      <div className="pl-4 text-green-700">
                        <FaSearch />
                      </div>

                      <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                          const value = e.target.value;

                          setSearch(value);
                          setShowUsers(true);

                          if (selectedUser && value !== selectedUser.name) {
                            setSelectedUser(null);
                            setReceipt(null);
                            setSaved(false);
                          }
                        }}
                        onFocus={() => setShowUsers(true)}
                        placeholder="নাম, ইমেইল অথবা ফোন দিয়ে খুঁজুন..."
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
                      />

                      {selectedUser && (
                        <button
                          type="button"
                          onClick={clearSelectedUser}
                          className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                        >
                          <FaXmark />
                        </button>
                      )}
                    </div>

                    {/* USER DROPDOWN */}
                    {showUsers && (
                      <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                        {loadingUsers ? (
                          <div className="flex items-center justify-center gap-2 p-6 text-sm text-gray-500 dark:text-gray-400">
                            <FaSpinner className="animate-spin text-green-700" />
                            ব্যবহারকারীদের তথ্য লোড হচ্ছে...
                          </div>
                        ) : filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <button
                              type="button"
                              key={user._id || user.id || user.email}
                              onClick={() => handleSelectUser(user)}
                              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-green-50 dark:hover:bg-green-950/40"
                            >
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 font-bold text-green-700 dark:bg-green-900/50">
                                {user.photoURL ? (
                                  <img
                                    src={user.photoURL}
                                    alt={user.name || "User"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span>
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-gray-800 dark:text-white">
                                  {user.name || "নাম পাওয়া যায়নি"}
                                </p>

                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                  {user.email || "ইমেইল নেই"}
                                </p>

                                {user.phone && (
                                  <p className="mt-0.5 text-xs text-green-700 dark:text-green-400">
                                    {user.phone}
                                  </p>
                                )}
                              </div>

                              <FaArrowRight className="text-xs text-gray-300" />
                            </button>
                          ))
                        ) : (
                          <div className="p-6 text-center">
                            <FaUsers className="mx-auto mb-2 text-2xl text-gray-300" />

                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                              কোনো ব্যবহারকারী পাওয়া যায়নি
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              অন্য নাম, ইমেইল অথবা ফোন নম্বর দিয়ে চেষ্টা করুন।
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* SELECTED USER */}
                  {selectedUser && (
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-700 font-bold text-white">
                        {selectedUser.photoURL ? (
                          <img
                            src={selectedUser.photoURL}
                            alt={selectedUser.name || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (selectedUser.name || "U").charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-green-900 dark:text-green-300">
                          {selectedUser.name || "নাম পাওয়া যায়নি"}
                        </p>

                        <p className="truncate text-xs text-green-700 dark:text-green-400">
                          {selectedUser.email || "ইমেইল নেই"}
                        </p>

                        {selectedUser.phone && (
                          <p className="text-xs text-green-700 dark:text-green-400">
                            {selectedUser.phone}
                          </p>
                        )}
                      </div>

                      <FaCheckCircle className="text-xl text-green-600" />
                    </div>
                  )}
                </div>

                {/* AMOUNT */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                    <FaMoneyBillWave className="text-green-700" />
                    দানের পরিমাণ
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:focus-within:ring-green-900/30">
                    <div className="flex items-center border-r border-gray-200 bg-green-50 px-4 text-lg font-bold text-green-700 dark:border-gray-700 dark:bg-green-950/40">
                      ৳
                    </div>

                    <input
                      type="number"
                      name="amount"
                      min="1"
                      step="1"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="দানের পরিমাণ লিখুন"
                      className="w-full bg-transparent px-4 py-3.5 text-lg font-semibold text-gray-800 outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* TYPE + PAYMENT */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                      <FaMosque className="text-green-700" />
                      দানের ধরন
                    </label>

                    <select
                      name="donationType"
                      value={formData.donationType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-green-900/30"
                    >
                      <option value="Mosque Fund">মসজিদ তহবিল</option>

                      <option value="Imam Food Fee">ইমামের খাবার</option>

                      <option value="Zakat">যাকাত</option>

                      <option value="Sadaqah">সাদাকাহ</option>

                      <option value="Fitrah">ফিতরা</option>

                      <option value="Construction Fund">নির্মাণ তহবিল</option>

                      <option value="Iftar Fund">ইফতার তহবিল</option>

                      <option value="Madrasa Fund">মাদরাসা তহবিল</option>

                      <option value="Orphan Fund">এতিম তহবিল</option>

                      <option value="Other">অন্যান্য</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                      <FaCreditCard className="text-green-700" />
                      পেমেন্ট পদ্ধতি
                    </label>

                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-green-900/30"
                    >
                      <option value="Cash">ক্যাশ</option>

                      <option value="bKash">বিকাশ</option>

                      <option value="Nagad">নগদ</option>

                      <option value="Rocket">রকেট</option>

                      <option value="Bank Transfer">ব্যাংক ট্রান্সফার</option>

                      <option value="Card">কার্ড</option>

                      <option value="Other">অন্যান্য</option>
                    </select>
                  </div>
                </div>

                {/* MONTH + YEAR */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                      <FaCalendarDays className="text-green-700" />
                      দানের মাস
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="donationMonth"
                      value={formData.donationMonth}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-green-900/30"
                    >
                      <option value="1">জানুয়ারি</option>
                      <option value="2">ফেব্রুয়ারি</option>
                      <option value="3">মার্চ</option>
                      <option value="4">এপ্রিল</option>
                      <option value="5">মে</option>
                      <option value="6">জুন</option>
                      <option value="7">জুলাই</option>
                      <option value="8">আগস্ট</option>
                      <option value="9">সেপ্টেম্বর</option>
                      <option value="10">অক্টোবর</option>
                      <option value="11">নভেম্বর</option>
                      <option value="12">ডিসেম্বর</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                      <FaCalendarDays className="text-green-700" />
                      দানের বছর
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="donationYear"
                      value={formData.donationYear}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-green-900/30"
                    >
                      {Array.from({ length: 7 }, (_, index) => {
                        const year = currentYear - 2 + index;

                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* NOTE */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                    <FaNoteSticky className="text-green-700" />
                    নোট
                    <span className="font-normal text-gray-400">(ঐচ্ছিক)</span>
                  </label>

                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows="3"
                    placeholder="উদাহরণ: মাসিক মসজিদ দান"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-green-900/30"
                  />
                </div>

                {/* INFO */}
                <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                  <FaCircleInfo className="mt-0.5 shrink-0 text-blue-600" />

                  <p className="text-xs leading-5 text-blue-800 dark:text-blue-300">
                    প্রথমে দানের রসিদের প্রিভিউ তৈরি করুন। তথ্য যাচাই করার পর
                    রসিদটি সংরক্ষণ করুন এবং চাইলে WhatsApp-এর মাধ্যমে দাতার কাছে
                    পাঠাতে পারবেন।
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:from-green-800 hover:to-emerald-700 active:translate-y-0 dark:shadow-green-950"
                  >
                    <FaReceipt />
                    রসিদ তৈরি করুন
                  </button>

                  {(receipt || selectedUser) && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-xl border border-gray-200 bg-white px-5 py-3.5 font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      রিসেট
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="xl:col-span-5">
            {!receipt ? (
              <div className="sticky top-5 overflow-hidden rounded-3xl border border-green-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 scale-125 rounded-full bg-green-100 blur-xl dark:bg-green-950" />

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-700 to-emerald-500 text-4xl text-white shadow-xl">
                      <FaReceipt />
                    </div>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-gray-800 dark:text-white">
                    রসিদের প্রিভিউ
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                    একজন দাতা নির্বাচন করুন এবং দানের তথ্য পূরণ করুন। এরপর আপনার
                    রসিদের প্রিভিউ এখানে দেখা যাবে।
                  </p>

                  <div className="mt-7 grid w-full max-w-sm grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-green-50 p-4 dark:bg-green-950/30">
                      <FaUser className="mx-auto text-xl text-green-700" />

                      <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        দাতা
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                      <FaMoneyBillWave className="mx-auto text-xl text-emerald-700" />

                      <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        পরিমাণ
                      </p>
                    </div>

                    <div className="rounded-2xl bg-green-50 p-4 dark:bg-green-950/30">
                      <FaWhatsapp className="mx-auto text-xl text-green-700" />

                      <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                id="receipt-preview"
                className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
              >
                {/* RECEIPT HEADER */}
                <div className="relative overflow-hidden bg-gradient-to-br from-green-800 via-emerald-700 to-green-900 px-6 py-7 text-center text-white">
                  <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full border-[12px] border-white/10" />

                  <div className="absolute -bottom-16 -right-8 h-32 w-32 rounded-full border-[14px] border-white/10" />

                  <div className="relative">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-3xl shadow-lg backdrop-blur-sm">
                      🕌
                    </div>

                    <h2 className="mt-4 font-serif text-xl font-bold sm:text-2xl">
                      রাহমানিয়া জামে মসজিদ
                    </h2>

                    <p className="mt-1 text-sm text-green-100">দানের রসিদ</p>

                    <div className="mx-auto mt-4 w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                      {receipt.receiptNo}
                    </div>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-5 sm:p-6">
                  <div className="space-y-0">
                    <div className="flex items-center justify-between gap-4 border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        দাতার নাম
                      </span>

                      <span className="text-right text-sm font-bold text-gray-800 dark:text-white">
                        {receipt.donorName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ইমেইল
                      </span>

                      <span className="max-w-[60%] truncate text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {receipt.donorEmail || "নেই"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ফোন
                      </span>

                      <span className="text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {receipt.donorPhone || "নেই"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        দানের ধরন
                      </span>

                      <span className="text-right text-sm font-bold text-green-700 dark:text-green-400">
                        {getDonationTypeLabel(receipt.donationType)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        পেমেন্ট
                      </span>

                      <span className="text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {getPaymentMethodLabel(receipt.paymentMethod)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        দানের মাস
                      </span>

                      <span className="text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {receipt.donationPeriod}
                      </span>
                    </div>

                    {receipt.note && (
                      <div className="flex items-start justify-between gap-4 border-b border-dashed border-gray-200 py-3 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          নোট
                        </span>

                        <span className="max-w-[60%] text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {receipt.note}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* AMOUNT */}
                  <div className="mt-6 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5 text-center dark:border-green-800 dark:from-green-950/40 dark:to-emerald-950/30">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                      দানের পরিমাণ
                    </p>

                    <p className="mt-1 text-3xl font-black text-green-800 dark:text-green-300 sm:text-4xl">
                      ৳{receipt.amount.toLocaleString("bn-BD")}
                    </p>
                  </div>

                  {/* THANKS */}
                  <div className="py-5 text-center">
                    <p className="font-serif font-bold text-green-800 dark:text-green-400">
                      জাযাকাল্লাহু খাইরান 🤲
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      রাহমানিয়া জামে মসজিদকে সহযোগিতা করার জন্য আপনাকে ধন্যবাদ।
                    </p>
                  </div>

                  {/* SAVED */}
                  {saved && (
                    <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                      <FaCheckCircle />
                      রসিদ সফলভাবে সংরক্ষণ হয়েছে
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleSaveReceipt}
                      disabled={saving || saved}
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white shadow-lg transition ${
                        saved
                          ? "cursor-not-allowed bg-gray-400 shadow-none"
                          : "bg-green-700 shadow-green-200 hover:bg-green-800 dark:shadow-green-950"
                      }`}
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          সংরক্ষণ হচ্ছে...
                        </>
                      ) : saved ? (
                        <>
                          <FaCheckCircle />
                          সংরক্ষিত
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          রসিদ সংরক্ষণ করুন
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-[#1ebe5d]"
                    >
                      <FaWhatsapp className="text-lg" />
                      WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3.5 text-sm font-bold text-green-700 transition hover:bg-green-50 dark:border-green-800 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-950/40"
                    >
                      <FaPrint />
                      রসিদ প্রিন্ট করুন
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <FaArrowRight className="rotate-180" />
                      নতুন দান
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM INFO */}
        <div className="mt-6 rounded-3xl border border-green-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-xl text-green-700 dark:bg-green-950/40 dark:text-green-400">
              <FaHandHoldingHeart />
            </div>

            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">
                সদকায়ে জারিয়া
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                প্রতিটি দান মসজিদ ও এর কমিউনিটির উন্নয়নে সহায়তা করে। আল্লাহ
                আপনার দান কবুল করুন এবং আপনাকে উত্তম প্রতিদান দান করুন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;
