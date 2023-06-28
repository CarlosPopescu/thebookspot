const express = require('express');
const router = express.Router();
const books = require('../controllers/books');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, validateBook } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(books.index))
    .post(isLoggedIn, isAdmin, upload.array('image'), validateBook, catchAsync(books.createBook));

router.get('/category/finance', catchAsync(books.indexFinance));

router.get('/category/psychology', catchAsync(books.indexPsychology));

router.get('/category/self-help', catchAsync(books.indexSelfHelp));

router.get('/new', isLoggedIn, isAdmin, books.newForm);

router.route('/:id')
    .get(catchAsync(books.showBook))
    .put(isLoggedIn, isAdmin, upload.array('image'), validateBook, catchAsync(books.updateBook))
    .delete(isLoggedIn, isAdmin, catchAsync(books.deleteBook));

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(books.editForm));


module.exports = router;