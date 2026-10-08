import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "./repository/auth.reposiitory";
import { LoginDto } from "./dto/login.dto";
import { AuthTokens, JwtPayLoad } from "./types/auth.types";
import { compare, hash } from "bcryptjs";
import { User } from "../../generated/client";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { type StringValue } from 'ms'
import { RegisterDto } from "./dto/register.dto";

const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.oOEmnhVbCk1S6nQfQK5jJx2fVJ0e";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async register(dto: RegisterDto): Promise<AuthTokens> {

    const exsting = await this.authRepository.findByEmail(dto.email);
    if (exsting) {
      throw new ConflictException("Email is alredy registred.");
    }

    const passwordHash = await hash(dto.password, 10);
    const user = await this.authRepository.createUser(
      dto.email,
      passwordHash
    )

    return this.issueToken(user)
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.authRepository.findByEmail(dto.email);

    const passwordHash = await compare(
      dto.password,
      user?.passwordHash ?? DUMMY_HASH
    )

    if (!user || !passwordHash) {
      throw new UnauthorizedException("Invalid email or password.");

    }
    return this.issueToken(user);
  }



  private async issueToken(user: User): Promise<AuthTokens> {
    const payload: JwtPayLoad = {
      sub: user.id,
      email: user.email
    }

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      expiresIn: this.accessTokenTtlSeconds(),
      user: { id: user.id, email: user.email }
    }
  }

  private accessTokenTtlSeconds(): number {
    const ttl = this.configService.get<string>("JWT_EXPIRES_IN") ?? "30D"
    const match = /^(\d+)([smhd])$/.exec(ttl.trim());

    if (!match) {
      return 900;
    }

    const amount = Number(match[1]);
    const unitSeconds: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return amount * (unitSeconds[match[2]] ?? 60);
  }
}