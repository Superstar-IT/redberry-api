import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class StatFilterOptDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Get statistics data by country code',
  })
  @IsOptional()
  @IsString()
  countryCode?: string;
}
