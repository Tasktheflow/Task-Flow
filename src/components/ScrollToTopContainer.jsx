import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTopContainer = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const container = document.getElementById("dashboard-scroll");

    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [pathname]);


  return null;
};

export default ScrollToTopContainer;
