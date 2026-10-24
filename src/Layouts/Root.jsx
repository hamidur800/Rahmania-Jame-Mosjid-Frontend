import { Outlet, useLocation } from "react-router";
import Header from "../Componant/Header/Header";
import Footer from "../Componant/Footer/Footer";

const Root = () => {
  const location = useLocation();

  // যেসব পেজে Header ও Footer থাকবে না
  const hideLayoutPages = ["/login", "/register", "/payment-receipt", "/Duas"];

  // Login, Register, Payment Receipt এবং Quran Reader পেজ
  const isHideLayoutPage =
    hideLayoutPages.some((path) => location.pathname.startsWith(path)) ||
    location.pathname.startsWith("/quran/read/");

  return (
    <>
      {!isHideLayoutPage && <Header />}

      <main>
        <Outlet />
      </main>

      {!isHideLayoutPage && <Footer />}
    </>
  );
};

export default Root;
