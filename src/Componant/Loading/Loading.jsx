import React from "react";
import { FaMosque } from "react-icons/fa6";
import Logo from "../../assets/logo.png";
const Loading = () => {
  return (
    <section
      className="
        fixed inset-0 z-[9999]
        flex min-h-screen items-center justify-center
        bg-gradient-to-b
        from-emerald-50
        via-white
        to-white
        px-4 py-10
        transition-colors duration-300
        dark:from-gray-950
        dark:via-gray-950
        dark:to-gray-900
      "
    >
      <div className="w-full max-w-md">
        {/* ================= মূল লোডার কার্ড ================= */}
        <div
          className="
            relative overflow-hidden
            rounded-3xl
            border
            border-emerald-100
            bg-white
            p-8
            text-center
            shadow-lg
            transition-colors duration-300
            dark:border-green-900/70
            dark:bg-gray-900
            dark:shadow-black/30
            sm:p-10
          "
        >
          {/* ================= সাজসজ্জার গোলাকার অংশ ================= */}
          <div
            className="
              absolute -right-12 -top-12
              h-32 w-32
              rounded-full
              bg-emerald-50
              transition-colors duration-300
              dark:bg-green-900/20
            "
          />

          <div
            className="
              absolute -bottom-16 -left-16
              h-36 w-36
              rounded-full
              bg-emerald-50
              transition-colors duration-300
              dark:bg-green-900/20
            "
          />

          {/* ================= মসজিদ আইকন লোডার ================= */}
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            {/* ঘূর্ণায়মান বর্ডার */}
            <div
              className="
                absolute inset-0
                animate-spin
                rounded-full
                border-4
                border-emerald-100
                border-t-emerald-700
                dark:border-green-900
                dark:border-t-green-500
              "
            />

            {/* মসজিদ আইকন */}
            <div
              className="
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-emerald-700
                to-green-950
                text-2xl
                text-white
                shadow-md
                shadow-green-900/20
              "
            >
              <FaMosque className="animate-pulse" />
            </div>
          </div>

          {/* ================= লোডিং লেখা ================= */}
          <div className="relative mt-7">
            <h2
              className="
                text-2xl
                font-bold
                text-emerald-950
                transition-colors duration-300
                dark:text-white
              "
            >
              অপেক্ষা করুন...
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                transition-colors duration-300
                dark:text-gray-400
              "
            >
              আপনার জন্য সবকিছু প্রস্তুত করা হচ্ছে। অনুগ্রহ করে একটু অপেক্ষা
              করুন।
            </p>
          </div>

          {/* ================= লোডিং ডট ================= */}
          <div className="relative mt-6 flex justify-center gap-2">
            <span
              className="
                h-2.5 w-2.5
                animate-bounce
                rounded-full
                bg-emerald-700
                [animation-delay:-0.3s]
                dark:bg-green-500
              "
            />

            <span
              className="
                h-2.5 w-2.5
                animate-bounce
                rounded-full
                bg-emerald-600
                [animation-delay:-0.15s]
                dark:bg-green-400
              "
            />

            <span
              className="
                h-2.5 w-2.5
                animate-bounce
                rounded-full
                bg-emerald-500
                dark:bg-green-300
              "
            />
          </div>

          {/* ================= নিচের লোডিং লাইন ================= */}
          <div
            className="
              relative mx-auto mt-7
              h-1.5 w-40
              overflow-hidden
              rounded-full
              bg-emerald-100
              dark:bg-green-900
            "
          >
            <div
              className="
                h-full w-1/2
                animate-[loading_1.5s_ease-in-out_infinite]
                rounded-full
                bg-emerald-700
                dark:bg-green-500
              "
            />
          </div>
        </div>

        {/* ================= স্কেলেটন প্রিভিউ ================= */}
        <div className="mt-5 grid grid-cols-2 gap-3 opacity-60">
          <div
            className="
              h-3
              animate-pulse
              rounded-full
              bg-emerald-100
              dark:bg-green-900
            "
          />

          <div
            className="
              h-3
              animate-pulse
              rounded-full
              bg-emerald-100
              dark:bg-green-900
            "
          />

          <div
            className="
              h-3
              animate-pulse
              rounded-full
              bg-emerald-100
              dark:bg-green-900
            "
          />

          <div
            className="
              h-3
              animate-pulse
              rounded-full
              bg-emerald-100
              dark:bg-green-900
            "
          />
        </div>
      </div>

      {/* ================= অ্যানিমেশন ================= */}
      <style>
        {`
          @keyframes loading {
            0% {
              transform: translateX(-100%);
            }

            50% {
              transform: translateX(100%);
            }

            100% {
              transform: translateX(200%);
            }
          }
        `}
      </style>
    </section>
  );
};

export default Loading;
