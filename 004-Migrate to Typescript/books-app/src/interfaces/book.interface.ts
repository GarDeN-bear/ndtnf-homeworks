import { Document } from "mongoose";

export default interface Book extends Document {
  id?: string;
  title: string;
  description: string;
  authors: string;
  favorite: string;
  fileCover: string;
  fileName: string;
}
