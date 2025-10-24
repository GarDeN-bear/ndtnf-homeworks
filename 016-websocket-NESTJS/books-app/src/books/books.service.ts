import { Injectable } from '@nestjs/common';
import { Model, HydratedDocument, QueryWithHelpers } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Book, BookDocument } from '../schemas/book.schema';
import { BookDto } from '../dto/book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private BookModel: Model<BookDocument>) {}

  public createBook(data: BookDto): Promise<BookDocument> {
    return this.BookModel.create(data);
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
