import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './tabs';
import {AuthStack} from './authStack';
import SplashScreen from '../components/splash/splash';
import {AuthContext} from '../contexts/authContext';
import DocumentsScreen from '../screens/documents/documents';

function Routes() {
  const {accessToken, isLoading, renewAccessToken} = useContext(AuthContext);
  const [documentsPending, setDocumentsPending] = useState(true);

  // useEffect(() => {
  //   if (accessToken) {
  //     const checkDocuments = async () => {
  //       const response = await fetch('/api/checkDocuments', {
  //         headers: {Authorization: `Bearer ${accessToken}`},
  //       });
  //       const result = await response.json();
  //       setDocumentsUploaded(result.documentsUploaded);
  //     };

  //     checkDocuments();
  //   }
  // }, [accessToken]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (documentsPending) {
    return <DocumentsScreen />;
  }

  return (
    <NavigationContainer>
      {accessToken ? <Tabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default Routes;
