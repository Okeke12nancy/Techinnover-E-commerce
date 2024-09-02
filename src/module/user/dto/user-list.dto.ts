import { ApiProperty } from '@nestjs/swagger';

export class UserListResponseDto {
  @ApiProperty({
    description: 'The ID of the user',
    type: String,
    example: 'ef313f2a-7476-4c13-9069-87f127348510',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    type: String,
    example: 'Tobani Nancy',
  })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'tobani144@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The role of the user',
    type: String,
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    description: 'Indicates if the user is banned',
    type: Boolean,
    example: false,
  })
  isBanned: boolean;
}
