import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('api/v2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Authentication Sesion' })
  async signIn(@Req() req) {
    return await this.authService.signIn(req.body);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Authentication Register User' })
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }
}
