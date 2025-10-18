import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  UsePipes,
} from '@nestjs/common';

import { HydratedDocument, QueryWithHelpers } from 'mongoose';

import { BookDocument } from './schemas/book.schema';
import { BooksService } from './books.service';
import { BookDto } from './dto/book/book.dto';
import { BooksValidationPipe } from './books.validation.pipe';

@UsePipes(new BooksValidationPipe())
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  public createBook(@Body() body: BookDto): Promise<BookDocument> {
    return this.booksService.createBook(body);
  }

  @Get()
  public getBooks(): Promise<BookDocument[]> {
    return this.booksService.getBooks();
  }

  @Get(':id')
  public getBook(@Param('id') id: string): Promise<BookDocument | null> {
    return this.booksService.getBook(id);
  }

  @Put(':id')
  public updateBook(
    @Param('id') id: string,
    @Body() body: BookDto,
  ): QueryWithHelpers<
    HydratedDocument<BookDocument, {}, {}> | null,
    HydratedDocument<BookDocument, {}, {}>,
    {},
    BookDocument
  > {
    return this.booksService.updateBook(id, body);
  }

  @Delete(':id')
  deleteBook(
    @Param('id') id: string,
  ): QueryWithHelpers<
    HydratedDocument<BookDocument, {}, {}> | null,
    HydratedDocument<BookDocument, {}, {}>,
    {},
    BookDocument
  > {
    return this.booksService.deleteBook(id);
  }
}
