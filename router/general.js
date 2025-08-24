const express = require('express');
const axios = require('axios');
const books = require('./booksdb');

const general = express.Router();

// Task 1: Get all books (sync)
general.get('/', (req, res) => {
    res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details by ISBN (sync)
general.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get books by author (sync)
general.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const filtered = Object.values(books).filter(book => book.author === author);
    if (filtered.length > 0) {
        res.send(filtered);
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
});

// Task 4: Get books by title (sync)
general.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const filtered = Object.values(books).filter(book => book.title === title);
    if (filtered.length > 0) {
        res.send(filtered);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get reviews for a book by ISBN
general.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = general;
