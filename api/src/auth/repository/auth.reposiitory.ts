import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { User } from "../../../generated/client";

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email }
    })
  }

  async createUser(
    email:string,
    passwordHash:string
  ): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email,
        passwordHash,
      }
    })
  }
}