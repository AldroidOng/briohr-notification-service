import { Test, TestingModule } from '@nestjs/testing';
import { SendNotificationController } from './send-notification.controller';

describe('SendNotificationController', () => {
  let controller: SendNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendNotificationController],
    }).compile();

    controller = module.get<SendNotificationController>(SendNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
