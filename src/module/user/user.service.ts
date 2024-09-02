import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../module/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { UserListResponseDto } from './dto/user-list.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    message: string;
    users: UserListResponseDto[];
    total: number;
    totalPages: number;
  }> {
    try {
      console.log('Calling usersService.findAll()');

      const skip = (page - 1) * limit;

      const [users, total] = await this.usersRepository.findAndCount({
        skip,
        take: limit,
      });

      console.log('Users retrieved:', users);

      const userDtos: UserListResponseDto[] = users.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBanned: user.isBanned,
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        message: 'Users successfully fetched',
        users: userDtos,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new BadRequestException('Unable to retrieve users');
    }
  }

  async createUser(createUserDto: CreateAuthDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async banUser(id: string): Promise<void> {
    await this.usersRepository.update(id, { isBanned: true });
  }

  async unbanUser(id: string): Promise<void> {
    await this.usersRepository.update(id, { isBanned: false });
  }
}
