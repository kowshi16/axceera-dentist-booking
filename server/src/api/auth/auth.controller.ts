import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';
import { Public } from 'src/common/decorator/public.decorator';
import { UserService } from '../user/user.service';
import { LoginDto } from './auth.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../role/role.service';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService,
    private roleService: RoleService,
  ) {}

  /*Login*/
  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    const user = await this.userService.user({ email: body.email });

    if (!user) throw new BadRequestException('Email or password is invalid.');

    if (!(await this.authService.isPasswordValid(body.password, user.password)))
      throw new BadRequestException('Email or password is invalid.');

    // Fetch the role name using the roleId
    const role = await this.roleService.findRoleById(user.roleId);

    if (!role) throw new BadRequestException('User role not found.');

    const accessToken = await this.authService.createAccessToken(
      user.id,
      user.email,
      role.name,
    );
    const refreshToken = await this.authService.createRefreshToken(
      user.id,
      user.email,
      role.name,
    );
    await this.tokenService.createToken({
      userId: user.id,
      token: refreshToken,
    });

    return {
      data: { token: accessToken, refreshToken, role: role.name },
    };
  }
}
