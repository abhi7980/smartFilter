import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

// Make sure this is a default export
export default function useAuth() {
  return useContext(AuthContext);
}