import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Account from '../screens/account/account';

const {Navigator, Screen} = createStackNavigator();

function AccountStack() {
  return (
    <Navigator>
      <Screen
        name="AccountScreen"
        component={Account}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}

export default AccountStack;
