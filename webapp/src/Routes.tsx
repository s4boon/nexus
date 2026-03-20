import {
  Calendar,
  Clock,
  Compass,
  Dices,
  Home,
  LibraryBig,
  Settings,
} from "lucide-react";
import App from "./App";

export const routes: Array<{
  path: string;
  label: string;
  component: React.ReactNode;
  sidebar_icon: React.ReactNode;
  sidebar_group: string;
}> = [
  {
    path: "/",
    label: "Home",
    component: <App />,
    sidebar_icon: <Home />,
    sidebar_group: "Main",
  },
  {
    path: "/browse",
    label: "Browse",
    component: <App />,
    sidebar_icon: <LibraryBig />,
    sidebar_group: "Main",
  },
  {
    path: "/discover",
    label: "Discover",
    component: <App />,
    sidebar_icon: <Compass />,
    sidebar_group: "Main",
  },
  {
    path: "/random",
    label: "Random",
    component: <App />,
    sidebar_icon: <Dices />,
    sidebar_group: "Main",
  },
  {
    path: "/latest",
    label: "Latest Episodes",
    component: <App />,
    sidebar_icon: <Clock />,
    sidebar_group: "Main",
  },
  {
    path: "/schedule",
    label: "Schedule",
    component: <App />,
    sidebar_icon: <Calendar />,
    sidebar_group: "Main",
  },
  {
    path: "/settings",
    label: "Settings",
    component: <App />,
    sidebar_icon: <Settings />,
    sidebar_group: "Settings",
  },
];
