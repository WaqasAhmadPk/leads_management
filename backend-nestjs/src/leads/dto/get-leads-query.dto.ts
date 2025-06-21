import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBooleanString, IsDate, IsNumberString, IsInt, Min  } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLeadsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by email' })
  @IsOptional()
  @IsString()
  email?: string;

  // @ApiPropertyOptional({ description: 'Filter by isActive (true/false)' })
  // @IsOptional()
  // @IsBooleanString()
  // isActive?: string;

  @ApiPropertyOptional({ description: 'Filter by name' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Submitted date from (YYYY-MM-DD)', type: String, format: 'date-time' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  submitted_at_from: Date;

  @ApiPropertyOptional({ description: 'Submitted date to (YYYY-MM-DD)', type: String, format: 'date-time' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  submitted_at_to: Date;

  @ApiPropertyOptional({ description: 'Page number (min: 1)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page (min: 1)', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional ({ description: 'Filter by name or email' })
  @IsOptional()
  @IsString()
  searchQuery?: string;
}
