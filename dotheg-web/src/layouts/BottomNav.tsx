import { NavLink } from "react-router-dom";
import classes from "./dashboard.module.scss";
import { navLinks } from "./links";
import { Button, Group } from "@mantine/core";
const BottomNav = () => {
  return (
    <div className={classes.bottomNav}>
      <div className={classes.bottomNavInner}>
        <Group style={{ flex: 1 }} gap="xs" grow>
          {navLinks.map((item, index) => (
            <NavLink to={item.link} key={index}>
              {({ isActive }) => (
                <Button w="100%" variant={isActive ? "filled" : "subtle"} className="bottomNavButton" key={index}>
                  <item.icon stroke={1.5} />
                </Button>
              )}
            </NavLink>
          ))}
        </Group>
      </div>
    </div>
  );
};

export default BottomNav;
