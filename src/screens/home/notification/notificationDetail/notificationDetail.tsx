import React, {useEffect} from 'react';
import {View, Text, Platform} from 'react-native';
import {Notification} from '../../../../interfaces/notification';
import {markNotificationAsRead} from '../../../../services/notification';
import {useAppNavigation} from '../../../../hooks/useAppNavigation';
import CustomButton from '../../../../components/customButton';
import {useAuth} from '../../../../contexts/authContext';
import {WalkEvents} from '../../../../enum/walk';
import {PlataformEnum} from '../../../../enum/platform.enum';
import {NotificationEnum} from '../../../../enum/notification';

const walkScreens = {
  [WalkEvents.PENDING]: 'WalkRequest',
  [WalkEvents.ACCEPTED_SUCCESSFULLY]: 'WalkInProgress',
  [WalkEvents.IN_PROGRESS]: 'WalkMap',
} as any;

export default function NotificationDetail() {
  const {user} = useAuth();
  const {route, navigation} = useAppNavigation();

  const {notification} = route.params as {notification: Notification};

  useEffect(() => {
    if (!notification.read) {
      markNotificationAsRead(notification._id);
    }
  }, [notification]);

  const handleWalk = () => {
    if (user?.currentWalk) {
      const {status} = user?.currentWalk;

      navigation.navigate(walkScreens[status]);
    }
  };

  return (
    <View
      className={`flex-1 bg-primary ${
        Platform.OS === PlataformEnum.IOS ? 'px-5 py-24' : 'p-5'
      }`}>
      <View className="mt-4">
        <Text className="text-2xl font-bold text-dark mb-2 text-center">
          {notification.title}
        </Text>
        <Text className="text-lg text-dark">{notification.message}</Text>
      </View>

      {notification.type === NotificationEnum.Walk && user?.currentWalk && (
        <View className="mt-5">
          <CustomButton label={'Acompanhar passeio'} onPress={handleWalk} />
        </View>
      )}
    </View>
  );
}
