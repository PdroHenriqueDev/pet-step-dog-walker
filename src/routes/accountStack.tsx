import React from 'react';
import {createStackNavigator, StackHeaderProps} from '@react-navigation/stack';
import Account from '../screens/account/account';
import UpdateUser from '../screens/account/updateUser/updateUser';
import CustomHeader from '../components/header/customHeader';
import BankScreen from '../screens/account/bank/addBank/bankScreen';
import BankFlowScreen from '../screens/account/bank/bankFlowScreen';
import BankUploadDocument from '../screens/account/bank/uploadDocumentBank/uploadDocumentBank';

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
      <Screen
        name="BankFlowScreen"
        component={BankFlowScreen}
        options={{header: customHeader, headerTransparent: true}}
      />
      <Screen
        name="BankScreen"
        component={BankScreen}
        options={{header: customHeader, headerTransparent: true}}
      />
      <Screen
        name="BankUploadDocumentScreen"
        component={BankUploadDocument}
        options={{header: customHeader, headerTransparent: true}}
      />
    </Navigator>
  );
}

export default AccountStack;
