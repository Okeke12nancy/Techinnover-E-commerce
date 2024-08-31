import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    example: 'John Doe',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'johndoe@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'The password of the user, must be at least 6 characters long',
    type: String,
    example: 'newpassword123',
    required: false,
  })
  password?: string;
}
