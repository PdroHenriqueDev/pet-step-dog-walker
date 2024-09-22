import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './tabs';
import {AuthStack} from './authStack';
import SplashScreen from '../components/splash/splash';
import {useAuth} from '../contexts/authContext';
import {DocumentsStack} from './documentsStack';
import {DogWalkerApplicationStatus} from '../interfaces/dogWalkerApplicationStatus';
import ApplicationFeedbackScreen from '../screens/documents/applicationFeedback/applicationFeedbackScreen';

function Routes() {
  const {
    accessToken,
    refreshToken,
    isLoading,
    setAuthTSession,
    handleSetUser,
    user,
    userId,
  } = useAuth();

  useEffect(() => {
    setAuthTSession();
    handleSetUser();
  }, [handleSetUser, setAuthTSession]);

  // const {logout} = useAuth();
  // useEffect(() => {
  //   logout();
  // }, []);

  const renderContent = () => {
    if (isLoading) {
      return <SplashScreen />;
    }

    if (!accessToken || !refreshToken || !userId) {
      return <AuthStack />;
    }

    if (user?.status === DogWalkerApplicationStatus.PendingDocuments) {
      return <DocumentsStack />;
    }

    if (
      user?.status === DogWalkerApplicationStatus.PendingReview ||
      user?.status === DogWalkerApplicationStatus.Rejected
    ) {
      return <ApplicationFeedbackScreen />;
    }

    return <Tabs />;
  };

  return <NavigationContainer>{renderContent()}</NavigationContainer>;
}

export default Routes;
