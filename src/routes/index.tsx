import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './tabs';
import {AuthStack} from './authStack';
import SplashScreen from '../components/splash/splash';
import {AuthContext} from '../contexts/authContext';

function Routes() {
  const {accessToken, isLoading, renewAccessToken} = useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {accessToken ? <Tabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default Routes;
