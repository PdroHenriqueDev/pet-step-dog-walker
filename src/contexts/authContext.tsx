import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {DogWalker} from '../interfaces/dogWalker';

interface AuthContextProps {
  user: DogWalker | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  logout: () => void;
  setAuthTSession: () => Promise<void>;
  storeTokens: (
    accessToken: string,
    refreshToken: string,
    newUser: DogWalker,
  ) => Promise<void>;
  handleSetUser: (owner: DogWalker) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  setIsLoading: () => {},
  logout: () => {},
  setAuthTSession: async () => {},
  storeTokens: async () => {},
  handleSetUser: async (_owner: DogWalker) => {},
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<DogWalker | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTokens = async (
    newAccessToken: string,
    newRefreshToken: string,
    newUser: DogWalker,
  ) => {
    setIsLoading(true);
    try {
      await EncryptedStorage.setItem('accessToken', newAccessToken);
      await EncryptedStorage.setItem('refreshToken', newRefreshToken);
      await EncryptedStorage.setItem('user', JSON.stringify(newUser));

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthTSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const resultAccessToken = await EncryptedStorage.getItem('accessToken');
      const resultRefreshToken = await EncryptedStorage.getItem('refreshToken');
      const storedUser = await EncryptedStorage.getItem('user');

      if (resultAccessToken && resultRefreshToken && storedUser) {
        setAccessToken(resultAccessToken);
        setRefreshToken(resultRefreshToken);
        setUser(JSON.parse(storedUser));
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
      await EncryptedStorage.removeItem('user');
      setAccessToken(null);
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUser = async (newUser: DogWalker) => {
    await EncryptedStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        setIsLoading: handleLoading,
        logout: handleLogout,
        setAuthTSession,
        storeTokens: handleTokens,
        handleSetUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
