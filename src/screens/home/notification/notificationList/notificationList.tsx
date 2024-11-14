import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Icon} from '@rneui/base';
import colors from '../../../../styles/colors';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from '../../../../services/notification';
import {Notification} from '../../../../interfaces/notification';
import {useAppNavigation} from '../../../../hooks/useAppNavigation';
import {AxiosError} from 'axios';
import {useDialog} from '../../../../contexts/dialogContext';
import {PlataformEnum} from '../../../../enum/platform.enum';

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {navigation} = useAppNavigation();
  const {showDialog, hideDialog} = useDialog();

  const loadNotifications = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const {results, hasMore: moreNotifications} =
        await fetchNotifications(page);

      setNotifications(prevNotifications => [...prevNotifications, ...results]);
      setPage(page + 1);
      setHasMore(moreNotifications);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) loadNotifications();
  };

  const goToNotificationDetail = (item: Notification) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification._id === item._id
          ? {...notification, read: true}
          : notification,
      ),
    );

    navigation.navigate('NotificationDetail', {notification: item});
  };

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      await markAllNotificationsAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({...notification, read: true})),
      );
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError &&
        typeof error.response?.data?.data === 'string'
          ? error.response?.data?.data
          : 'Ocorreu um erro inesperado';
      showDialog({
        title: errorMessage,
        confirm: {
          confirmLabel: 'Entendi',
          onConfirm: () => {
            hideDialog();
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderNotificationItem = ({item}: {item: Notification}) => (
    <TouchableOpacity
      onPress={() => goToNotificationDetail(item)}
      className={` border-b border-border ${
        item.read ? 'bg-primary' : 'bg-accent'
      }`}>
      <View className="flex-row items-center p-4">
        <Icon
          name={
            item.type === 'message'
              ? 'message'
              : item.type === 'walk'
                ? 'pets'
                : 'star'
          }
          type="material"
          size={24}
          color={colors.dark}
          containerStyle={{marginRight: 12}}
        />
        <View className="flex-1">
          <Text className="font-bold text-dark">{item.title}</Text>
          <Text className={`${item.read ? 'text-accent' : 'text-dark'}`}>
            {item.message}
          </Text>
        </View>
        <Text className={`${item.read ? 'text-accent' : 'text-dark'} text-sm`}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      className={`flex-1 bg-primary ${
        Platform.OS === PlataformEnum.IOS ? 'pt-32 px-5' : 'p-5'
      } `}>
      <View className="flex flex-row justify-between items-end  mb-4">
        <Text className="text-3xl font-bold text-dark">Notificações</Text>

        {notifications.length > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-base text-secondary font-semibold">
              Ler tudo
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        className="mb-6"
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item._id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="small" color={colors.secondary} />
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center mt-10">
              <Text className="text-gray-500">Nenhuma notificação.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
