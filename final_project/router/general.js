const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const public_users = express.Router();

const REGISTERED_SUCCESS = "User successfully registered. Now you can login"
const REGISTER_UNABLE = "Unable to register user."
const USER_EXISTS = "User already exists!"

let users = []
let allBooks = Object.values(books)

public_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(201).json({message: REGISTERED_SUCCESS});
        } else {
            return res.status(404).json({message: USER_EXISTS});
        }
    }
    return res.status(404).json({message: REGISTER_UNABLE});
});

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    return userswithsamename.length > 0;
}

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
module.exports.users = users;
module.exports.allBooks = allBooks;
