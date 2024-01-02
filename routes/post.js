const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imgText : {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    postDate: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Post', postSchema);
