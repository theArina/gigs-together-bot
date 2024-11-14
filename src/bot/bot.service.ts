import { Injectable } from '@nestjs/common';
import axios from '../common/axios';
import { MessageDto, SendMessageDto } from './dto/message.dto';
import { UserService } from '../user/user.service';

enum Command {
  Start = 'start',
  Suggest = 'suggest',
}

@Injectable()
export class BotService {
  constructor(private readonly userService: UserService) {}

  async isAdmin(telegramId: number): Promise<boolean> {
    return this.userService.isAdmin(telegramId);
  }

  private async sendMessage({ chatId, text }: SendMessageDto): Promise<void> {
    const params = {
      chat_id: chatId, // 1-4096 characters after entities parsing
      text,
    };

    return axios.get('sendMessage', { params });
  }

  async handleMessage(message: MessageDto): Promise<void> {
    if (!message) {
      return;
    }
    const messageText = message.text || '';
    const chatId = message.chat.id;

    if (messageText.charAt(0) !== '/') {
      await this.sendMessage({
        chatId,
        text: `You said: "${messageText}"`,
      });
      return;
    }

    const command = messageText.substring(1).toLowerCase();
    await this.handleCommand(command, chatId);
  }

  private async handleCommand(command: string, chatId: number) {
    switch (command) {
      case Command.Start:
        await this.sendMessage({
          chatId,
          text: `Hi! I'm a Gigs Together bot. I am still in development...`,
        });
        break;
      case Command.Suggest:
        await this.sendMessage({
          chatId,
          text: `Suggest command is currently in development. Keep it together!`,
        });
        break;
      default: {
        await this.sendMessage({
          chatId,
          text: `Hey there, I don't know that command.`,
        });
      }
    }
  }
}
