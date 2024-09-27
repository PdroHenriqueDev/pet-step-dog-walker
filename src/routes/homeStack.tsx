import React, {useLayoutEffect} from 'react';
import {StackHeaderProps, createStackNavigator} from '@react-navigation/stack';
import NotificationHeader from '../components/header/notificationHeader';
import CustomHeader from '../components/header/customHeader';
import {useAppNavigation} from '../hooks/useAppNavigation';
import HomeScreen from '../screens/home/homeScreen';
import WalkInProgressScreen from '../screens/home/walkInProgress/walkInProgress';
import WalkRequestScreen from '../screens/home/walk/walkRequestScreen';

const {Navigator, Screen} = createStackNavigator();

const notificationHeader = (props: StackHeaderProps) => (
  <NotificationHeader {...props} />
);

const customHeader = (props: StackHeaderProps) => <CustomHeader {...props} />;

function HomeStack() {
  const {navigation, route} = useAppNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      const tabBarVisible = true;
      parent.setOptions({
        tabBarStyle: {
          display: tabBarVisible ? 'flex' : 'none',
        },
      });
    }
  }, [navigation, route]);

  return (
    <Navigator>
      <Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          header: notificationHeader,
        }}
      />
      <Screen
        name="WalkRequest"
        component={WalkRequestScreen}
        options={{headerShown: false}}
      />
      <Screen
        name="WalkInProgress"
        component={WalkInProgressScreen}
        options={{header: customHeader, headerTransparent: true}}
      />
    </Navigator>
  );
}

export default HomeStack;
