import React, {useCallback, useState} from 'react';
import {View, Platform, TouchableOpacity} from 'react-native';
import {Icon} from '@rneui/base';
import {getUnreadNotificationStatus} from '../../services/notification';
import {useFocusEffect} from '@react-navigation/native';
import {useAppNavigation} from '../../hooks/useAppNavigation';

function NotificationHeader() {
  const {navigation} = useAppNavigation();

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUnreadNotificationStatus = async () => {
        try {
          const {hasUnread} = await getUnreadNotificationStatus();
          setHasUnreadNotifications(hasUnread);
        } catch (error) {
          console.error(
            'Erro ao buscar status de notificações não lidas:',
            error,
          );
        }
      };

      fetchUnreadNotificationStatus();
    }, []),
  );

  const handleNavigateToNotifications = () => {
    navigation.navigate('NotificationList');
  };

  return (
    <View
      className={`flex items-end ${
        Platform.OS === 'ios' ? 'pt-20' : 'pt-5'
      } bg-primary px-5`}>
      <TouchableOpacity onPress={handleNavigateToNotifications}>
        <View className="relative p-1 border border-border rounded-xl">
          {hasUnreadNotifications && (
            <View className="absolute -right-1.5 -top-0.75 bg-danger rounded-full w-4 h-4 flex items-center justify-center" />
          )}

          <Icon type="material" name="notifications-none" size={22} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default NotificationHeader;
