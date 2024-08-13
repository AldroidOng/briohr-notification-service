import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SendNotificationService } from './send-notification.service';
import { GetNotificationRequest, SendNotificationMessage } from './types/types';

@Controller('send-notification')
export class SendNotificationController {
  constructor(
    private readonly sendNotificationService: SendNotificationService,
  ) {}

  @MessagePattern('test_notification_service')
  test() {
    return 'Notification Service is up!';
  }

  @MessagePattern({ cmd: 'send_notification' })
  async sendNotification(@Payload() data: SendNotificationMessage) {
    return this.sendNotificationService.sendNotification(data);
  }

  @MessagePattern({ cmd: 'get_ui_notifications' })
  async getNotifcations(@Payload() data: GetNotificationRequest) {
    return this.sendNotificationService.getNotifcations(data);
  }

  @MessagePattern({ cmd: 'seed' })
  async seed() {
    return this.sendNotificationService.seed();
  }
}
