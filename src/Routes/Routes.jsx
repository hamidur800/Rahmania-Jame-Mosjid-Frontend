import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import ForgotPassword from "../Pages/Auth/ForgotPassword/ForgotPassword ";
import Profile from "../Pages/Profile/Profile";
import { createBrowserRouter } from "react-router";
import Root from "../Layouts/Root";
import Quran from "../Pages/Quran/Quran";
import Prayers from "../Pages/Prayers/Prayers";
import Donate from "../Pages/Donate/Donate";
import PaymentHistory from "../Pages/Payment-history/Payment-history";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Users from "../Pages/Dashboard/Users";
import Payments from "../Pages/Dashboard/Payments";
import Reports from "../Pages/Dashboard/Reports";
import PaymentStatus from "../Pages/Dashboard/PaymentStatus";
import AdminRoute from "./AdminRoute";
import EditProfile from "../Pages/Profile/EditProfile";
import PaymentReceipt from "../Pages/Payment-history/PaymentReceipt";
import QiblaFinder from "../Pages/QiblaFinder/QiblaFinder";
import BookLibrary from "../Pages/BookLibrary/BookLibrary";
import Announcements from "../Pages/Announcements/Announcements";
import LiveStream from "../Pages/LiveStream/LiveStream";
import Events from "../Pages/Events/Events";
import Hadith from "../Pages/Hadith/Hadith";
import Home from "../Pages/HomePage/Home";
import CreateDonation from "../Pages/Dashboard/CreateDonation";
import PrayerTimes from "../Pages/Dashboard/Prayer-Times";
import Setting from "../Pages/Dashboard/Setting";
import Settings from "../Pages/Settings/Settings";
import UserPaymentHistory from "../Pages/Dashboard/UserPaymentHistory";
import Contact from "../Pages/Contact/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/prayers",
        element: <Prayers />,
      },
      {
        path: "/donate",
        element: <Donate />,
      },
      {
        path: "/payment-history",
        element: <PaymentHistory />,
      },
      {
        path: "payment-receipt/:id",
        element: <PaymentReceipt />,
      },
      {
        path: "/quran",
        element: <Quran />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/qibla",
        element: <QiblaFinder />,
      },
      {
        path: "/Contact",
        element: <Contact />,
      },
      {
        path: "/library",
        element: <BookLibrary />,
      },
      {
        path: "/announcements",
        element: <Announcements />,
      },
      {
        path: "/live-stream",
        element: <LiveStream />,
      },
      {
        path: "/events",
        element: <Events />,
      },
      {
        path: "/hadith",
        element: <Hadith />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users/:email/payment-history",
        element: <UserPaymentHistory />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "payments",
        element: <Payments />,
      },
      {
        path: "payment-status",
        element: <PaymentStatus />,
      },

      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "prayer-times",
        element: <PrayerTimes />,
      },
      {
        path: "create-donation",
        element: <CreateDonation />,
      },
      {
        path: "setting",
        element: <Setting />,
      },
    ],
  },
]);

export default router;
