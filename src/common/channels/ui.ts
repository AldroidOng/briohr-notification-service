import { ChannelSendResp } from 'src/send-notification/types/types';

export class UI {
  constructor() {}

  static async send(content: any): Promise<ChannelSendResp> {
    console.log(content);
    return content;
  }
}
