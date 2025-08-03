import { MapIcon, StoreIcon } from "lucide-react";

export const NAVIGATION_GROUPS = [
  {
    label: "导航",
    routes: [
      {
        href: "/discover",
        label: "发现",
        icon: <StoreIcon />,
      },
      {
        href: "/nearby",
        label: "附近",
        icon: <MapIcon />,
      },
    ],
  },
];
