import { injectable } from "inversify";

import Book from "../interfaces/book.interface";
import BookModel from "../db/books";

@injectable()
export default class BooksRepository {
  async createBook(book: Book): Promise<void> {
    const newBook = new BookModel({ ...book });
    await newBook.save();
  }

  async getBook(id: string): Promise<Book | null> {
    return await BookModel.findById(id).select("-__v").exec();
  }

  async getBooks(): Promise<Book[]> {
    return await BookModel.find().select("-__v").exec();
  }

  async updateBook(id: string, updatedBook: Book): Promise<void> {
    await BookModel.findByIdAndUpdate(id, { ...updatedBook });
  }

  async deleteBook(id: string): Promise<void> {
    await BookModel.deleteOne({ _id: id });
  }
}
