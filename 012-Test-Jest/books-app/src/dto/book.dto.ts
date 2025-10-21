import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class BookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  authors: string;

  @IsString()
  @IsOptional()
  favorite?: string;

  @IsString()
  @IsOptional()
  fileCover?: string;

  @IsString()
  @IsOptional()
  fileName?: string;
}
