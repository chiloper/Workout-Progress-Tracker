import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

const DB_TIMEOUT_MS = 3000;
@Controller()
export class HealthController {
  constructor(private readonly prismaService: PrismaService) { }

  @Public()
  @Get('/health')
  async getHealth() {
    let timer: NodeJS.Timeout | undefined;
    try {
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() =>
          reject(new Error('DB health check timeout')),
          DB_TIMEOUT_MS
        )
      })
      await Promise.race([this.prismaService.$queryRaw`SELECT 1`, timeout])
      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException();
    } finally {
      clearTimeout(timer)
    }
  }
}
