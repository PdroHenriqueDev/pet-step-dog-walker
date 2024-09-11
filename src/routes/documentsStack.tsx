import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DocumentsScreen from '../screens/documents/documents';
import PhotoCaptureScreen from '../screens/documents/photoCaptureScreen/photoCaptureScreen';
const {Navigator, Screen} = createStackNavigator();

export function DocumentsStack() {
  return (
    <Navigator>
      <Screen
        name="Documents"
        component={DocumentsScreen}
        options={{headerShown: false}}
      />
      <Screen
        name="PhotoCapture"
        component={PhotoCaptureScreen}
        options={{headerShown: false}}
      />
    </Navigator>
  );
}
