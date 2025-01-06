const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    res.status(201).json({ message: "Customer successfully registered. Now you can login " });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).json({ books: books});
});

// Get the book list available in the shop using async-await with Axios
public_users.get('/async-books', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/');
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
 });

 // Get book details based on ISBN using async-await with Axios
public_users.get('/async-isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book details" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
});

 // Get book details based on Author using async-await with Axios
 public_users.get('/async-author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book details" });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book details based on Title using async-await with Axios
public_users.get('/async-title/:title', async function (req, res) {
    const title = req.params.title;
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book details" });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      res.status(200).json(book.reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
