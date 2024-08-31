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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth() // Adds Bearer Authentication to the documentation
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
  })
  @ApiResponse({
    status: 400,
    description: 'Unable to retrieve users',
  })
  async findAll(): Promise<User[]> {
    try {
      return await this.usersService.findAll();
    } catch {
      throw new BadRequestException('Unable to retrieve users');
    }
  }

  @Patch(':id/ban')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Ban a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to ban',
    type: String,
  })
  @ApiResponse({
    status: 204,
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
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The created user',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Unable to create user',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch {
      throw new BadRequestException('Unable to create user');
    }
  }
}
