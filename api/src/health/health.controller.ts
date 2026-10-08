import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
export class HealthController {
  constructor() {}

  @Public()
  @Get('/health')
  getHealth() {
    return { status: 'ok' };
  }
}
