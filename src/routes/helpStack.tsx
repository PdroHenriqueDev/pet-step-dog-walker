import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HelpScreen from '../screens/help/help';

const {Navigator, Screen} = createStackNavigator();

function HelpStack() {
  return (
    <Navigator>
      <Screen
        name="HistoryScreen"
        component={HelpScreen}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}

export default HelpStack;
