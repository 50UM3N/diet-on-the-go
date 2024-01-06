import classes from "./dashboard.module.scss";
import { NavLink, Title } from "@mantine/core";
import { Link as NL } from "react-router-dom";
import { navLinks } from "./links";

const SideNav = () => {
  return (
    <div className={classes.sideNavWrapper + " side-bar-wrapper"}>
      <div className={classes.sideNav}>
        <Title ta="center" px="sm" py="sm">
          DonGo
        </Title>
        <div className={classes.linkWrapper}>
          {navLinks.map((item, index) => (
            <NavLink component={NL} style={{ borderRadius: "14px" }} key={index} label={item.label} leftSection={<item.icon size="1rem" stroke={1.5} />} childrenOffset={28} to={item.link}>
              {item.links?.map((link) => (
                <NavLink component={NL} to={link.link} style={{ borderRadius: "14px" }} key={link.label} label={link.label} />
              ))}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideNav;
