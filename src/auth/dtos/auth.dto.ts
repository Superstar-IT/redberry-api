import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'UserName',
    example: 'username',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  userName: string;

  @ApiProperty({
    type: String,
    required: true,
    minLength: 8,
    description: 'Password',
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
