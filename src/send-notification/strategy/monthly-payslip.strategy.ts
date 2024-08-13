import { Email } from 'src/common/channels/email';
import { NotificationStrategy, SendNotificationResp } from '../types/types';
import { NotificationChannel } from 'shared/types/notification.types';

export class MonthlyPayslipStrategy implements NotificationStrategy {
  async sendNotification(
    name: string,
    companyName: string,
    channel: NotificationChannel[],
  ): Promise<SendNotificationResp> {
    let result = {
      notifications: [],
      isNotified: false,
    };

    const emailContent = {
      subject: `Happy Birthday ${name}`,
      content: `${companyName} is wishing you a happy birthday`,
    };

    if (channel.includes(NotificationChannel.Email)) {
      try {
        const emailResult = await Email.send(emailContent);

        return {
          notifications: [
            {
              channel: NotificationChannel.Email,
              content: emailResult.content,
              subject: emailResult.subject,
            },
          ],
          isNotified: true,
        };
      } catch (error) {
        console.error('Error sending notification', error);
      }
    }
    return result;
  }
}
