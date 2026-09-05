import { useEffect, useState } from "react";

import axiosSecure from "../../api/axiosSecure";

import {
  FaMagnifyingGlass,
  FaUserShield,
  FaUser,
  FaUsers,
} from "react-icons/fa6";

import Swal from "sweetalert2";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // =====================================================
  // GET ALL USERS
  // =====================================================

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await axiosSecure.get("/users");

      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(
        "Failed to load users:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        Swal.fire({
          title: "অনুমতি নেই!",
          text: "আপনার লগইন সেশন শেষ হয়ে যেতে পারে। অনুগ্রহ করে আবার লগইন করুন।",
          icon: "warning",
          confirmButtonColor: "#16a34a",
        });
      } else if (error.response?.status === 403) {
        Swal.fire({
          title: "অ্যাক্সেস প্রত্যাখ্যাত!",
          text: "শুধুমাত্র অ্যাডমিন ব্যবহারকারীদের পরিচালনা করতে পারবেন।",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      } else {
        Swal.fire({
          title: "ত্রুটি!",
          text: "ব্যবহারকারীদের তথ্য লোড করা যায়নি। অনুগ্রহ করে সার্ভার চালু আছে কিনা নিশ্চিত করুন।",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =====================================================
  // MAKE ADMIN
  // =====================================================

  const handleMakeAdmin = async (id, name) => {
    const result = await Swal.fire({
      title: "অ্যাডমিন করবেন?",
      text: `আপনি কি নিশ্চিত যে ${name} কে অ্যাডমিন করতে চান?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, অ্যাডমিন করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(id);

      const res = await axiosSecure.patch(`/users/make-admin/${id}`);

      if (res.data?.modifiedCount > 0) {
        await Swal.fire({
          title: "সফল হয়েছে!",
          text: `${name} এখন একজন অ্যাডমিন।`,
          icon: "success",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#16a34a",
        });

        await loadUsers();
      } else {
        Swal.fire({
          title: "ব্যর্থ!",
          text: "ব্যবহারকারীর ভূমিকা পরিবর্তন করা যায়নি।",
          icon: "warning",
          confirmButtonColor: "#f59e0b",
        });
      }
    } catch (error) {
      console.error("Make admin error:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        Swal.fire({
          title: "অনুমতি নেই!",
          text: "অনুগ্রহ করে আবার লগইন করুন।",
          icon: "warning",
          confirmButtonColor: "#f59e0b",
        });
      } else if (error.response?.status === 403) {
        Swal.fire({
          title: "অ্যাক্সেস প্রত্যাখ্যাত!",
          text: "শুধুমাত্র অ্যাডমিন অন্য ব্যবহারকারীকে অ্যাডমিন করতে পারবেন।",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      } else {
        Swal.fire({
          title: "ত্রুটি!",
          text: "অ্যাডমিন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // REMOVE ADMIN
  // =====================================================

  const handleRemoveAdmin = async (id, name) => {
    const result = await Swal.fire({
      title: "অ্যাডমিন পদ সরাবেন?",
      text: `আপনি কি নিশ্চিত যে ${name} এর অ্যাডমিন অ্যাক্সেস সরাতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, অ্যাডমিন সরান",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(id);

      const res = await axiosSecure.patch(`/users/remove-admin/${id}`);

      if (res.data?.modifiedCount > 0) {
        await Swal.fire({
          title: "অ্যাডমিন সরানো হয়েছে!",
          text: `${name} এখন একজন সাধারণ ব্যবহারকারী।`,
          icon: "success",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#16a34a",
        });

        await loadUsers();
      } else {
        Swal.fire({
          title: "ব্যর্থ!",
          text: "ব্যবহারকারীর ভূমিকা পরিবর্তন করা যায়নি।",
          icon: "warning",
          confirmButtonColor: "#f59e0b",
        });
      }
    } catch (error) {
      console.error(
        "Remove admin error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        Swal.fire({
          title: "অনুমতি নেই!",
          text: "অনুগ্রহ করে আবার লগইন করুন।",
          icon: "warning",
          confirmButtonColor: "#f59e0b",
        });
      } else if (error.response?.status === 403) {
        Swal.fire({
          title: "অ্যাক্সেস প্রত্যাখ্যাত!",
          text: "শুধুমাত্র অ্যাডমিন অন্য অ্যাডমিনের অ্যাক্সেস সরাতে পারবেন।",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      } else {
        Swal.fire({
          title: "ত্রুটি!",
          text: "অ্যাডমিন অ্যাক্সেস সরানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
          confirmButtonColor: "#dc2626",
          icon: "error",
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();

    const name = user?.name?.toLowerCase() || "";
    const email = user?.email?.toLowerCase() || "";
    const phone = user?.phone?.toString().toLowerCase() || "";

    return (
      name.includes(searchText) ||
      email.includes(searchText) ||
      phone.includes(searchText)
    );
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-transparent">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-green-600"></span>

          <p className="mt-4 text-gray-500 dark:text-gray-400">
            ব্যবহারকারীদের তথ্য লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            ব্যবহারকারী ব্যবস্থাপনা
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            মসজিদের সকল সদস্য ও ব্যবহারকারী পরিচালনা করুন।
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-green-700 dark:bg-green-950/40 dark:text-green-400">
          <FaUsers />

          <span className="text-sm font-semibold">
            মোট ব্যবহারকারী: {users.length}
          </span>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TOTAL USERS */}

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              মোট ব্যবহারকারী
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <FaUsers />
            </div>
          </div>

          <h2 className="mt-3 text-2xl font-bold text-gray-800 dark:text-white">
            {users.length}
          </h2>
        </div>

        {/* ADMINS */}

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              মোট অ্যাডমিন
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <FaUserShield />
            </div>
          </div>

          <h2 className="mt-3 text-2xl font-bold text-purple-600 dark:text-purple-400">
            {users.filter((user) => user.role === "admin").length}
          </h2>
        </div>

        {/* NORMAL USERS */}

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              সাধারণ ব্যবহারকারী
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <FaUser />
            </div>
          </div>

          <h2 className="mt-3 text-2xl font-bold text-green-600 dark:text-green-400">
            {users.filter((user) => user.role !== "admin").length}
          </h2>
        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
        <div className="relative max-w-md">
          <FaMagnifyingGlass className="absolute left-4 top-3.5 text-gray-400" />

          <input
            type="text"
            placeholder="নাম, ইমেইল অথবা ফোন দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500 dark:focus:ring-green-900/40"
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
        {/* TABLE HEADER */}

        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white">
              সকল ব্যবহারকারী
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredUsers.length} জন ব্যবহারকারী দেখানো হচ্ছে
            </p>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50 text-sm text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">ব্যবহারকারী</th>

                <th className="px-6 py-4">ফোন</th>

                <th className="px-6 py-4">স্ট্যাটাস</th>

                <th className="px-6 py-4">ভূমিকা</th>

                <th className="px-6 py-4">অ্যাকশন</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-100 text-sm transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  {/* USER */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-600 dark:bg-green-950/50 dark:text-green-400">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {user.name || "অজানা ব্যবহারকারী"}
                        </p>

                        <p className="max-w-[240px] truncate text-xs text-gray-500 dark:text-gray-400">
                          {user.email || "ইমেইল যোগ করা হয়নি"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* PHONE */}

                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {user.phone || "যোগ করা হয়নি"}
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.status === "Inactive"
                          ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          : "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                      }`}
                    >
                      {user.status === "Inactive" ? "নিষ্ক্রিয়" : "সক্রিয়"}
                    </span>
                  </td>

                  {/* ROLE */}

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {user.role === "admin" ? <FaUserShield /> : <FaUser />}

                      {user.role === "admin" ? "অ্যাডমিন" : "ব্যবহারকারী"}
                    </span>
                  </td>

                  {/* ACTION */}

                  <td className="px-6 py-4">
                    {user.role === "admin" ? (
                      <button
                        disabled={actionLoading === user._id}
                        onClick={() => handleRemoveAdmin(user._id, user.name)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70"
                      >
                        {actionLoading === user._id
                          ? "আপডেট হচ্ছে..."
                          : "অ্যাডমিন সরান"}
                      </button>
                    ) : (
                      <button
                        disabled={actionLoading === user._id}
                        onClick={() => handleMakeAdmin(user._id, user.name)}
                        className="rounded-lg bg-purple-100 px-3 py-2 text-xs font-semibold text-purple-600 transition hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:bg-purple-950/70"
                      >
                        {actionLoading === user._id
                          ? "আপডেট হচ্ছে..."
                          : "অ্যাডমিন করুন"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* NO USERS */}

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <FaMagnifyingGlass />
              </div>

              <p className="mt-3">কোনো ব্যবহারকারী পাওয়া যায়নি।</p>

              {search && (
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  অন্য নাম, ইমেইল অথবা ফোন নম্বর দিয়ে চেষ্টা করুন।
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
