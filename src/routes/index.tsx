import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { Tabs } from './tabs';

function Routes() {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}

export default Routes;
