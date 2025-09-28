import { Injectable } from '@nestjs/common';
import Book from './interface/book/book.interface';

@Injectable()
export class BooksService {
  private books: Book[] = [];
  private id: number = 0;

  createBook(book: Book): void {
    book.id = (this.id++).toString();
    this.books.push(book);
  }

  getBook(id: string): Book | null {
    return this.books.find((book) => book.id === id) || null;
  }

  getBooks(): Book[] {
    return this.books;
  }

  updateBook(id: string, updatedBook: Book): void {
    const bookId: number = this.books.findIndex((book) => book.id === id);
    if (bookId === -1) {
      return;
    }

    this.books[bookId] = updatedBook;
  }

  deleteBook(id: string): boolean {
    const bookId = this.books.findIndex((book) => book.id === id);

    if (bookId === -1) {
      return false;
    }

    this.books = this.books.filter((book) => book.id !== id);
    return true;
  }
}
