import { Module } from '@nestjs/common';
import { SendNotificationModule } from './send-notification/send-notification.module';
import { DatabaseModule } from 'shared';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [SendNotificationModule, DatabaseModule],
})
export class AppModule {}
