import api from './api';

export const getUnreadNotificationStatus = async (): Promise<any> => {
  try {
    const response = await api.get('notification/unread');
    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchNotifications = async (page = 1): Promise<any> => {
  try {
    const response = await api.get(`notification/list?page=${page}`);
    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<any> => {
  try {
    const response = await api.put(`notification/read/${notificationId}`);
    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<any> => {
  try {
    const response = await api.put('notification/mark-all-as-read');
    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
