import { Email } from 'src/common/channels/email';
import { NotificationStrategy, SendNotificationResp } from '../types/types';
import { UI } from 'src/common/channels/ui';
import { NotificationChannel } from 'shared/types/notification.types';

export class LeaveBalanceReminderStrategy implements NotificationStrategy {
  async sendNotification(
    name: string,
    _companyName: string,
    channel: NotificationChannel[],
  ): Promise<SendNotificationResp> {
    let result = {
      notifications: [],
      isNotified: false,
    };

    const uiContent = {
      content: `Happy Birthday ${name}`,
    };

    if (channel.includes(NotificationChannel.UI)) {
      try {
        const uiResult = await UI.send(uiContent);
        result = {
          notifications: [
            {
              channel: NotificationChannel.UI,
              content: uiResult.content,
              subject: uiResult.subject,
            },
          ],
          isNotified: true,
        };
        return result;
      } catch (error) {
        console.error('Error sending notification', error);
      }
    }

    return result;
  }
}
