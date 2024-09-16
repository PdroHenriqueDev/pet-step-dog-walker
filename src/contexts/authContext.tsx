import React, {createContext, useContext, useState, ReactNode} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

interface AuthContextProps {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  logout: () => void;
  setAuthTokens: () => Promise<void>;
  storeTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  setIsLoading: () => {},
  logout: () => {},
  setAuthTokens: async () => {},
  storeTokens: async () => {},
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTokens = async (
    newAccessToken: string,
    newRefreshToken: string,
  ) => {
    await EncryptedStorage.setItem('accessToken', newAccessToken);
    await EncryptedStorage.setItem('refreshToken', newRefreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const setAuthTokens = async () => {
    const resultAccessToken = await EncryptedStorage.getItem('accessToken');
    const resultRefreshToken = await EncryptedStorage.getItem('refreshToken');
    setAccessToken(resultAccessToken);
    setRefreshToken(resultRefreshToken);
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

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isLoading,
        setIsLoading: handleLoading,
        logout: handleLogout,
        setAuthTokens,
        storeTokens: handleTokens,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
