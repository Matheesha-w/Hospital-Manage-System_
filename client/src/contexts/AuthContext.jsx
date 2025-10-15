/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:8084/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
const apiNoAuth = axios.create({ baseURL: API_BASE_URL, withCredentials: false });
// Ensure no Authorization header is carried over
delete apiNoAuth.defaults.headers.common['Authorization'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get('/auth/me');
      // Debug: log response to trace 401/200
      console.debug('[AuthContext] /auth/me response status:', response.status, 'data keys:', Object.keys(response.data || {}));
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      // clear local auth state without calling logout()
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Debug: log token presence in dev
      console.debug('[AuthContext] token present (length):', token?.length);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/signin', credentials);
      const { accessToken, ...userData } = response.data;
      
  setToken(accessToken);
  console.debug('[AuthContext] login received token length:', accessToken?.length);
      setUser(userData);
      localStorage.setItem('token', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const registerUser = async (userData) => {
    try {
      if (userData.role === 'PATIENT') {
        const response = await apiNoAuth.post('/auth/signup/patient', userData, { withCredentials: false });
        return { success: true, data: response.data };
      }

      // Staff signup
      const response = await apiNoAuth.post('/public/signup/staff', userData, { withCredentials: false });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  const isApproved = () => {
    return user?.isApproved;
  };

  const value = {
    user,
    token,
    loading,
    login,
    registerUser,
    logout,
    hasRole,
    isApproved,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
