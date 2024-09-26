import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async isPasswordValid(password: string, userPassword: string) {
    return await bcrypt.compareSync(password, userPassword);
  }

  async hashPassword(password: string) {
    const salt: string = bcrypt.genSaltSync(10);
    return await bcrypt.hashSync(password, salt);
  }

  async comparePassword(plainTextPass: string, hashedPass: string) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(
        plainTextPass,
        hashedPass,
        (err: string, result: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  async createAccessToken(id: number, email: string, role: string) {
    return await this.jwtService.signAsync(
      {
        id,
        email,
        role,
        isAccess: true,
      },
      { expiresIn: '1w' },
    );
  }

  async createRefreshToken(id: number, email: string, role: string) {
    return await this.jwtService.signAsync({
      id,
      email,
      role,
      isAccess: false,
    });
  }

  async verifyToken(token: string) {
    try {
      const accessToken = token.replace('Bearer ', '');
      const decoded = await this.jwtService.verifyAsync(accessToken);
      if (!decoded) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return decoded;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
