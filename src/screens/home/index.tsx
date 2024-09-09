import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {renewToken} from '../../services/auth';

export default function Home() {
  const storeTokens = async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  };

  useEffect(() => {
    const newToken = async () => {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await renewToken(refreshToken);
          const {accessToken, refreshToken: newRefreshToken} = response.data;
          await storeTokens({accessToken, refreshToken: newRefreshToken});
        } catch (error) {
          console.log('Erro ao renovar token:', error);
        }
      }
    };

    newToken();
  }, []);

  return (
    <View>
      <Text>oi</Text>
    </View>
  );
}
