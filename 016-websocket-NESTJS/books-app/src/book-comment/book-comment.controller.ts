import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { BookCommentService } from './book-comment.service';
import { BookComment } from '../schemas/book.comment.schema';
import { BookCommentDto } from '../dto/book.comment.dto';

@Controller('book-comment')
export class BookCommentController {
  constructor(private bookCommentService: BookCommentService) {}

  @Get()
  findAll(): Promise<BookComment[]> {
    return this.bookCommentService.findAll();
  }

  @Get('book/:bookId')
  findByBookId(@Param('bookId') bookId: string): Promise<BookComment[]> {
    return this.bookCommentService.findAllBookComment(bookId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookComment | null> {
    return this.bookCommentService.findOne(id);
  }

  @Post()
  create(@Body() bookCommentDto: BookCommentDto): Promise<BookComment> {
    return this.bookCommentService.create(bookCommentDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() bookCommentDto: BookCommentDto,
  ): Promise<BookComment | null> {
    return this.bookCommentService.update(id, bookCommentDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<BookComment | null> {
    return this.bookCommentService.delete(id);
  }
}
