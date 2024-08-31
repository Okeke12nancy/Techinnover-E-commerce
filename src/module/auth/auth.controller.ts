import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from '../../module/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto): Promise<User> {
    const existingUser = await this.authService.findByEmail(
      createAuthDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    return this.authService.createUser(createAuthDto);
  }

  @Post('login')
  async login(@Body() req: any) {
    const { email, password } = req;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
