const mongoose = require('mongoose');
const Book = require('../models/book');
const bookModel = require('./books');

mongoose.connect('mongodb://127.0.0.1:27017/the-book-spot');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const seedDB = async () => {
    await Book.deleteMany({});
    for (let i = 0; i < 30; i++) {
        const newBook = new Book({
            name: bookModel.name,
            author: bookModel.author,
            description: bookModel.description,
            price: bookModel.price,
            images: {
                url: 'https://res.cloudinary.com/dxygupnug/image/upload/v1686913137/TheBookSpot/oxxmqktlxgqwxfuzx6rb.jpg',
                filename: 'TheBookSpot/oxxmqktlxgqwxfuzx6rb',
            },
            category: bookModel.category
        })
        await newBook.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})