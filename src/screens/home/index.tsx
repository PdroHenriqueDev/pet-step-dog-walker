import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useAuth} from '../../contexts/authContext';

export default function Home() {
  const {logout} = useAuth();
  useEffect(() => {
    // logout();
  }, []);

  return (
    <View>
      <Text>Home screen here</Text>
    </View>
  );
}
