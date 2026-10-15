import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
  FaHeadset,
  FaComments,
  FaUsers,
  FaCircleInfo,
  FaMosque,
  FaArrowRight,
  FaWhatsapp,
} from "react-icons/fa6";
import Muazzin from "../../assets/muazzin.jpg";
import Imam from "../../assets/imam.jpg";
import Khatib from "../../assets/khatib.jpg";
import { Link } from "react-router";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  // =========================
  // FORM SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact Form:", formData);

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#f5f9f6] text-[#123c30]">
      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#f3faf5] via-[#edf8ef] to-[#dff1e4]">
        {/* Background Islamic Pattern */}

        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border-[25px] border-[#087443]/10" />

          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full border-[30px] border-[#087443]/10" />
        </div>

        {/* Decorative Circles */}

        <div className="absolute right-[30%] top-16 h-4 w-4 rounded-full bg-[#087443]/30" />

        <div className="absolute right-[35%] top-28 h-2 w-2 rounded-full bg-[#087443]/40" />

        <div className="absolute left-[55%] top-20 h-3 w-3 rounded-full bg-[#087443]/30" />

        <div className="mx-auto grid min-h-[430px] max-w-7xl grid-cols-1 items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-12">
          {/* Hero Content */}

          <div className="relative z-10 max-w-xl">
            {/* Small Heading */}

            <div className="mb-4 flex items-center gap-3 text-sm font-semibold text-[#087443]">
              <span className="h-px w-10 bg-[#087443]" />

              <span>যোগাযোগ করুন</span>

              <span className="h-px w-16 bg-[#087443]/40" />
            </div>

            {/* Main Heading */}

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#064e3b] sm:text-5xl lg:text-6xl">
              আমাদের সাথে যোগাযোগ করুন
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#365c50] sm:text-base">
              আমরা আপনাদের সহযোগিতায় সর্বদা প্রস্তুত। যেকোনো প্রশ্ন, পরামর্শ বা
              সহযোগিতার প্রয়োজন হলে আমাদের সাথে যোগাযোগ করুন। আমরা যত দ্রুত
              সম্ভব আপনাদের উত্তর দেওয়ার চেষ্টা করব।
            </p>

            {/* Quran Quote */}

            <div className="mt-7">
              <p
                dir="rtl"
                className="font-serif text-2xl font-semibold text-[#087443] sm:text-3xl"
              >
                وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
              </p>

              <p className="mt-2 text-sm font-medium text-[#365c50]">
                “আমার সফলতা একমাত্র আল্লাহর পক্ষ থেকেই।”
              </p>

              <p className="mt-1 text-xs text-[#54766b]">— সূরা হুদ (১১:৮৮)</p>
            </div>
          </div>

          {/* Mosque Illustration */}

          <div className="relative flex h-[300px] items-end justify-center lg:h-[380px]">
            {/* Moon */}

            <div className="absolute right-[28%] top-8 h-16 w-16 rounded-full bg-[#fffdf2] shadow-[0_0_60px_rgba(255,255,255,0.9)] sm:h-20 sm:w-20" />

            {/* Mosque Main */}

            <div className="relative z-10 flex w-full max-w-xl items-end justify-center">
              {/* Left Minaret */}

              <div className="absolute bottom-0 left-[12%] flex flex-col items-center">
                <div className="h-36 w-7 rounded-t-full bg-[#087443] sm:h-48 sm:w-9" />

                <div className="absolute top-8 h-4 w-11 rounded-sm bg-[#087443]" />

                <div className="absolute -top-5 h-8 w-4 rounded-t-full bg-[#087443]" />

                <div className="absolute -top-8 h-4 w-1 bg-[#087443]" />
              </div>

              {/* Right Minaret */}

              <div className="absolute bottom-0 right-[12%] flex flex-col items-center">
                <div className="h-36 w-7 rounded-t-full bg-[#087443] sm:h-48 sm:w-9" />

                <div className="absolute top-8 h-4 w-11 rounded-sm bg-[#087443]" />

                <div className="absolute -top-5 h-8 w-4 rounded-t-full bg-[#087443]" />

                <div className="absolute -top-8 h-4 w-1 bg-[#087443]" />
              </div>

              {/* Main Mosque */}

              <div className="relative h-40 w-64 rounded-t-[45%] bg-[#087443] sm:h-52 sm:w-80">
                {/* Dome */}

                <div className="absolute -top-28 left-1/2 h-36 w-44 -translate-x-1/2 rounded-t-full bg-[#087443] sm:-top-36 sm:h-48 sm:w-56">
                  {/* Crescent */}

                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="relative h-10 w-10">
                      <div className="absolute left-2 top-0 h-8 w-8 rounded-full border-[6px] border-[#087443]" />

                      <div className="absolute left-5 top-0 h-8 w-8 rounded-full bg-[#e6f3e8]" />
                    </div>
                  </div>
                </div>

                {/* Door */}

                <div className="absolute bottom-0 left-1/2 h-24 w-12 -translate-x-1/2 rounded-t-full bg-[#e1f2e5] sm:h-28 sm:w-14" />

                {/* Windows */}

                <div className="absolute left-8 top-16 flex gap-3 sm:left-12 sm:gap-5">
                  <span className="h-8 w-5 rounded-t-full bg-[#dff1e4]" />
                  <span className="h-8 w-5 rounded-t-full bg-[#dff1e4]" />
                  <span className="h-8 w-5 rounded-t-full bg-[#dff1e4]" />
                </div>
              </div>
            </div>

            {/* Ground */}

            <div className="absolute bottom-0 left-0 h-12 w-full rounded-[50%] bg-[#087443]/10 blur-sm" />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT INFO CARDS
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#f5f9f7] px-5 py-16 sm:px-8 lg:px-12">
        {/* Background Decoration */}

        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#087443]/5 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#e9c46a]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {/* Section Heading */}

          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#087443]/10 bg-white px-4 py-2 text-sm font-semibold text-[#087443] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#087443]" />
              আমাদের খেদমতকারীগণ
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#124b3b] sm:text-4xl lg:text-5xl">
              ইমাম, মুয়াজ্জিন <span className="text-[#087443]">ও খতিব</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
              আমাদের মসজিদের সম্মানিত ইমাম, মুয়াজ্জিন ও খতিবের সাথে সহজেই
              যোগাযোগ করুন।
            </p>

            {/* Decorative Line */}

            <div className="mx-auto mt-6 flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-[#087443]/20" />

              <span className="h-2 w-2 rotate-45 rounded-sm bg-[#e9c46a]" />

              <span className="h-px w-12 bg-[#087443]/20" />
            </div>
          </div>

          {/* Team Grid */}

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {/* ================= KHATIB ================= */}

            <div className="group relative overflow-hidden rounded-[2rem] border border-[#dcece2] bg-white shadow-[0_8px_30px_rgba(8,116,67,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,116,67,0.14)] md:col-span-2 lg:col-span-1">
              <div className="relative p-3">
                <div className="relative h-72 overflow-hidden rounded-[1.5rem] bg-[#e8f5ee] sm:h-80">
                  <img
                    src={Khatib}
                    alt="খতিব"
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#052e21]/70 via-transparent to-transparent opacity-70" />

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#087443]/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-[#e9c46a]" />
                    খতিব
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#087443] shadow-md backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#087443]" />
                    যোগাযোগযোগ্য
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3">
                <h3 className="text-xl font-extrabold text-[#124b3b]">
                  মাওলানা খন্দকার আবু জাফর
                </h3>

                <p className="mt-1 text-sm font-semibold text-[#087443]">
                  খতিব
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  জুমার খুতবা, ইসলামী আলোচনা এবং বিভিন্ন ধর্মীয় অনুষ্ঠানে
                  দিকনির্দেশনা প্রদান করেন। এছাড়াও ইসলামী ব্যাংকের ম্যানেজার।
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <a
                    href="tel:+8801714024433"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087443] text-sm font-bold text-white shadow-sm transition hover:bg-[#065d36] hover:shadow-md"
                  >
                    <FaPhone className="text-xs" />
                    কল করুন
                  </a>

                  <a
                    href="https://wa.me/8801714024433"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#087443]/20 bg-[#e8f5ee] text-sm font-bold text-[#087443] transition hover:bg-[#087443] hover:text-white"
                  >
                    <FaWhatsapp className="text-base" />
                    হোয়াটসঅ্যাপ
                  </a>
                </div>

                <a
                  href="mailto:khatib@rahmaniamasjid.com"
                  className="mt-3 flex items-center gap-3 rounded-xl border border-[#e5eee9] bg-[#f8fbf9] px-4 py-3 text-xs font-medium text-gray-600 transition hover:border-[#087443]/20 hover:bg-[#e8f5ee] hover:text-[#087443]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#087443] shadow-sm">
                    <FaEnvelope />
                  </span>

                  <span hidden className="truncate">
                    khatib@rahmaniamasjid.com
                  </span>
                </a>
              </div>
            </div>

            {/* ================= IMAM ================= */}

            <div className="group relative overflow-hidden rounded-[2rem] border border-[#dcece2] bg-white shadow-[0_8px_30px_rgba(8,116,67,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,116,67,0.14)]">
              <div className="relative p-3">
                <div className="relative h-72 overflow-hidden rounded-[1.5rem] bg-[#e8f5ee] sm:h-80">
                  <img
                    src={Imam}
                    alt="ইমাম"
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#052e21]/70 via-transparent to-transparent opacity-70" />

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#087443]/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-[#e9c46a]" />
                    ইমাম
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#087443] shadow-md backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#087443]" />
                    যোগাযোগযোগ্য
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3">
                <h3 className="text-xl font-extrabold text-[#124b3b]">
                  হাফেজ মোঃ ফায়জুর রহমান
                </h3>

                <p className="mt-1 text-sm font-semibold text-[#087443]">
                  ইমাম
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  পাঁচ ওয়াক্ত নামাজের ইমামতি, হিফ্জ বিভাগের দক্ষ শিক্ষক, ১৮-১৯
                  বছরের অভিজ্ঞতা ইমামতি এবং শিক্ষকতার।
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <a
                    href="tel:+8801927990665"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087443] text-sm font-bold text-white shadow-sm transition hover:bg-[#065d36] hover:shadow-md"
                  >
                    <FaPhone className="text-xs" />
                    কল করুন
                  </a>

                  <a
                    href="https://wa.me/8801849817118"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#087443]/20 bg-[#e8f5ee] text-sm font-bold text-[#087443] transition hover:bg-[#087443] hover:text-white"
                  >
                    <FaWhatsapp className="text-base" />
                    হোয়াটসঅ্যাপ
                  </a>
                </div>

                <a className="mt-3 flex items-center gap-3 rounded-xl border border-[#e5eee9] bg-[#f8fbf9] px-4 py-3 text-xs font-medium text-gray-600 transition hover:border-[#087443]/20 hover:bg-[#e8f5ee] hover:text-[#087443]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#087443] shadow-sm">
                    <FaEnvelope />
                  </span>

                  <span hidden className="truncate">
                    imam@rahmaniamasjid.com
                  </span>
                </a>
              </div>
            </div>

            {/* ================= MUAZZIN ================= */}

            <div className="group relative overflow-hidden rounded-[2rem] border border-[#dcece2] bg-white shadow-[0_8px_30px_rgba(8,116,67,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,116,67,0.14)]">
              <div className="relative p-3">
                <div className="relative h-72 overflow-hidden rounded-[1.5rem] bg-[#e8f5ee] sm:h-80">
                  <img
                    src={Muazzin}
                    alt="মুয়াজ্জিন"
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#052e21]/70 via-transparent to-transparent opacity-70" />

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#087443]/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-[#e9c46a]" />
                    মুয়াজ্জিন
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#087443] shadow-md backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#087443]" />
                    যোগাযোগযোগ্য
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3">
                <h3 className="text-xl font-extrabold text-[#124b3b]">
                  হাফেজ মোঃ হামিদুর রহমান
                </h3>

                <p className="mt-1 text-sm font-semibold text-[#087443]">
                  মুয়াজ্জিন
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  আজান, ইকামত এবং মসজিদের দৈনন্দিন বিভিন্ন খেদমতের দায়িত্ব পালন
                  করেন এবং ওয়েব ডেভেলপার হিসেবেও কাজ করেন।
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <a
                    href="tel:+8801650053800"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087443] text-sm font-bold text-white shadow-sm transition hover:bg-[#065d36] hover:shadow-md"
                  >
                    <FaPhone className="text-xs" />
                    কল করুন
                  </a>

                  <a
                    href="https://wa.me/8801650053800"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#087443]/20 bg-[#e8f5ee] text-sm font-bold text-[#087443] transition hover:bg-[#087443] hover:text-white"
                  >
                    <FaWhatsapp className="text-base" />
                    হোয়াটসঅ্যাপ
                  </a>
                </div>

                <a
                  href="mailto:hamidur800t@gmail.com"
                  className="mt-3 flex items-center gap-3 rounded-xl border border-[#e5eee9] bg-[#f8fbf9] px-4 py-3 text-xs font-medium text-gray-600 transition hover:border-[#087443]/20 hover:bg-[#e8f5ee] hover:text-[#087443]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#087443] shadow-sm">
                    <FaEnvelope />
                  </span>

                  <span className="truncate">hamidur800t@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MESSAGE + MAP SECTION
      ===================================================== */}

      <section className="px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1.55fr_0.9fr]">
          {/* CONTACT FORM */}

          <div className="rounded-2xl border border-[#dcece2] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            {/* Heading */}

            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e6f4ea] text-xl text-[#087443]">
                <FaMosque />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#104c3b]">
                  আমাদের একটি বার্তা পাঠান
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  নিচের ফর্মটি পূরণ করুন। আমরা যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ
                  করব।
                </p>
              </div>
            </div>

            {/* Success */}

            {submitted && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                ✓ ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে।
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name + Email */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                    পূর্ণ নাম <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    className="w-full rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                    ইমেইল ঠিকানা <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="আপনার ইমেইল লিখুন"
                    className="w-full rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                    মোবাইল নম্বর
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="আপনার মোবাইল নম্বর লিখুন"
                    className="w-full rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  />
                </div>

                {/* Subject */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                    বিষয়
                  </label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  >
                    <option value="">একটি বিষয় নির্বাচন করুন</option>
                    <option value="সাধারণ জিজ্ঞাসা">সাধারণ জিজ্ঞাসা</option>
                    <option value="দান">দান</option>
                    <option value="নামাজের সময়">নামাজের সময়</option>
                    <option value="অনুষ্ঠান">অনুষ্ঠান</option>
                    <option value="মতামত">মতামত</option>
                    <option value="প্রযুক্তিগত সহায়তা">
                      প্রযুক্তিগত সহায়তা
                    </option>
                  </select>
                </div>
              </div>

              {/* Message */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                  আপনার বার্তা <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="আপনার বার্তা এখানে লিখুন..."
                  className="w-full resize-none rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#087443] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#065d36] hover:shadow-md active:translate-y-0"
              >
                <FaPaperPlane />
                বার্তা পাঠান
              </button>
            </form>
          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-6">
            {/* MAP */}

            <div className="overflow-hidden rounded-2xl border border-[#dcece2] bg-white shadow-sm">
              <div className="h-[260px] w-full sm:h-[300px] lg:h-[250px]">
                <iframe
                  title="মসজিদের অবস্থান"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.9281868262615!2d89.16575517537302!3d23.535085178817898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fee700517826a3%3A0x2f1bd96334657b0e!2sRahmania%20Jame%20Masjid!5e0!3m2!1sen!2sbd!4v1790413712894!5m2!1sen!2sbd"
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>

            {/* WHY CONTACT */}

            <div className="rounded-2xl border border-[#dcece2] bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e6f4ea] text-lg text-[#087443]">
                  <FaMosque />
                </div>

                <h2 className="text-xl font-bold text-[#104c3b]">
                  কেন আমাদের সাথে যোগাযোগ করবেন?
                </h2>
              </div>

              <div className="mt-6 space-y-5">
                {/* Support */}

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf7f0] text-[#087443]">
                    <FaHeadset />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#174d3e]">
                      সহযোগিতা পান
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      কোনো সাহায্যের প্রয়োজন হলে আমরা আপনার পাশে আছি।
                    </p>
                  </div>
                </div>

                {/* Feedback */}

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf7f0] text-[#087443]">
                    <FaComments />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#174d3e]">
                      আপনার মতামত জানান
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      আপনার মূল্যবান মতামত আমাদের জন্য গুরুত্বপূর্ণ।
                    </p>
                  </div>
                </div>

                {/* Partnership */}

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf7f0] text-[#087443]">
                    <FaUsers />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#174d3e]">
                      সহযোগিতা ও অংশীদারিত্ব
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      সুন্দর সমাজ গঠনে আমাদের সাথে একসাথে কাজ করুন।
                    </p>
                  </div>
                </div>

                {/* General */}

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf7f0] text-[#087443]">
                    <FaCircleInfo />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#174d3e]">
                      সাধারণ জিজ্ঞাসা
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      কোনো প্রশ্ন থাকলে নির্দ্বিধায় আমাদের জিজ্ঞাসা করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#087443] px-5 py-25 sm:px-8">
        {/* Decorative */}

        <div className="absolute -left-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full border-[25px] border-white/5" />

        <div className="absolute -right-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-[30px] border-white/5" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col  items-center gap-4 sm:flex-row">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-3xl text-white">
              <FaMosque />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                আসুন, একসাথে একটি শক্তিশালী উম্মাহ গড়ে তুলি
              </h2>

              <p className="mt-1 text-sm text-white/80">
                আপনাদের সহযোগিতা ও যোগাযোগ আমাদের আরও ভালোভাবে সমাজের সেবা করতে
                সাহায্য করে।
              </p>
            </div>
          </div>

          <Link
            to="/donate"
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#087443]"
          >
            মসজিদকে সহযোগিতা করুন
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Contact;
