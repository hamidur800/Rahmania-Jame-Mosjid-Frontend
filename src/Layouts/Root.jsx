import { Outlet, useLocation } from "react-router";
import Header from "../Componant/Header/Header";
import Footer from "../Componant/Footer/Footer";

const Root = () => {
  const location = useLocation();

  const isReceiptPage = location.pathname.startsWith("/payment-receipt");

  return (
    <>
      {!isReceiptPage && <Header />}

      <Outlet />

      {!isReceiptPage && <Footer />}
    </>
  );
};

export default Root;
