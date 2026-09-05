import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axiosSecure from "../api/axiosSecure";

const useUserRole = () => {
  const { user, loading } = useContext(AuthContext);

  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    // Firebase auth loading শেষ না হওয়া পর্যন্ত অপেক্ষা
    if (loading) {
      return;
    }

    // User login করা না থাকলে
    if (!user?.email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    const getUserRole = async () => {
      try {
        setRoleLoading(true);

        const res = await axiosSecure.get(
          `/users/${encodeURIComponent(user.email)}`,
        );

        console.log("User Role:", res.data?.role);

        setRole(res.data?.role || "user");
      } catch (error) {
        console.error(
          "Failed to load user role:",
          error.response?.data || error.message,
        );

        // API error হলে default user
        setRole("user");
      } finally {
        setRoleLoading(false);
      }
    };

    getUserRole();
  }, [user?.email, loading]);

  return {
    role,
    roleLoading,
  };
};

export default useUserRole;
