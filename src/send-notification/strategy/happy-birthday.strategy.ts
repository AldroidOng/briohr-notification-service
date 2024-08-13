import { Email } from 'src/common/channels/email';
import {
  ChannelSendResp,
  NotificationStrategy,
  SendNotificationResp,
} from '../types/types';
import { UI } from 'src/common/channels/ui';
import { NotificationChannel } from 'shared/types/notification.types';

export class HappyBirthdayStrategy implements NotificationStrategy {
  async sendNotification(
    name: string,
    companyName: string,
    channel: NotificationChannel[],
  ): Promise<SendNotificationResp> {
    const result = {
      notifications: [],
      isNotified: false,
    };

    const emailContent = {
      subject: `Happy Birthday ${name}`,
      content: `${companyName} is wishing you a happy birthday`,
    };

    const uiContent = {
      content: `Happy Birthday ${name}`,
    };

    if (channel.length !== 0) {
      try {
        const promises = [];

        channel.forEach((element) => {
          if (element === NotificationChannel.Email) {
            promises.push(Email.send(emailContent));
          } else if (element === NotificationChannel.UI) {
            promises.push(UI.send(uiContent));
          }
        });

        const contents: ChannelSendResp[] = await Promise.all(promises);

        for (let i = 0; i < channel.length; i++) {
          const contentSent = contents[i];
          result.notifications.push({
            channel: channel[i],
            content: contentSent.content,
            subject: contentSent.subject,
          });
        }

        result.isNotified = true;
        return result;
      } catch (error) {
        console.error('Error sending notification', error);
      }
    }
    return result;
  }
}
