const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let allBooks = Object.values(books)

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json({result: allBooks});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let filtered_books = allBooks.find((book) => book.isbn === isbn)
    if (filtered_books == null) return res.status(300).json({message: "Book not found"});
    res.status(300).json({message: filtered_books});
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorName = req.params.author;
    let filtered_books = allBooks.filter((book) => book.author.includes(authorName));
    return res.status(300).json({message: filtered_books});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let filtered_books = allBooks.filter((book) => book.title.includes(title));
    return res.status(300).json({message: filtered_books});
});

// Get book review
public_users.get('/review/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let filtered_books = allBooks.find((book) => book.isbn === isbn);
    return res.status(300).json({messages: "Review for " + filtered_books.title + ": " + Object.values(filtered_books.reviews)});
});

module.exports.general = public_users;
