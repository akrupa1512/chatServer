const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    isDone: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdDay: {
        type: Date,
        default: new Date()
    }
});

const Task = mongoose.model('Task', Schema);

module.exports = Task;