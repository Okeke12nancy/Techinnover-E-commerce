import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Success message',
    type: String,
    example: 'User successfully registered',
  })
  message: string;

  @ApiProperty({
    description: 'The user details excluding the password',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
