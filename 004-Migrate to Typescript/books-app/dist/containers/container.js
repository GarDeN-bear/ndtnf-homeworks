"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var books_repository_1 = require("../repositories/books.repository");
var myContainer = new inversify_1.Container();
myContainer.bind(books_repository_1.default).toSelf();
exports.default = myContainer;
