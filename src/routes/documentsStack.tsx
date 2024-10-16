import React from 'react';
import {StackHeaderProps, createStackNavigator} from '@react-navigation/stack';
import DocumentsScreen from '../screens/documents/documents';
import PhotoCaptureScreen from '../screens/documents/photoCaptureScreen/photoCaptureScreen';
import CustomHeader from '../components/header/customHeader';
import AboutMeScreen from '../screens/documents/aboutMe/aboutMeScreen';
import ApplicationFeedbackScreen from '../screens/documents/applicationFeedback/applicationFeedbackScreen';
import ProfileScreen from '../screens/documents/profileScreen/profileScreen';
const {Navigator, Screen} = createStackNavigator();

const customHeader = (props: StackHeaderProps) => <CustomHeader {...props} />;

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
        options={{header: customHeader, headerTransparent: true}}
      />
      <Screen
        name="AboutMe"
        component={AboutMeScreen}
        options={{header: customHeader, headerTransparent: true}}
      />
      <Screen
        name="Profile"
        component={ProfileScreen}
        options={{header: customHeader, headerTransparent: true}}
      />
      <Screen
        name="ApplicationFeedback"
        component={ApplicationFeedbackScreen}
        options={{headerShown: false}}
      />
    </Navigator>
  );
}
