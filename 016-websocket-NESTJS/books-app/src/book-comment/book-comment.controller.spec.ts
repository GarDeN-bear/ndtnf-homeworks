import { Test, TestingModule } from '@nestjs/testing';
import { BookCommentController } from './book-comment.controller';

describe('BookCommentController', () => {
  let controller: BookCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookCommentController],
    }).compile();

    controller = module.get<BookCommentController>(BookCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
