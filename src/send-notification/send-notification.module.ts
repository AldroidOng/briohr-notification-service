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
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from 'shared/config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'PROFILE',
        useFactory: (configService: ConfigService): ClientOptions => ({
          transport: Transport.TCP,
          options: {
            host:
              configService.get<string>('PROFILE_MICROSERVICE_HOST') ||
              'localhost',
            port:
              parseInt(
                configService.get<string>('PROFILE_MICROSERVICE_PORT'),
                10,
              ) || 3002,
          },
        }),
        inject: [ConfigService],
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
