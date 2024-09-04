import React, {useLayoutEffect} from 'react';
import {StackHeaderProps, createStackNavigator} from '@react-navigation/stack';
import NotificationHeader from '../components/header/notificationHeader';
import CustomHeader from '../components/header/customHeader';
import {useAppNavigation} from '../hooks/useAppNavigation';
import Home from '../screens/home';

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
        component={Home}
        options={{
          header: notificationHeader,
        }}
      />
    </Navigator>
  );
}

export default HomeStack;
