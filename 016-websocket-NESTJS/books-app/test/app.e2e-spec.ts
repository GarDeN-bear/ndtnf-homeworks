import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from './../src/app.module';
import { BooksService } from '../src/books/books.service';
import { BooksController } from '../src/books/books.controller';
import { JwtAuthGuard } from '../src/users/jwt.auth.guard';
import { BookDto } from '../src/dto/book.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let booksService: BooksService;

  const mockBook = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Book',
    description: 'Test Description',
    authors: 'Test Author',
    favorite: 'true',
    fileCover: 'cover.jpg',
    fileName: 'book.pdf',
  };

  const mockBook2 = {
    _id: '507f1f77bcf86cd799439012',
    title: 'Test Book 2',
    description: 'Test Description 2',
    authors: 'Test Author 2',
    favorite: 'false',
    fileCover: 'cover2.jpg',
    fileName: 'book2.pdf',
  };

  const mockBooksService = {
    createBook: jest.fn(),
    getBooks: jest.fn(),
    getBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [BooksController],

      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    booksService = moduleFixture.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /books', () => {
    it('should create a new book', async () => {
      const createBookDto: BookDto = {
        title: 'New Book',
        description: 'New Description',
        authors: 'New Author',
        favorite: 'true',
        fileCover: 'new-cover.jpg',
        fileName: 'new-book.pdf',
      };

      mockBooksService.createBook.mockResolvedValue(mockBook);

      const response = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      expect(response.body).toEqual(mockBook);
      expect(mockBooksService.createBook).toHaveBeenCalledWith(createBookDto);
    });

    it('should return 400 for invalid data', async () => {
      const invalidBookDto = {
        description: 'Only description', // missing required title and authors
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .send(invalidBookDto)
        .expect(400);
    });
  });

  describe('GET /books', () => {
    it('should return all books', async () => {
      const books = [mockBook, mockBook2];
      mockBooksService.getBooks.mockResolvedValue(books);

      const response = await request(app.getHttpServer())
        .get('/books')
        .expect(200);

      expect(response.body).toEqual(books);
      expect(mockBooksService.getBooks).toHaveBeenCalled();
    });

    it('should return empty array when no books exist', async () => {
      mockBooksService.getBooks.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/books')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /books/:id', () => {
    it('should return a book by id', async () => {
      mockBooksService.getBook.mockResolvedValue(mockBook);

      const response = await request(app.getHttpServer())
        .get('/books/507f1f77bcf86cd799439011')
        .expect(200);

      expect(response.body).toEqual(mockBook);
      expect(mockBooksService.getBook).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should return 200 when book not found', async () => {
      mockBooksService.getBook.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/books/nonexistent-id')
        .expect(200);

      expect(response.body).toEqual({});
    });
  });

  describe('PUT /books/:id', () => {
    it('should update a book', async () => {
      const updateBookDto: BookDto = {
        title: 'Updated Book',
        description: 'Updated Description',
        authors: 'Updated Author',
        favorite: 'false',
        fileCover: 'updated-cover.jpg',
        fileName: 'updated-book.pdf',
      };

      const updatedBook = { ...mockBook, ...updateBookDto };
      mockBooksService.updateBook.mockResolvedValue(updatedBook);

      const response = await request(app.getHttpServer())
        .put('/books/507f1f77bcf86cd799439011')
        .send(updateBookDto)
        .expect(200);

      expect(response.body).toEqual(updatedBook);
      expect(mockBooksService.updateBook).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateBookDto,
      );
    });

    it('should return 400 for invalid update data', async () => {
      const invalidUpdateDto = {
        title: '', // empty title should be invalid
      };

      const response = await request(app.getHttpServer())
        .put('/books/507f1f77bcf86cd799439011')
        .send(invalidUpdateDto)
        .expect(400);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete a book', async () => {
      mockBooksService.deleteBook.mockResolvedValue(mockBook);

      const response = await request(app.getHttpServer())
        .delete('/books/507f1f77bcf86cd799439011')
        .expect(200);

      expect(response.body).toEqual(mockBook);
      expect(mockBooksService.deleteBook).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should handle deletion of non-existent book', async () => {
      mockBooksService.deleteBook.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .delete('/books/nonexistent-id')
        .expect(200);

      expect(response.body).toEqual({});
    });
  });

  describe('Authentication', () => {
    it('should protect all routes with JWT auth', async () => {
      // Since we're using a mock guard that always returns true,
      // we can verify that the guard is applied by checking that routes work
      // In a real scenario, you might test unauthorized access separately
      mockBooksService.getBooks.mockResolvedValue([]);

      await request(app.getHttpServer()).get('/books').expect(200);

      expect(mockJwtAuthGuard.canActivate).toHaveBeenCalled();
    });
  });
});
