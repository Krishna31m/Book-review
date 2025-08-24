const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb');

const auth_users = express.Router();

const users = [];  // To store registered users in memory (for demo only)

// Task 6: Register new user
auth_users.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Task 7: Login registered user
auth_users.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful" });
});

// Task 8: Add or modify book review
auth_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;
    if (!username) return res.status(403).json({ message: "User not authenticated" });
    if (!review) return res.status(400).json({ message: "Review content required" });
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

// Task 9: Delete book review
auth_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
    if (!username) return res.status(403).json({ message: "User not authenticated" });
    if (!books[isbn] || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = auth_users;
