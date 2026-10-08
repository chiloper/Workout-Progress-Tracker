import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.reposiitory';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error(' JWT_SECRET is not set.');
        }
        const expiresIn = (process.env.JWT_EXPIRES_IN ?? '30D') as NonNullable<
          JwtModuleOptions['signOptions']
        >['expiresIn'];
        return { secret, signOptions: { expiresIn } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
