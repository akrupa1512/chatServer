const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    createdDay: {
        type: Date,
        default: new Date()
    }
});

const Project = mongoose.model('Project', Schema);

module.exports = Project;