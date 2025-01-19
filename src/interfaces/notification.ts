import {NotificationEnum} from '../enum/notification';
import {UserRole} from '../enum/role';

export interface Notification {
  _id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  type: NotificationEnum;
  createdAt: Date;
  read: boolean;
  extraData?: Record<string, unknown>;
}
