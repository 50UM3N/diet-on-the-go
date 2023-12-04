import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { useEffect, useState } from "react";
import SideNav from "./SideNav";
import classes from "./dashboard.module.scss";
import BottomNav from "./BottomNav";

export const DashLayout = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [bottomNavOpen, setBottomNavOpen] = useState(false);
  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setNavOpen(false);
        setBottomNavOpen(true);
      } else {
        setNavOpen(true);
        setBottomNavOpen(false);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className={`${classes.mainWrapper} ${!bottomNavOpen && navOpen ? "nav-open" : "nav-close"}`}>
      {!bottomNavOpen && <SideNav />}
      <div>
        <TopNav navOpen={navOpen} setNavOpen={setNavOpen} bottomNavOpen={bottomNavOpen} />
        <div className={`${classes.contentWrapper} ${bottomNavOpen && classes.bottomNavOpen}`}>
          <Outlet />
        </div>
        {bottomNavOpen && <BottomNav />}
      </div>
    </main>
  );
};
