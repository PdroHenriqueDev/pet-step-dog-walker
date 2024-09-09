import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';
import HomeStack from './homeStack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import HomeIcon from '../components/icons/home';

const {Navigator, Screen} = createBottomTabNavigator();

export function Tabs() {
  return (
    <Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: colors.dark,
        tabBarInactiveTintColor: colors.accent,
        tabBarStyle: globalStyles.tabar,
        tabBarLabelStyle: globalStyles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      })}>
      <Screen
        name="Home"
        component={HomeStack}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';
          const isHiddenRoute = routeName !== 'HomeScreen';

          return {
            tabBarIcon: HomeIcon,
            headerShown: false,
            tabBarStyle: {
              ...globalStyles.tabar,
              display: isHiddenRoute ? 'none' : 'flex',
            },
          };
        }}
      />
    </Navigator>
  );
}
