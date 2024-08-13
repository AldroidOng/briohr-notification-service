import { Module } from '@nestjs/common';
import { SendNotificationModule } from './send-notification/send-notification.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, DatabaseModule } from './shared';

@Module({
  imports: [SendNotificationModule, DatabaseModule, ConfigModule],
})
export class AppModule {}
