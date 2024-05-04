const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const {allBooks} = require("./general");
let userList = require("./general").users;

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    let validusers = userList.filter((user) => {
        return (user.username === username && user.password === password)
    });
    return validusers.length > 0;
}

const registerUser = (username, password, res) => {
    if (userList.find((user) => user.username === username)) {
        return res.status(400).json({message: "User already exists"});
    }
    userList.push({"username": username, "password": password});
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const reviewReceived = req.body["review"]
    const userLeavingReview = req.session.authorization.username
    let filtered_books = allBooks.find((book) => book.isbn === isbn);
    let currentReview = filtered_books.reviews;
    currentReview[userLeavingReview] = reviewReceived
    filtered_books.reviews = currentReview
    return res.status(300).json({messages: "Review for " + filtered_books.title + ": " + Object.values(filtered_books.reviews)});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.registerUser = registerUser;
