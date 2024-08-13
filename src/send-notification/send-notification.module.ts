import { Module } from '@nestjs/common';
import { SendNotificationService } from './send-notification.service';
import { SendNotificationController } from './send-notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'shared/schemas/User.schema';
import {
  UserSettings,
  UserSettingsSchema,
} from 'shared/schemas/UserSettings.schema';
import {
  Notifications,
  NotificationsSchema,
} from 'shared/schemas/Notifications.schema';
import { Companies, CompaniesSchema } from 'shared/schemas/Companies.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROFILE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserSettings.name,
        schema: UserSettingsSchema,
      },
      {
        name: Notifications.name,
        schema: NotificationsSchema,
      },
      {
        name: Companies.name,
        schema: CompaniesSchema,
      },
    ]),
  ],
  providers: [SendNotificationService],
  controllers: [SendNotificationController],
})
export class SendNotificationModule {}
