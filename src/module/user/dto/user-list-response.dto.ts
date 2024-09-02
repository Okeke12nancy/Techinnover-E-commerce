import { ApiProperty } from '@nestjs/swagger';
import { UserListResponseDto } from './user-list.dto';

export class UserAllResponseDto {
  @ApiProperty({
    description: 'A message indicating the result of the operation',
    type: String,
    example: 'User successfully fetched',
  })
  message: string;

  @ApiProperty({
    description: 'List of users',
    type: [UserListResponseDto],
  })
  users: UserListResponseDto[];
}
