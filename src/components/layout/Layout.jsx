import { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import  useAuth  from '../../hooks/useAuth';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: '64px' }}>
        <Outlet/>
        <Footer />
      </Box>
    </Box>
  );
}