import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello I am Earth!';
  }
  getName(): string {
    return 'Hello I am Aphidet Jamphakhun!';
  }
}
