const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_thumb,h_250,w_180');
});

const BookSchema = new Schema({
    name: String,
    author: String,
    description: String,
    price: Number,
    images: [ImageSchema],
    category: {
        type: String,
        enum: ['Finance', 'Psychology', 'Self-Help']
    },
});

module.exports = mongoose.model('Book', BookSchema);