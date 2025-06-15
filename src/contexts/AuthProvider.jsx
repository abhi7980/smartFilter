import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import AuthContext from './AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Invalid user data in cookie', e);
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // store for 7 days
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
