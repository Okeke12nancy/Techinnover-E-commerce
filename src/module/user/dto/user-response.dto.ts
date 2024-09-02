import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'The ID of the user',
    type: String,
    example: '9591211f-c3c9-4194-a25d-7778712d41e5',
  })
  id: string;
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    example: 'Nancy Developer',
  })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'nancy44@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'The role of the user',
    type: String,
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'Whether the user is banned',
    type: Boolean,
    example: false,
  })
  isBanned: boolean;
}
