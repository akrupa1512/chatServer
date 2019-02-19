const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    birthdate: {
        type: Date
    },
    photoPath: {
        type: String
    },
    createdDay: {
        type: Date,
        default: new Date()
    }
});

// Schema.virtual('password')
//     .set((password) => {
//         this.hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
//     })
//     .get(() => {
//         return this.hashPasswonpm i bcryptjsrd;
//     });

Schema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.hashPassword);
};

const User = mongoose.model('User', Schema);

module.exports = User;