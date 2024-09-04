import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './tabs';
import {AuthStack} from './authStack';
import SplashScreen from '../components/splash/splash';

function Routes() {
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {userToken ? <Tabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default Routes;
