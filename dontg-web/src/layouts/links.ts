import { IconBuildingSkyscraper, IconHome, IconMeat } from "@tabler/icons-react";
import { LinksData } from "@/types/index.type";
export const navLinks: LinksData[] = [
  { link: "/", label: "Dashboard", exact: true, icon: IconHome },
  {
    link: "/food-items",
    label: "Food Items",
    icon: IconMeat,
  },
  {
    link: "/diet-chart",
    label: "Diet Chart",
    icon: IconBuildingSkyscraper,
  },
];
