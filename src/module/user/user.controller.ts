import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Param,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/decorators.guards';
import { Role } from '../../common/enum';
import { RolesGuard } from '../../common/guards/roles.guards';
import { UsersService } from './user.service';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.jwt.strategy';
import { UserListResponseDto } from './dto/user-list.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserListResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Unable to retrieve users',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAll(page, limit);
  }

  @Patch('admin/:id/ban')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Ban a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to ban',
    type: String,
  })
  @ApiOperation({
    summary: 'Ban a user by ID',
    description:
      'Admins can ban users, but not other admins. Users cannot be banned if they are already banned.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully banned',
  })
  @ApiResponse({
    status: 400,
    description: 'Unable to ban user',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot ban an admin or user is already banned',
  })
  async banUser(@Param('id') id: string): Promise<{ message: string }> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isBanned) {
      throw new ConflictException('User is already banned');
    }
    try {
      await this.usersService.banUser(id);
      return {
        message: 'User successfully banned',
      };
    } catch {
      throw new BadRequestException('Unable to ban user');
    }
  }

  @Patch('admin/:id/unban')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Unban a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to unban',
    type: String,
  })
  @ApiOperation({
    summary: 'Unban a user by ID',
    description:
      'Admins can unban users, but not other admins. Users cannot be unbanned if they are not banned.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully unbanned',
  })
  @ApiResponse({
    status: 400,
    description: 'Unable to unban user',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async unbanUser(@Param('id') id: string): Promise<{ message: string }> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === Role.Admin) {
      throw new ConflictException('Cannot ban an admin');
    }
    if (!user.isBanned) {
      throw new ConflictException('User is not banned');
    }
    try {
      await this.usersService.unbanUser(id);
      return {
        message: 'User successfully unbanned',
      };
    } catch {
      throw new BadRequestException('Unable to unban user');
    }
  }
}
