import { Injectable } from '@nestjs/common';
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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password; // Remove the password property
      return user;
    }
    return null;
  }

  async createUser(createUserDto: CreateAuthDto): Promise<User> {
    // Make sure you have a proper User entity and DTO
    const user = this.usersService.createUser(createUserDto);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersService.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
