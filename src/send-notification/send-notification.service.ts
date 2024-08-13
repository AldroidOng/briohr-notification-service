import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  GetNotificationRequest,
  NotificationStrategy,
  SendNotificationPayload,
  SendNotificationResp,
} from './types/types';
import { HappyBirthdayStrategy } from './strategy/happy-birthday.strategy';
import { LeaveBalanceReminderStrategy } from './strategy/leave-balance-reminder.strategy copy 2';
import { MonthlyPayslipStrategy } from './strategy/monthly-payslip.strategy';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'shared/schemas/User.schema';
import mongoose, { Model } from 'mongoose';
import { UserSettings } from 'shared/schemas/UserSettings.schema';
import { Notifications } from 'shared/schemas/Notifications.schema';
import {
  NotificationChannel,
  NotificationType,
} from 'shared/types/notification.types';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Companies } from 'shared/schemas/Companies.schema';
import { GetUserRequest, GetUserResponse } from 'shared/types/user-event.types';

@Injectable()
export class SendNotificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
    @InjectModel(Notifications.name)
    private notificationsModel: Model<Notifications>,
    @InjectModel(Companies.name)
    private companiesModel: Model<Companies>,
    @Inject('PROFILE') private readonly profileClient: ClientProxy,
  ) {}

  private readonly strategies: Map<NotificationType, NotificationStrategy> =
    new Map([
      [NotificationType.HappyBirthday, new HappyBirthdayStrategy()],
      [
        NotificationType.LeaveBalanceReminder,
        new LeaveBalanceReminderStrategy(),
      ],
      [NotificationType.MonthlyPayslip, new MonthlyPayslipStrategy()],
    ]);

  async sendNotification(sendNotificationRequest: SendNotificationPayload) {
    try {
      const strategy = this.strategies.get(
        sendNotificationRequest.notificationType,
      );

      if (!strategy) {
        throw new Error('Unknown notification type');
      }

      console.log('GET_USER_PROFILE_FROM_NOTIFICATION_SERVICE_REQUEST');

      let userProfile: GetUserResponse;

      try {
        const getUserPayload: GetUserRequest = {
          username: sendNotificationRequest.username,
        };

        userProfile = await firstValueFrom(
          this.profileClient.send({ cmd: 'get_user' }, getUserPayload),
        );
      } catch (error) {
        console.log(error.message);
        throw error;
      }

      console.log(
        'GET_USER_PROFILE_FROM_NOTIFICATION_SERVICE_RESPONSE',
        userProfile,
      );

      const sendNotificationResult: SendNotificationResp =
        await strategy.sendNotification(
          userProfile.username,
          userProfile.companyName,
          userProfile.channel,
        );

      console.log('SEND_NOTI_RESULT', sendNotificationResult);

      if (!sendNotificationResult.isNotified) {
        return 'No notification sent, could be due to user not subscribed to channel for that notifcation type';
      }

      let notificationsArr = [];
      for (let i = 0; i < sendNotificationResult.notifications.length; i++) {
        const notification = sendNotificationResult.notifications[i];
        notificationsArr.push({
          channel: notification.channel,
          contents: {
            content: notification.content,
            subject: notification.subject,
          },
          user: mongoose.Types.ObjectId.createFromHexString(userProfile.id),
        });
      }
      await this.notificationsModel.insertMany(notificationsArr);

      return 'User notified';
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getNotifcations(getNotificationRequest: GetNotificationRequest) {
    const getUserPayload: GetUserRequest = {
      username: getNotificationRequest.username,
    };

    const userProfile = await firstValueFrom(
      this.profileClient.send({ cmd: 'get_user' }, getUserPayload),
    );

    const uiNotifications = await this.notificationsModel.find({
      user: mongoose.Types.ObjectId.createFromHexString(userProfile.id),
      channel: NotificationChannel.UI,
    });

    const result = uiNotifications.map((notification) => {
      return notification.contents.content;
    });

    return result;
  }

  async seed() {
    const nameData = [
      {
        name: 'Email and UI User',
        email: 'email_and_ui@gmail.com',
      },
      {
        name: 'Email Only User',
        email: 'email_only@gmail.com',
      },
      {
        name: 'UI Only User',
        email: 'ui_only@gmail.com',
      },
    ];

    const userSettingsArray = [
      {
        channel: [NotificationChannel.Email, NotificationChannel.UI],
      },
      {
        channel: [NotificationChannel.Email],
      },
      {
        channel: [NotificationChannel.UI],
      },
    ];

    try {
      const userSettingsResult =
        await this.userSettingsModel.insertMany(userSettingsArray);
      const userSettingsIds = userSettingsResult.map((doc) => doc._id);

      const company = new this.companiesModel({ companyName: 'Briohr' });
      const companyId = await company.save();

      const usersToInsert = nameData.map((data, index) => ({
        username: data.name,
        email: data.email,
        company: companyId._id,
        settings: userSettingsIds[index], // Associate User with corresponding UserSettings
      }));

      const usersResult = await this.userModel.insertMany(usersToInsert);
      console.log(usersResult);
      console.log(userSettingsResult);
      return { userSettings: userSettingsResult, users: usersResult };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
