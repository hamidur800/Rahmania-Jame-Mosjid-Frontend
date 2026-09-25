import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaClock,
  FaPaperPlane,
  FaHeadset,
  FaComments,
  FaUsers,
  FaCircleInfo,
  FaMosque,
  FaArrowRight,
} from "react-icons/fa6";

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

              <span>Get In Touch</span>

              <span className="h-px w-16 bg-[#087443]/40" />
            </div>

            {/* Main Heading */}

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#064e3b] sm:text-5xl lg:text-6xl">
              Contact Us
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#365c50] sm:text-base">
              We&apos;re here to help! Feel free to reach out to us for any
              questions, suggestions, or support. Our team will get back to you
              as soon as possible.
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
                &quot;My success is only by Allah.&quot;
              </p>

              <p className="mt-1 text-xs text-[#54766b]">— Surah Hud (11:88)</p>
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

      <section className="relative z-20 -mt-1 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Phone */}

          <div className="group rounded-2xl border border-[#dcece2] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#087443] text-xl text-white shadow-md">
              <FaPhone />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#124b3b]">Phone</h3>

            <p className="mt-2 text-sm font-medium text-[#365c50]">
              +880 1712 345678
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Mon - Fri, 9:00 AM - 6:00 PM
            </p>
          </div>

          {/* Email */}

          <div className="group rounded-2xl border border-[#dcece2] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#087443] text-xl text-white shadow-md">
              <FaEnvelope />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#124b3b]">Email</h3>

            <p className="mt-2 break-all text-sm font-medium text-[#365c50]">
              info@rahmaniamasjid.org
            </p>

            <p className="mt-1 text-xs text-gray-500">
              We reply within 24 hours
            </p>
          </div>

          {/* Address */}

          <div className="group rounded-2xl border border-[#dcece2] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#087443] text-xl text-white shadow-md">
              <FaLocationDot />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#124b3b]">Address</h3>

            <p className="mt-2 text-sm font-medium text-[#365c50]">
              123 Mosque Road,
              <br />
              Dhaka, Bangladesh
            </p>

            <p className="mt-1 text-xs text-gray-500">Visit us anytime</p>
          </div>

          {/* Office Hours */}

          <div className="group rounded-2xl border border-[#dcece2] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#087443] text-xl text-white shadow-md">
              <FaClock />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#124b3b]">
              Office Hours
            </h3>

            <p className="mt-2 text-sm font-medium text-[#365c50]">
              Sat - Thu: 9:00 AM - 6:00 PM
            </p>

            <p className="mt-1 text-xs text-gray-500">Friday: Closed</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MESSAGE + MAP SECTION
      ===================================================== */}

      <section className="px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1.55fr_0.9fr]">
          {/* =================================================
              CONTACT FORM
          ================================================= */}

          <div className="rounded-2xl border border-[#dcece2] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            {/* Heading */}

            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e6f4ea] text-xl text-[#087443]">
                <FaMosque />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#104c3b]">
                  Send Us a Message
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Fill out the form below and we&apos;ll get back to you
                  promptly.
                </p>
              </div>
            </div>

            {/* Success */}

            {submitted && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                ✓ Thank you! Your message has been submitted successfully.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name + Email */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  />
                </div>

                {/* Subject */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                    Subject
                  </label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Donation">Donation</option>
                    <option value="Prayer Time">Prayer Time</option>
                    <option value="Event">Event</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>
              </div>

              {/* Message */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-[#244e42]">
                  Your Message <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Write your message here..."
                  className="w-full resize-none rounded-xl border border-[#d6e7dc] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#087443] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#065d36] hover:shadow-md active:translate-y-0"
              >
                <FaPaperPlane />
                Send Message
              </button>
            </form>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="space-y-6">
            {/* MAP */}

            <div className="overflow-hidden rounded-2xl border border-[#dcece2] bg-white shadow-sm">
              <div className="h-[260px] w-full sm:h-[300px] lg:h-[250px]">
                <iframe
                  title="Mosque Location"
                  src="https://www.google.com/maps?q=Dhaka,Bangladesh&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
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
                  Why Contact Us?
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
                      Get Support
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Need help? We&apos;re here for you.
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
                      Share Your Feedback
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your opinion matters to us.
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
                      Partnership & Collaboration
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Let&apos;s work together for a better community.
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
                      General Inquiries
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Have a question? Just ask!
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

      <section className="relative overflow-hidden bg-[#087443] px-5 py-10 sm:px-8">
        {/* Decorative */}

        <div className="absolute -left-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full border-[25px] border-white/5" />

        <div className="absolute -right-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-[30px] border-white/5" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-3xl text-white">
              <FaMosque />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Together We Build a Stronger Ummah
              </h2>

              <p className="mt-1 text-sm text-white/80">
                Your support and communication help us serve the community
                better.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#087443]"
          >
            Support Our Mosque
            <FaArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
};

export default Contact;
