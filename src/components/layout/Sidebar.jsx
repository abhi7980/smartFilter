import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';

// Outlined icons with small size
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const menuItems = [
  { text: 'Home', icon: <HomeOutlinedIcon fontSize="small" />, path: '/' },
  { text: 'Products', icon: <Inventory2OutlinedIcon fontSize="small" />, path: '/products' },
  { text: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" />, path: '/dashboard' },
  { text: 'Profile', icon: <PersonOutlineOutlinedIcon fontSize="small" />, path: '/profile' },
  { text: 'Settings', icon: <SettingsOutlinedIcon fontSize="small" />, path: '/settings' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px',
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
