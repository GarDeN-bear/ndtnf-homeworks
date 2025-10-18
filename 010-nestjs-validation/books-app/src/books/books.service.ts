import { Injectable } from '@nestjs/common';
import {
  Model,
  Connection,
  HydratedDocument,
  QueryWithHelpers,
} from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Book, BookDocument } from './schemas/book.schema';
import { BookDto } from './dto/book/book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private BookModel: Model<BookDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  public createBook(data: BookDto): Promise<BookDocument> {
    const book = new this.BookModel(data);
    return book.save();
  }

  public getBooks(): Promise<BookDocument[]> {
    return this.BookModel.find().exec();
  }

  public getBook(id: string): Promise<BookDocument | null> {
    return this.BookModel.findById(id).exec();
  }

  public updateBook(
    id: string,
    data: BookDto,
  ): QueryWithHelpers<
    HydratedDocument<BookDocument, {}, {}> | null,
    HydratedDocument<BookDocument, {}, {}>,
    {},
    BookDocument
  > {
    return this.BookModel.findOneAndUpdate({ _id: id }, data);
  }

  public deleteBook(
    id: string,
  ): QueryWithHelpers<
    HydratedDocument<BookDocument, {}, {}> | null,
    HydratedDocument<BookDocument, {}, {}>,
    {},
    BookDocument
  > {
    return this.BookModel.findOneAndDelete({ _id: id });
  }
}
