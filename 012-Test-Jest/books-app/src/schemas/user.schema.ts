import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ isRequired: true, unique: true })
  public email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ isRequired: true })
  public firstName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
