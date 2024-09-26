import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WalkRequestScreen from '../screens/walk/walkRequestScreen';

const {Navigator, Screen} = createStackNavigator();

export function WalkStack() {
  return (
    <Navigator>
      <Screen
        name="WalkRequest"
        component={WalkRequestScreen}
        options={{headerShown: false}}
      />
    </Navigator>
  );
}
