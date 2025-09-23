import { Container } from "inversify";
import BooksRepository from "../repositories/books.repository";
import UsersRepository from "../repositories/users.repository";

const myContainer = new Container();

myContainer.bind<BooksRepository>(BooksRepository).toSelf();
myContainer.bind<UsersRepository>(UsersRepository).toSelf();

export default myContainer;
