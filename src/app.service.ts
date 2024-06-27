import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to the API Server for Cashbook - Multi-tenant Financial Management Platform!';
  }
}
