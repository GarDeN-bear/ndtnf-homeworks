import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookCommentService } from './book-comment.service';
import { BookCommentController } from './book-comment.controller';
import { BookComment, BookCommentSchema } from '../schemas/book.comment.schema';
import { BookCommentGateway } from './book-comment.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookComment.name, schema: BookCommentSchema },
    ]),
  ],
  providers: [BookCommentService, BookCommentGateway],
  controllers: [BookCommentController],
})
export class BookCommentModule {}
