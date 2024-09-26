import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {DogWalker} from '../interfaces/dogWalker';
import {getDogWalkerById} from '../services/dogWalkerService';

interface AuthContextProps {
  user: DogWalker | null;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  logout: () => void;
  setAuthTSession: () => Promise<void>;
  storeTokens: (
    accessToken: string,
    refreshToken: string,
    userId: string,
  ) => Promise<void>;
  handleSetUser: (newUser: DogWalker) => void;
  fetchUser: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userId: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  setIsLoading: () => {},
  logout: () => {},
  setAuthTSession: async () => {},
  storeTokens: async () => {},
  handleSetUser: (_newUser: DogWalker) => {},
  fetchUser: async () => {},
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<DogWalker | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTokens = async (
    newAccessToken: string,
    newRefreshToken: string,
    newUserId: string,
  ) => {
    setIsLoading(true);
    try {
      await EncryptedStorage.setItem('accessToken', newAccessToken);
      await EncryptedStorage.setItem('refreshToken', newRefreshToken);
      await EncryptedStorage.setItem('userId', newUserId);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUserId(newUserId);
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthTSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const resultAccessToken = await EncryptedStorage.getItem('accessToken');
      const resultRefreshToken = await EncryptedStorage.getItem('refreshToken');
      const resultUserId = await EncryptedStorage.getItem('userId');

      if (resultAccessToken && resultRefreshToken && resultUserId) {
        setAccessToken(resultAccessToken);
        setRefreshToken(resultRefreshToken);
        setUserId(resultUserId);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoading = (value: boolean) => {
    setIsLoading(value);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await EncryptedStorage.removeItem('accessToken');
      await EncryptedStorage.removeItem('refreshToken');
      await EncryptedStorage.removeItem('userId');

      setAccessToken(null);
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setUserId(null);
    } catch (error) {
      console.error('Erro ao fazer logout');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = useCallback(async () => {
    console.log('got here fetchUser');
    if (!userId) return;
    setIsLoading(true);
    try {
      const result = await getDogWalkerById(userId);
      setUser(result);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleSetUser = (newUser: DogWalker) => {
    console.log('got here handleSetUser');
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        accessToken,
        refreshToken,
        isLoading,
        setIsLoading: handleLoading,
        logout: handleLogout,
        setAuthTSession,
        storeTokens: handleTokens,
        fetchUser,
        handleSetUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
