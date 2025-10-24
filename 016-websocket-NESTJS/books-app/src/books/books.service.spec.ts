import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BooksService } from './books.service';
import { Book, BookDocument } from '../schemas/book.schema';
import { BookDto } from '../dto/book.dto';
import { create } from 'domain';

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<BookDocument>;

  const mockBook: BookDto = {
    title: 'Test Book',
    description: 'Test Description',
    authors: 'Test Author',
    favorite: 'true',
    fileCover: 'cover.jpg',
    fileName: 'book.pdf',
  };

  const mockBookDocument = {
    _id: '507f1f77bcf86cd799439011',
    ...mockBook,
  };

  const mockUpdatedBook: BookDto = {
    ...mockBook,
    title: 'Updated Book',
    description: 'Updated Description',
  };

  const mockUpdatedBookDocument = {
    _id: '507f1f77bcf86cd799439011',
    ...mockUpdatedBook,
  };

  const mockModel = {
    create: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    findOneAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<BookDocument>>(getModelToken(Book.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBook', () => {
    it('should create a new book with valid data', async () => {
      mockModel.create.mockResolvedValueOnce(mockBookDocument);

      const result = await service.createBook(mockBook);

      expect(result).toEqual(mockBookDocument);
      expect(mockModel.create).toHaveBeenCalled();
    });

    it('should create a book with optional fields', async () => {
      const bookWithoutOptionals = {
        title: 'Required Book',
        authors: 'Required Author',
      } as BookDto;

      const minimalBookDocument = {
        _id: '507f1f77bcf86cd799439012',
        ...bookWithoutOptionals,
      };

      mockModel.create.mockResolvedValueOnce(minimalBookDocument);

      const result = await service.createBook(bookWithoutOptionals);

      expect(result).toEqual(minimalBookDocument);
      expect(mockModel.create).toHaveBeenCalled();
    });
  });

  describe('getBooks', () => {
    it('should return an array of books', async () => {
      const mockBooks = [mockBookDocument];
      mockModel.exec.mockResolvedValueOnce(mockBooks);

      const result = await service.getBooks();

      expect(result).toEqual(mockBooks);
      expect(mockModel.find).toHaveBeenCalled();
    });

    it('should return empty array when no books exist', async () => {
      mockModel.exec.mockResolvedValueOnce([]);

      const result = await service.getBooks();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(mockModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBook', () => {
    it('should return a book by id', async () => {
      mockModel.exec.mockResolvedValueOnce(mockBookDocument);

      const result = await service.getBook('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockBookDocument);
      expect(mockModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should return null if book not found', async () => {
      mockModel.exec.mockResolvedValueOnce(null);

      const result = await service.getBook('nonexistent-id');

      expect(result).toBeNull();
      expect(mockModel.findById).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('updateBook', () => {
    it('should update a book with valid data', async () => {
      mockModel.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedBookDocument);

      const result = await service.updateBook(
        '507f1f77bcf86cd799439011',
        mockUpdatedBook,
      );

      expect(result).toEqual(mockUpdatedBookDocument);
      expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '507f1f77bcf86cd799439011' },
        mockUpdatedBook,
      );
    });
  });

  describe('deleteBook', () => {
    it('should delete a book by id', async () => {
      mockModel.findOneAndDelete.mockResolvedValueOnce(mockUpdatedBookDocument);

      const result = await service.deleteBook('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockUpdatedBookDocument);
      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: '507f1f77bcf86cd799439011',
      });
    });
  });
});
