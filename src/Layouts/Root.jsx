import { Outlet, useLocation } from "react-router";
import Header from "../Componant/Header/Header";
import Footer from "../Componant/Footer/Footer";

const Root = () => {
  const location = useLocation();

  // যে page গুলোতে Header এবং Footer থাকবে না
  const hideLayoutPages = ["/login", "/register", "/payment-receipt"];

  const isHideLayoutPage = hideLayoutPages.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <>
      {!isHideLayoutPage && <Header />}

      <Outlet />

      {!isHideLayoutPage && <Footer />}
    </>
  );
};

export default Root;
