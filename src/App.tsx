import './styles/global.css';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import Routes from './routes';
import {DialogProvider} from './contexts/dialogContext';
import {AuthProvider} from './contexts/authContext';

function App(): React.JSX.Element {
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
