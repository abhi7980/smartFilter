import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const menuItems = [
  { text: "Home", icon: <HomeOutlinedIcon fontSize="small" />, path: "/" },
  {
    text: "Products",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
    path: "/products",
  },
  {
    text: "Dashboard",
    icon: <DashboardOutlinedIcon fontSize="small" />,
    path: "/dashboard",
  },
  {
    text: "Users",
    icon: <PersonOutlineOutlinedIcon fontSize="small" />,
    path: "/users",
  },
  // {
  //   text: "Profile",
  //   icon: <PersonOutlineOutlinedIcon fontSize="small" />,
  //   path: "/profile",
  // },
  {
    text: "Settings",
    icon: <SettingsOutlinedIcon fontSize="small" />,
    path: "/settings",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const drawerWidth = expanded ? 240 : 60;

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          transition: "width 0.3s",
          boxSizing: "border-box",
          marginTop: "64px",
          overflowX: "hidden",
        },
      }}
    >
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <Tooltip title={!expanded ? item.text : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    minHeight: 48,
                    justifyContent: expanded ? "initial" : "center",
                    px: 2.5,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "primary.main", // Optional: darker on hover
                    },
                    "&:hover": {
                      backgroundColor: "primary.highlight", // Optional: light hover for non-selected
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: expanded ? 2 : "auto",
                      justifyContent: "center",
                      color: isActive ? "white" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {expanded && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
