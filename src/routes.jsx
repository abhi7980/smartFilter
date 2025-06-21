import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/SignUp';


const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const ProductsDetails = lazy(()=> import('./pages/Products'))
const UserDetails = lazy(()=> import('./pages/UserDetails'))
const Product = lazy(()=> import('./pages/ProductTable'))
const RentalTable = lazy(()=> import('./pages/RentalTable'))
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
     <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<ProductsDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/products" element={<Product />} />
         <Route path="/users" element={<UserDetails />} />
          <Route path="/rental" element={<RentalTable />} />
      </Route>
    </Routes>
  );
}