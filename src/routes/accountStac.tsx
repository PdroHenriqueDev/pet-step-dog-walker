import React from 'react';
import {createStackNavigator, StackHeaderProps} from '@react-navigation/stack';
import Account from '../screens/account/account';
import UpdateUser from '../screens/account/updateUser/updateUser';
import CustomHeader from '../components/header/customHeader';

const {Navigator, Screen} = createStackNavigator();

const customHeader = (props: StackHeaderProps) => <CustomHeader {...props} />;

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
      <Screen
        name="UpdateUserScreen"
        component={UpdateUser}
        options={{header: customHeader, headerTransparent: true}}
      />
    </Navigator>
  );
}

export default AccountStack;
