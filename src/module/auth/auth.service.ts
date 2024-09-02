import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isBanned) {
      throw new UnauthorizedException('User is banned');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;
    return user;
  }

  async createUser(createAuthDto: CreateAuthDto): Promise<User> {
    const { email } = createAuthDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.usersService.createUser(createAuthDto);

    console.log('User saved with role:', user.role);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersService.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async login(user: User) {
    if (user.isBanned) {
      throw new UnauthorizedException('User is banned');
    }

    const payload = {
      name: user.name,
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
    };
  }
}
