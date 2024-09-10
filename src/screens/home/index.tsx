import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useAuth} from '../../contexts/authContext';

export default function Home() {
  const {logout} = useAuth();
  useEffect(() => {
    // const newToken = async () => {
    //   const refreshToken = await EncryptedStorage.getItem('refreshToken');
    //   if (refreshToken) {
    //     try {
    //       const response = await renewToken(refreshToken);
    //       const {accessToken, refreshToken: newRefreshToken} = response.data;
    //       await storeTokens({accessToken, refreshToken: newRefreshToken});
    //     } catch (error) {
    //       console.log('Erro ao renovar token:', error);
    //     }
    //   }
    // };
    // newToken();
    // logout();
  }, []);

  return (
    <View>
      <Text>Home screen here</Text>
    </View>
  );
}
