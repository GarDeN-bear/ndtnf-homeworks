import { Test, TestingModule } from '@nestjs/testing';
import { BookCommentGateway } from './book-comment.gateway';

describe('BookCommentGateway', () => {
  let gateway: BookCommentGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookCommentGateway],
    }).compile();

    gateway = module.get<BookCommentGateway>(BookCommentGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
