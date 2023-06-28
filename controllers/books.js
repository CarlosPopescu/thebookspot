const Book = require('../models/book');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const books = await Book.find({});
    res.render('books/index', { books })
}

module.exports.indexFinance = async (req, res) => {
    const books = await Book.find({ category: 'Finance' });
    if (!books) {
        req.flash('error', 'Cannot find any book in that category!');
        return res.redirect('/books')
    }
    res.render('books/index', { books });
}

module.exports.indexPsychology = async (req, res) => {
    const books = await Book.find({ category: 'Psychology' });
    if (!books) {
        req.flash('error', 'Cannot find any book in that category!');
        return res.redirect('/books')
    }
    res.render('books/index', { books });
}

module.exports.indexSelfHelp = async (req, res) => {
    const books = await Book.find({ category: 'Self-Help' });
    if (!books) {
        req.flash('error', 'Cannot find any book in that category!');
        return res.redirect('/books')
    }
    res.render('books/index', { books });
}

module.exports.newForm = (req, res) => {
    res.render('books/new')
}

module.exports.createBook = async (req, res) => {
    const book = new Book(req.body.book);
    book.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await book.save();
    req.flash('success', 'Successfully added a new book!');
    res.redirect(`/books/${book._id}`)
}

module.exports.showBook = async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        req.flash('error', 'Cannot find that book');
        return res.redirect('/books')
    }
    res.render('books/show', { book });
}

module.exports.editForm = async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        req.flash('error', 'Cannot find that book');
        return res.redirect('/books')
    }
    res.render('books/edit', { book });
}

module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    book.images.push(...imgs);
    await book.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await book.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated book!');
    res.redirect(`/books/${book._id}`)
}

module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted book!');
    res.redirect('/books')
}