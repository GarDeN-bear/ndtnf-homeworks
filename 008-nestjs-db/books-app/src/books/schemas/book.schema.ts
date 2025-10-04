import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ isRequired: true })
  public title: string;

  @Prop()
  public description: string;

  @Prop({ isRequired: true })
  public authors: string;

  @Prop()
  public favorite: string;

  @Prop()
  public fileCover: string;

  @Prop()
  public fileName: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
