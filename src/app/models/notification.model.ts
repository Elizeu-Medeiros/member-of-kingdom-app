export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  actionText?: string;
  data?: any;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  actionable: boolean;
  data?: any;
  userId?: number;
  userName?: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'event' | 'member' | 'system';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type ActivityType = 'member' | 'event' | 'visitor' | 'announcement' | 'system' | 'donation' | 'birthday';

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  todayCount: number;
  priorityDistribution: { [key: string]: number };
  typeDistribution: { [key: string]: number };
}
