import React, {useContext, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './tabs';
import {AuthStack} from './authStack';
import SplashScreen from '../components/splash/splash';
import {AuthContext} from '../contexts/authContext';
import {DocumentsStack} from './documentsStack';

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

  const renderContent = () => {
    if (!accessToken) {
      return <AuthStack />;
    }

    if (documentsPending) {
      return <DocumentsStack />;
    }

    return <Tabs />;
  };

  return <NavigationContainer>{renderContent()}</NavigationContainer>;
}

export default Routes;
