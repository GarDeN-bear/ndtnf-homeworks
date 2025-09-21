import { Container } from "inversify";
import BooksRepository from "../repositories/books.repository";

const myContainer = new Container();

myContainer.bind<BooksRepository>(BooksRepository).toSelf();

export default myContainer;
