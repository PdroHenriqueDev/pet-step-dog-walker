import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {renewToken} from '../services/auth';

interface AuthContextProps {
  accessToken: string | null;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  logout: () => void;
  renewAccessToken: () => Promise<void>;
  storeTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  isLoading: false,
  setIsLoading: () => {},
  logout: () => {},
  renewAccessToken: async () => {},
  storeTokens: async () => {},
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTokens = async (accessToken: string, refreshToken: string) => {
    await EncryptedStorage.setItem('accessToken', accessToken);
    await EncryptedStorage.setItem('refreshToken', refreshToken);
    console.log('got here handleTokens =>', accessToken);
    setAccessToken(accessToken);
  };

  const handleLoading = (value: boolean) => {
    setIsLoading(value);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await EncryptedStorage.removeItem('accessToken');
      await EncryptedStorage.removeItem('refreshToken');
      setAccessToken(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renewAccessToken = async () => {
    const refreshToken = await EncryptedStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await renewToken(refreshToken);
        const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
          response.data;

        await handleTokens(newAccessToken, newRefreshToken);
        setAccessToken(newAccessToken);
      } catch (error) {
        console.error('Erro ao renovar o token:', error);
      }
    }
  };

  useEffect(() => {
    const loadStoredTokens = async () => {
      const storedAccessToken = await EncryptedStorage.getItem('accessToken');
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }
    };

    loadStoredTokens();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isLoading,
        setIsLoading: handleLoading,
        logout: handleLogout,
        renewAccessToken,
        storeTokens: handleTokens,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
