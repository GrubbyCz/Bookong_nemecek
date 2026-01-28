const express = require('express');
const router = express.Router();
const bookController = require('../controllers/BookController');

// GET /books/add - zobrazí formulář
router.get('/add', bookController.getAddBookForm);

// POST /books/add - uloží data
router.post('/add', bookController.createBook);

module.exports = router;
