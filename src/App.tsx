import './styles/global.css';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import Routes from './routes';
import {DialogProvider} from './contexts/dialogContext';
import {AuthProvider} from './contexts/authContext';

function App(): React.JSX.Element {
  const handleToken = async () => {
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    }
    await requestUserPermission();
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }

    const token = await messaging().getToken();
    console.log('got token', token);
  };

  useEffect(() => {
    handleToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthProvider>
      <DialogProvider>
        <Routes />
      </DialogProvider>
    </AuthProvider>
  );
}

export default App;
