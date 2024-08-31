import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/decorators.guards';
import { Role } from '../../common/enum';
import { RolesGuard } from '../../common/guards/roles.guards';
import { UsersService } from './user.service';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll(): Promise<User[]> {
    try {
      return await this.usersService.findAll();
    } catch {
      throw new BadRequestException('Unable to retrieve users');
    }
  }

  @Patch(':id/ban')
  @Roles(Role.Admin)
  async banUser(@Param('id') id: string): Promise<void> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.usersService.banUser(id);
    } catch {
      throw new BadRequestException('Unable to ban user');
    }
  }

  @Post()
  @Roles(Role.Admin)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch {
      throw new BadRequestException('Unable to create user');
    }
  }
}
