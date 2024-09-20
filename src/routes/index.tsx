import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './tabs';
import {AuthStack} from './authStack';
import SplashScreen from '../components/splash/splash';
import {AuthContext, useAuth} from '../contexts/authContext';
import {DocumentsStack} from './documentsStack';
import {DogWalkerApplicationStatus} from '../interfaces/dogWalkerApplicationStatus';
import {getDogWalkerById} from '../services/dogWalkerService';
import ApplicationFeedbackScreen from '../screens/documents/applicationFeedback/applicationFeedbackScreen';

function Routes() {
  const {accessToken, refreshToken, isLoading, setAuthTSession, setUser, user} =
    useContext(AuthContext);

  useEffect(() => {
    setAuthTSession();
  }, [setAuthTSession]);

  useEffect(() => {
    const getDogWalker = async () => {
      if (!user) return;
      try {
        const result = await getDogWalkerById(user?._id as string);
        if (JSON.stringify(result) !== JSON.stringify(user)) {
          setUser(result);
        }
      } catch (error) {}
    };

    getDogWalker();
  }, [setUser, user]);

  // const {logout} = useAuth();
  // useEffect(() => {
  //   logout();
  // }, []);

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

    if (user?.status === DogWalkerApplicationStatus.PendingReview) {
      return <ApplicationFeedbackScreen />;
    }

    return <Tabs />;
  };

  return <NavigationContainer>{renderContent()}</NavigationContainer>;
}

export default Routes;
