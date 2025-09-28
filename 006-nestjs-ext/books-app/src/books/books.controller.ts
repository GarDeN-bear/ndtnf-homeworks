import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import type Book from './interface/book/book.interface';
import { BookDto } from './dto/book/book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  createBook(@Body() newBook: BookDto): void {
    const book: Book = {
      title: newBook.title,
      description: newBook.description,
      authors: newBook.authors,
      favorite: newBook.favorite,
      fileCover: newBook.fileCover,
      fileName: newBook.fileName,
    };
    this.booksService.createBook(book);
  }

  @Get(':id')
  getBook(@Param('id') id: string): Book | null {
    return this.booksService.getBook(id);
  }

  @Get()
  getBooks(): Book[] {
    return this.booksService.getBooks();
  }

  @Put(':id')
  updateBook(@Param('id') id: string, @Body() updatedBook: BookDto): void {
    const book: Book = {
      title: updatedBook.title,
      description: updatedBook.description,
      authors: updatedBook.authors,
      favorite: updatedBook.favorite,
      fileCover: updatedBook.fileCover,
      fileName: updatedBook.fileName,
    };
    this.booksService.updateBook(id, book);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string): boolean {
    return this.booksService.deleteBook(id);
  }
}
