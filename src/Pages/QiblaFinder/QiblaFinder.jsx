import { useCallback, useEffect, useRef, useState } from "react";

import {
  FaCompass,
  FaLocationDot,
  FaKaaba,
  FaArrowRotateRight,
  FaLocationCrosshairs,
} from "react-icons/fa6";

const QiblaFinder = () => {
  // ========================================
  // States
  // ========================================
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [heading, setHeading] = useState(null);
  const [error, setError] = useState("");
  const [compassStarted, setCompassStarted] = useState(false);

  // ========================================
  // Refs
  // ========================================
  const headingRef = useRef(null);
  const lastHeadingRef = useRef(null);

  // ========================================
  // Kaaba Location
  // ========================================
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  // ========================================
  // Convert Degree → Radian
  // ========================================
  const toRadians = (degree) => {
    return (degree * Math.PI) / 180;
  };

  // ========================================
  // Convert Radian → Degree
  // ========================================
  const toDegrees = (radian) => {
    return (radian * 180) / Math.PI;
  };

  // ========================================
  // Normalize Angle
  // ========================================
  const normalizeHeading = (value) => {
    return ((value % 360) + 360) % 360;
  };

  // ========================================
  // Calculate Qibla Direction
  // ========================================
  const calculateQiblaDirection = (latitude, longitude) => {
    const userLat = toRadians(latitude);
    const kaabaLat = toRadians(KAABA_LAT);

    const deltaLongitude = toRadians(KAABA_LNG - longitude);

    const y = Math.sin(deltaLongitude);

    const x =
      Math.cos(userLat) * Math.tan(kaabaLat) -
      Math.sin(userLat) * Math.cos(deltaLongitude);

    let direction = toDegrees(Math.atan2(y, x));

    direction = normalizeHeading(direction);

    return direction;
  };

  // ========================================
  // Smooth Compass Heading
  // ========================================
  const smoothHeading = useCallback((newHeading) => {
    const previous = lastHeadingRef.current;

    if (previous === null) {
      lastHeadingRef.current = newHeading;
      return newHeading;
    }

    let difference = newHeading - previous;

    if (difference > 180) {
      difference -= 360;
    }

    if (difference < -180) {
      difference += 360;
    }

    // Smooth factor
    const smoothed = previous + difference * 0.25;

    const finalHeading = normalizeHeading(smoothed);

    lastHeadingRef.current = finalHeading;

    return finalHeading;
  }, []);

  // ========================================
  // Get Screen Orientation
  // ========================================
  const getScreenAngle = () => {
    if (typeof window === "undefined") {
      return 0;
    }

    if (window.screen?.orientation?.angle !== undefined) {
      return window.screen.orientation.angle;
    }

    if (typeof window.orientation === "number") {
      return window.orientation;
    }

    return 0;
  };

  // ========================================
  // Device Orientation Handler
  // ========================================
  const handleOrientation = useCallback(
    (event) => {
      let deviceHeading = null;

      // ======================================
      // iPhone / iOS Safari
      // ======================================
      if (
        typeof event.webkitCompassHeading === "number" &&
        !Number.isNaN(event.webkitCompassHeading)
      ) {
        deviceHeading = event.webkitCompassHeading;
      }

      // ======================================
      // Android / Chrome
      // ======================================
      else if (typeof event.alpha === "number" && !Number.isNaN(event.alpha)) {
        deviceHeading = 360 - event.alpha;

        // Adjust for screen rotation
        const screenAngle = getScreenAngle();

        deviceHeading += screenAngle;
      }

      // ======================================
      // No Compass Data
      // ======================================
      if (deviceHeading === null) {
        return;
      }

      deviceHeading = normalizeHeading(deviceHeading);

      const smooth = smoothHeading(deviceHeading);

      headingRef.current = smooth;

      setHeading(smooth);
    },
    [smoothHeading],
  );

  // ========================================
  // Start Compass
  // ========================================
  const startCompass = async () => {
    setError("");

    try {
      // ======================================
      // Browser Support Check
      // ======================================
      if (typeof window.DeviceOrientationEvent === "undefined") {
        setError("আপনার ডিভাইসে কম্পাস সেন্সর সাপোর্ট করছে না।");

        return false;
      }

      // ======================================
      // iPhone / iOS Permission
      // ======================================
      if (
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        const permission =
          await window.DeviceOrientationEvent.requestPermission();

        if (permission !== "granted") {
          setError(
            "মোশন ওরিয়েন্টেশন অনুমতি দেওয়া হয়নি। অনুগ্রহ করে ব্রাউজার সেটিংস থেকে Motion & Orientation অনুমতি চালু করুন।",
          );

          return false;
        }
      }

      // ======================================
      // Reset Heading
      // ======================================
      headingRef.current = null;
      lastHeadingRef.current = null;
      setHeading(null);

      // ======================================
      // Remove Existing Listeners
      // ======================================
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true,
      );

      window.removeEventListener("deviceorientation", handleOrientation, true);

      // ======================================
      // Android Absolute Orientation
      // ======================================
      window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true,
      );

      // ======================================
      // iPhone / Fallback
      // ======================================
      window.addEventListener("deviceorientation", handleOrientation, true);

      setCompassStarted(true);

      return true;
    } catch (err) {
      console.error("Compass permission error:", err);

      setError(
        "আপনার ডিভাইসের কম্পাস ব্যবহার করা যাচ্ছে না। ব্রাউজারের অনুমতি এবং HTTPS সংযোগ পরীক্ষা করুন।",
      );

      return false;
    }
  };

  // ========================================
  // Get User Location
  // ========================================
  const getLocation = async () => {
    setLoading(true);
    setError("");

    // Start compass first
    const compassReady = await startCompass();

    if (!compassReady) {
      setLoading(false);
      return;
    }

    // ======================================
    // Geolocation Support
    // ======================================
    if (!navigator.geolocation) {
      setError("আপনার ব্রাউজারে লোকেশন সাপোর্ট নেই।");

      setLoading(false);
      return;
    }

    // ======================================
    // Get Current Location
    // ======================================
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const direction = calculateQiblaDirection(latitude, longitude);

        setLocation({
          latitude,
          longitude,
        });

        setQiblaDirection(direction);

        setLoading(false);
      },

      (geoError) => {
        console.error("Location error:", geoError);

        if (geoError.code === 1) {
          setError(
            "লোকেশন অনুমতি দেওয়া হয়নি। অনুগ্রহ করে Location Access অনুমতি দিন।",
          );
        } else if (geoError.code === 2) {
          setError("আপনার বর্তমান লোকেশন নির্ধারণ করা যাচ্ছে না।");
        } else if (geoError.code === 3) {
          setError("লোকেশন পাওয়ার সময় শেষ হয়ে গেছে। আবার চেষ্টা করুন।");
        } else {
          setError("আপনার বর্তমান লোকেশন পাওয়া যাচ্ছে না।");
        }

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  // ========================================
  // Cleanup
  // ========================================
  useEffect(() => {
    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true,
      );

      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [handleOrientation]);

  // ========================================
  // Calculate Angle Difference
  // ========================================
  const getAngleDifference = () => {
    if (qiblaDirection === null || heading === null) {
      return null;
    }

    let difference = qiblaDirection - heading;

    difference = ((difference + 540) % 360) - 180;

    return difference;
  };

  const angleDifference = getAngleDifference();

  // ========================================
  // Facing Qibla
  // ========================================
  const isFacingQibla =
    angleDifference !== null && Math.abs(angleDifference) <= 5;

  // ========================================
  // Arrow Rotation
  // ========================================
  const arrowRotation =
    qiblaDirection !== null && heading !== null ? angleDifference : 0;

  // ========================================
  // Direction Text
  // ========================================
  const getDirectionText = () => {
    if (angleDifference === null) {
      return "কম্পাস ক্যালিব্রেট হচ্ছে...";
    }

    if (isFacingQibla) {
      return "আপনি কিবলার দিকে মুখ করে আছেন";
    }

    if (angleDifference > 0) {
      return `ডান দিকে ${Math.abs(angleDifference).toFixed(0)}° ঘুরুন`;
    }

    return `বাম দিকে ${Math.abs(angleDifference).toFixed(0)}° ঘুরুন`;
  };

  // ========================================
  // Loading Screen
  // ========================================
  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 px-3 py-6 pb-28 transition-colors duration-300 dark:bg-gray-950 sm:px-5 md:py-8">
        <div className="mx-auto flex min-h-[500px] w-full max-w-4xl items-center justify-center">
          <div className="text-center">
            <FaCompass className="mx-auto animate-spin text-5xl text-[#087443] dark:text-emerald-400" />

            <p className="mt-5 text-sm font-semibold text-gray-600 dark:text-gray-300">
              কিবলা ফাইন্ডার চালু হচ্ছে...
            </p>

            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              অনুগ্রহ করে লোকেশন ও কম্পাসের অনুমতি দিন
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-3 py-6 pb-28 transition-colors duration-300 dark:bg-gray-950 sm:px-5 md:py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* ========================================
            HERO
        ======================================== */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-950 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-green-100">
                <FaKaaba />

                <span className="text-sm">ইসলামি কিবলা নির্দেশনা</span>
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                লাইভ কিবলা ফাইন্ডার
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                আপনার ফোন ঘুরিয়ে পবিত্র কাবা শরীফের সঠিক দিক খুঁজে বের করুন।
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-4xl">
              <FaCompass />
            </div>
          </div>
        </div>

        {/* ========================================
            ERROR
        ======================================== */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm leading-6 text-red-600 dark:text-red-400">
              {error}
            </p>

            <button
              onClick={getLocation}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#087443] shadow-sm transition hover:bg-green-50 dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-gray-700"
            >
              <FaArrowRotateRight />
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* ========================================
            START SCREEN
        ======================================== */}
        {!location && !error && (
          <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl text-[#087443] dark:bg-emerald-950/50 dark:text-emerald-400">
              <FaLocationCrosshairs />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800 dark:text-white">
              কিবলার দিক খুঁজুন
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              পবিত্র কাবা শরীফের সঠিক দিক খুঁজে পেতে আপনার লোকেশন এবং কম্পাসের
              অনুমতি দিন।
            </p>

            <button
              onClick={getLocation}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#087443] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#066238]"
            >
              <FaLocationDot />
              কিবলা ফাইন্ডার চালু করুন
            </button>

            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
              📱 মোবাইল ফোনে ব্যবহার করলে সবচেয়ে ভালো ফলাফল পাবেন।
            </p>
          </div>
        )}

        {/* ========================================
            COMPASS
        ======================================== */}
        {location && qiblaDirection !== null && (
          <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
            {/* ====================================
                STATUS
            ==================================== */}
            <div className="text-center">
              {isFacingQibla ? (
                <>
                  <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-[#087443] dark:bg-emerald-950/60 dark:text-emerald-400">
                    ✓ কিবলার দিকে মুখ করা হয়েছে
                  </div>

                  <h2 className="mt-3 text-2xl font-bold text-[#087443] dark:text-emerald-400">
                    আল্লাহু আকবার 🕋
                  </h2>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold tracking-wider text-[#087443] dark:text-emerald-400">
                    লাইভ কিবলা নির্দেশনা
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                    {getDirectionText()}
                  </h2>
                </>
              )}
            </div>

            {/* ====================================
                COMPASS
            ==================================== */}
            <div className="relative mx-auto mt-8 flex h-72 w-72 items-center justify-center rounded-full border-[10px] border-green-100 bg-green-50 shadow-inner transition-colors duration-300 dark:border-emerald-900/60 dark:bg-emerald-950/40 sm:h-80 sm:w-80">
              {/* Compass Ring */}
              <div className="absolute inset-0">
                {/* North */}
                <span className="absolute left-1/2 top-4 -translate-x-1/2 text-sm font-bold text-red-500">
                  উ
                </span>

                {/* East */}
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500 dark:text-gray-400">
                  পূ
                </span>

                {/* South */}
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-500 dark:text-gray-400">
                  দ
                </span>

                {/* West */}
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500 dark:text-gray-400">
                  প
                </span>

                {/* Small Compass Marks */}
                <div className="absolute left-1/2 top-9 h-2 w-0.5 -translate-x-1/2 rounded-full bg-red-400" />
                <div className="absolute bottom-9 left-1/2 h-2 w-0.5 -translate-x-1/2 rounded-full bg-gray-400 dark:bg-gray-600" />
                <div className="absolute right-9 top-1/2 h-0.5 w-2 -translate-y-1/2 rounded-full bg-gray-400 dark:bg-gray-600" />
                <div className="absolute left-9 top-1/2 h-0.5 w-2 -translate-y-1/2 rounded-full bg-gray-400 dark:bg-gray-600" />
              </div>

              {/* ==================================
                  QIBLA ARROW
              ================================== */}
              <div
                className="absolute inset-0 flex items-start justify-center"
                style={{
                  transform: `rotate(${arrowRotation}deg)`,
                  transition: "transform 0.25s ease-out",
                }}
              >
                <div className="mt-7 flex flex-col items-center">
                  {/* Kaaba */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl text-[#087443] shadow-md dark:bg-gray-800 dark:text-emerald-400">
                    <FaKaaba />
                  </div>

                  {/* Arrow Line */}
                  <div className="h-20 w-1 rounded-full bg-[#087443] dark:bg-emerald-500" />

                  {/* Arrow Head */}
                  <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-b-[22px] border-l-transparent border-r-transparent border-b-[#087443] dark:border-b-emerald-500" />
                </div>
              </div>

              {/* ==================================
                  CENTER
              ================================== */}
              <div className="z-20 flex h-16 w-16 items-center justify-center rounded-full bg-[#087443] text-2xl text-white shadow-lg dark:bg-emerald-600">
                <FaCompass />
              </div>
            </div>

            {/* ====================================
                INSTRUCTION
            ==================================== */}
            <div className="mt-6 rounded-2xl bg-green-50 p-4 text-center dark:bg-emerald-950/30">
              {heading === null ? (
                <>
                  <p className="text-sm font-semibold text-[#087443] dark:text-emerald-400">
                    কম্পাস ক্যালিব্রেট হচ্ছে...
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    ফোনটি ধীরে ধীরে ৮-এর মতো করে নাড়ান।
                  </p>
                </>
              ) : isFacingQibla ? (
                <>
                  <p className="text-sm font-bold text-[#087443] dark:text-emerald-400">
                    ✓ চমৎকার! আপনি কিবলার দিকে মুখ করে আছেন।
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    ফোনটি এই দিকেই রাখুন।
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-[#087443] dark:text-emerald-400">
                    {getDirectionText()}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    তীরটি সোজা সামনে আসা পর্যন্ত ধীরে ধীরে ফোন ঘোরান।
                  </p>
                </>
              )}
            </div>

            {/* ====================================
                INFORMATION
            ==================================== */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Qibla */}
              <div className="rounded-2xl bg-gray-50 p-4 text-center dark:bg-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  কিবলার দিক
                </p>

                <p className="mt-1 text-xl font-bold text-[#087443] dark:text-emerald-400">
                  {qiblaDirection.toFixed(1)}°
                </p>
              </div>

              {/* Heading */}
              <div className="rounded-2xl bg-gray-50 p-4 text-center dark:bg-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  ফোনের দিক
                </p>

                <p className="mt-1 text-xl font-bold text-[#087443] dark:text-emerald-400">
                  {heading !== null ? `${heading.toFixed(1)}°` : "--"}
                </p>
              </div>
            </div>

            {/* ====================================
                LOCATION
            ==================================== */}
            <div className="mt-3 rounded-2xl bg-green-50 p-4 text-center dark:bg-emerald-950/30">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                বর্তমান অবস্থান
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {location.latitude.toFixed(5)}
                {", "}
                {location.longitude.toFixed(5)}
              </p>
            </div>

            {/* ====================================
                UPDATE LOCATION
            ==================================== */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={getLocation}
                className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-5 py-3 text-sm font-semibold text-[#087443] transition hover:bg-green-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
              >
                <FaArrowRotateRight />
                আবার ক্যালিব্রেট করুন
              </button>
            </div>

            {/* ====================================
                SENSOR STATUS
            ==================================== */}
            <div className="mt-5 text-center">
              <p
                className={`text-[11px] ${
                  compassStarted
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {compassStarted
                  ? "● লাইভ কম্পাস সক্রিয় আছে"
                  : "কম্পাস সক্রিয় নয়"}
              </p>
            </div>
          </div>
        )}

        {/* ========================================
            IMPORTANT NOTE
        ======================================== */}
        {location && (
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="text-xs leading-6 text-amber-700 dark:text-amber-400">
              ⚠️ কম্পাসের সঠিক ফলাফলের জন্য ফোনটি সমতলভাবে ধরে ব্যবহার করুন।
              কাছাকাছি চুম্বক, ধাতব বস্তু বা ইলেকট্রনিক ডিভাইস থাকলে কম্পাসের
              দিক কিছুটা ভুল দেখাতে পারে।
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default QiblaFinder;
