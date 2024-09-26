import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import History from '../screens/history/history';

const {Navigator, Screen} = createStackNavigator();

function HistoryStack() {
  return (
    <Navigator>
      <Screen
        name="HistoryScreen"
        component={History}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}

export default HistoryStack;
