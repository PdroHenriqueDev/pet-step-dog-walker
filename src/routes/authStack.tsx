import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AuthScreen from '../screens/auth/auth';
const {Navigator, Screen} = createStackNavigator();

export function AuthStack() {
  return (
    <Navigator>
      <Screen
        name="SignUp"
        component={AuthScreen}
        options={{headerShown: false}}
      />
    </Navigator>
  );
}
