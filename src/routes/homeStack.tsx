import React, {useLayoutEffect} from 'react';
import {StackHeaderProps, createStackNavigator} from '@react-navigation/stack';
import NotificationHeader from '../components/notificationHeader/notificationHeader';
import CustomHeader from '../components/header/customHeader';
import {useAppNavigation} from '../hooks/useAppNavigation';
import HomeScreen from '../screens/home/homeScreen';
import WalkInProgressScreen from '../screens/home/walkInProgress/walkInProgress';
import WalkRequestScreen from '../screens/home/walk/walkRequestScreen';
import WalkMapScreen from '../screens/home/walkMap/walkMapScreen';
import Chat from '../screens/home/chat/chat';
import NotificationList from '../screens/home/notification/notificationList/notificationList';
import NotificationDetail from '../screens/home/notification/notificationDetail/notificationDetail';

const {Navigator, Screen} = createStackNavigator();

const notificationHeader = () => <NotificationHeader />;

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
      <Screen
        name="WalkMap"
        component={WalkMapScreen}
        options={{header: customHeader, headerTransparent: true}}
      />
      <Screen
        name="Chat"
        component={Chat}
        options={{header: customHeader, headerTransparent: true}}
      />
      <Screen
        name="NotificationList"
        component={NotificationList}
        options={{
          header: customHeader,
          headerTransparent: true,
        }}
      />
      <Screen
        name="NotificationDetail"
        component={NotificationDetail}
        options={{
          header: customHeader,
          headerTransparent: true,
        }}
      />
    </Navigator>
  );
}

export default HomeStack;
