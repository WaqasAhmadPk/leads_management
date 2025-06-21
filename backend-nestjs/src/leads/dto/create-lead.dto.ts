import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsDate, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotInFuture } from 'src/validators/is-not-in-future.validator';

export class CreateLeadDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  // @ApiProperty()
  // @IsOptional()
  // @IsBoolean()
  // isActive?: boolean;

  @ApiProperty()
  @IsString()
  source: string;

  @ApiProperty({ required: true, type: String, format: 'date-time' })
  @Type(() => Date)
  @IsDate()
  @Validate(IsNotInFuture)
  submitted_at: Date;
}
