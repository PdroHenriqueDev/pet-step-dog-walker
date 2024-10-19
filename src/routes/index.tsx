import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './tabs';
import {AuthStack} from './authStack';
import SplashScreen from '../components/splash/splash';
import {useAuth} from '../contexts/authContext';
import {DocumentsStack} from './documentsStack';
import {DogWalkerApplicationStatus} from '../interfaces/dogWalkerApplicationStatus';
import ApplicationFeedbackScreen from '../screens/documents/applicationFeedback/applicationFeedbackScreen';
import TermsOfService from '../components/termsOfService/termsOfService';
import messaging from '@react-native-firebase/messaging';
import {WalkEvents} from '../enum/walk';

function Routes() {
  const {
    accessToken,
    refreshToken,
    isLoading,
    setAuthTSession,
    fetchUser,
    user,
    userId,
    handleSetUser,
  } = useAuth();

  useEffect(() => {
    setAuthTSession();
    fetchUser();
  }, [fetchUser, setAuthTSession]);

  // const {logout} = useAuth();
  // useEffect(() => {
  //   logout();
  // }, []);

  // useEffect(() => {
  //   async function requestPermission() {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //     } else {
  //       console.log('Permissão de notificação negada.');
  //     }
  //   }

  //   requestPermission();
  // }, []);

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      const requestId = remoteMessage?.data?.requestId as string;
      if (requestId) {
        if (!user) return;

        handleSetUser({
          ...user,
          currentWalk: {
            requestId,
            status: WalkEvents.PENDING,
          },
        });
      }
    });

    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        const requestId = remoteMessage?.data?.requestId as string;
        if (requestId) {
          if (!user) return;

          handleSetUser({
            ...user,
            currentWalk: {
              requestId,
              status: WalkEvents.PENDING,
            },
          });
        }
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const requestId = remoteMessage?.data?.requestId as string;
          if (requestId) {
            if (!user) return;

            handleSetUser({
              ...user,
              currentWalk: {
                requestId,
                status: WalkEvents.PENDING,
              },
            });
          }
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeNotificationOpened();
    };
  }, [handleSetUser, user]);

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

    if (user?.status === DogWalkerApplicationStatus.PendingTerms) {
      return <TermsOfService />;
    }

    return <Tabs />;
  };

  return <NavigationContainer>{renderContent()}</NavigationContainer>;
}

export default Routes;
