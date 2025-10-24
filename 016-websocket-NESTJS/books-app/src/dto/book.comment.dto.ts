import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class BookCommentDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: string;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
