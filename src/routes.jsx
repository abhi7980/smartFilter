import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';


const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Products = lazy(()=> import('./pages/Products'))
const UserDetails = lazy(()=> import('./pages/UserDetails'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

     <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/products" element={<Products />} />
         <Route path="/users" element={<UserDetails />} />

      </Route>
    </Routes>
  );
}