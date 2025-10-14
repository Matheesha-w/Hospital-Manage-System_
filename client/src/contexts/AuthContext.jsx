import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:8080/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
const apiNoAuth = axios.create({ baseURL: API_BASE_URL, withCredentials: false });
// Ensure no Authorization header is carried over
delete apiNoAuth.defaults.headers.common['Authorization'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/signin', credentials);
      const { accessToken, ...userData } = response.data;
      
      setToken(accessToken);
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

  const registerUser = async (userData, cvFile) => {
    try {
      if (userData.role === 'PATIENT') {
        const response = await apiNoAuth.post('/auth/signup/patient', userData, { withCredentials: false });
        return { success: true, data: response.data };
      }

      // Staff signup now JSON-only (no CV)
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
