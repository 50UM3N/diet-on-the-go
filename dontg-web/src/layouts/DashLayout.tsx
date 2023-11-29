import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { useEffect, useState } from "react";
import SideNav from "./SideNav";
import classes from "./dashboard.module.scss";

export const DashLayout = () => {
  const [navOpen, setNavOpen] = useState(true);
  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setNavOpen(false);
      } else {
        setNavOpen(true);
      }
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className={`${classes.mainWrapper} ${navOpen ? "nav-open" : "nav-close"}`}>
      <SideNav />
      <div>
        <TopNav navOpen={navOpen} setNavOpen={setNavOpen} />
        <div className={classes.contentWrapper}>
          <Outlet />
        </div>
      </div>
    </main>
  );
};
