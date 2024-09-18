import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './tabs';
import {AuthStack} from './authStack';
import SplashScreen from '../components/splash/splash';
import {AuthContext} from '../contexts/authContext';
import {DocumentsStack} from './documentsStack';
import {DogWalkerApplicationStatus} from '../interfaces/dogWalkerApplicationStatus';

function Routes() {
  const {accessToken, refreshToken, isLoading, setAuthTSession, user} =
    useContext(AuthContext);

  useEffect(() => {
    setAuthTSession();
  }, [setAuthTSession]);

  const renderContent = () => {
    if (isLoading) {
      return <SplashScreen />;
    }

    if (!accessToken && !refreshToken && !user) {
      return <AuthStack />;
    }

    if (user?.status === DogWalkerApplicationStatus.PendingDocuments) {
      return <DocumentsStack />;
    }

    return <Tabs />;
  };

  return <NavigationContainer>{renderContent()}</NavigationContainer>;
}

export default Routes;
