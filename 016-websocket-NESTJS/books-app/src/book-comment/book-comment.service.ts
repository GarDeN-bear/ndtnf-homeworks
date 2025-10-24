import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  BookComment,
  BookCommentDocument,
} from '../schemas/book.comment.schema';
import { BookCommentDto } from 'src/dto/book.comment.dto';

@Injectable()
export class BookCommentService {
  constructor(
    @InjectModel(BookComment.name)
    private bookCommentModel: Model<BookCommentDocument>,
  ) {}

  findAll(): Promise<BookComment[]> {
    return this.bookCommentModel.find().exec();
  }

  findAllBookComment(bookId: string): Promise<BookComment[]> {
    return this.bookCommentModel.find({ bookId: bookId }).exec();
  }

  findOne(id: string): Promise<BookComment | null> {
    return this.bookCommentModel.findById(id).exec();
  }

  create(bookCommentDto: BookCommentDto): Promise<BookComment> {
    return this.bookCommentModel.create(bookCommentDto);
  }

  update(
    id: string,
    bookCommentDto: BookCommentDto,
  ): Promise<BookComment | null> {
    return this.bookCommentModel.findByIdAndUpdate(id, bookCommentDto).exec();
  }

  delete(id: string): Promise<BookComment | null> {
    return this.bookCommentModel.findByIdAndDelete(id).exec();
  }
}
