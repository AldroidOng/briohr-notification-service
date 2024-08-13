import {
  NotificationChannel,
  NotificationType,
} from 'shared/types/notification.types';

export interface SendNotificationPayload {
  notificationType: NotificationType;
  username: string;
}
export interface GetNotificationRequest {
  username: string;
}
export interface SendNotificationResp {
  notifications: {
    channel: NotificationChannel;
    content: string;
    subject?: string;
  }[];
  isNotified: boolean;
}

export interface ChannelSendResp {
  subject?: string;
  content: string;
}
export interface NotificationStrategy {
  sendNotification(
    name: string,
    companyName: string,
    channel: NotificationChannel[],
  ): Promise<SendNotificationResp>;
}

export class SendNotificationEvent {
  constructor(
    public readonly notificationType: NotificationType,
    public readonly userId: string,
  ) {}
}

export class SendNotificationMessage {
  constructor(
    public readonly notificationType: NotificationType,
    public readonly username: string,
  ) {}
}
