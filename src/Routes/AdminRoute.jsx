import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { role, roleLoading } = useUserRole();

  const location = useLocation();

  // Firebase অথবা Role Loading
  if (loading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }

  // User login না থাকলে
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin না হলে
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin হলে
  return children;
};

export default AdminRoute;
