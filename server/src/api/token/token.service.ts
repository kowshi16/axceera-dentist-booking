import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Token } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(TokenService.name);

  async createToken(data: any): Promise<Token> {
    const existUserToken = await this.prisma.token.findMany({
      where: { userId: data.userId },
    });
    if (existUserToken?.length > 0) {
      return this.prisma.token.update({
        where: {
          id: existUserToken[0].id,
        },
        data: data,
      });
    } else {
      return this.prisma.token.create({
        data,
      });
    }
  }

  async deleteUser(where: Prisma.TokenWhereUniqueInput): Promise<Token> {
    return this.prisma.token.delete({
      where,
    });
  }
}
