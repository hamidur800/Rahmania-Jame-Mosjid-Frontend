import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  FaUsers,
  FaSearch,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaUser,
  FaMoneyBillWave,
  FaSpinner,
  FaArrowRight,
} from "react-icons/fa";
import axiosSecure from "../../api/axiosSecure";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await axiosSecure.get("/users");

        setUsers(res.data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.phone?.includes(value),
    );
  }, [users, search]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <FaSpinner className="mx-auto mb-3 animate-spin text-4xl text-[#087443]" />
          <p className="font-medium text-gray-600 dark:text-gray-300">
            ইউজার লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6] p-4 dark:bg-gray-950 md:p-6">
      {/* Header */}
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#075c46] to-[#087443] p-5 text-white shadow-lg md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-2xl bg-white/15 p-3">
                <FaUsers className="text-2xl" />
              </div>

              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  ইউজার ম্যানেজমেন্ট
                </h1>

                <p className="mt-1 text-sm text-green-50">
                  সকল মসজিদ সদস্যদের তথ্য ও পেমেন্ট হিস্টোরি
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
            <p className="text-sm text-green-100">মোট ইউজার</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="নাম, ইমেইল অথবা ফোন দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Users */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <FaUsers className="mx-auto mb-4 text-5xl text-gray-300" />

          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            কোনো ইউজার পাওয়া যায়নি
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            অন্য কোনো নাম, ইমেইল অথবা ফোন দিয়ে চেষ্টা করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredUsers.map((user) => (
            <Link
              key={user._id || user.email}
              to={`/dashboard/users/${encodeURIComponent(
                user.email,
              )}/payment-history`}
              className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#087443]/30 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Card Top */}
              <div className="h-20 bg-gradient-to-r from-[#075c46] to-[#087443]" />

              <div className="relative px-5 pb-5">
                {/* Avatar */}
                <div className="-mt-10 mb-4">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-[#e8f3ef] shadow-md dark:border-gray-900">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#087443]">
                        <FaUser className="text-3xl" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Name + Role */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-gray-800 dark:text-white">
                      {user.name || "নাম নেই"}
                    </h2>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <FaUser className="text-[#087443]" />
                      <span>মসজিদ সদস্য</span>
                    </div>
                  </div>

                  {user.role === "admin" && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <FaUserShield />
                      Admin
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                    <FaEnvelope className="shrink-0 text-[#087443]" />

                    <span className="truncate text-sm text-gray-600 dark:text-gray-300">
                      {user.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                    <FaPhone className="shrink-0 text-[#087443]" />

                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {user.phone || "ফোন নম্বর নেই"}
                    </span>
                  </div>
                </div>

                {/* Payment History */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-[#087443]/10 p-3 text-[#087443] transition group-hover:bg-[#087443] group-hover:text-white">
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave />
                    <span className="text-sm font-semibold">
                      Payment History
                    </span>
                  </div>

                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
