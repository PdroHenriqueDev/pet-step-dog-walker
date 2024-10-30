import React from 'react';
import {createStackNavigator, StackHeaderProps} from '@react-navigation/stack';
import AuthScreen from '../screens/auth/auth';
import ForgotPasswordScreen from '../screens/auth/forgot-password/forgotPasswordScreen';
import CustomHeader from '../components/header/customHeader';
const {Navigator, Screen} = createStackNavigator();

const customHeader = (props: StackHeaderProps) => <CustomHeader {...props} />;

export function AuthStack() {
  return (
    <Navigator>
      <Screen
        name="SignUp"
        component={AuthScreen}
        options={{headerShown: false}}
      />
      <Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{header: customHeader, headerTransparent: true}}
      />
    </Navigator>
  );
}
