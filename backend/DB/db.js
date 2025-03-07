const { default: mongoose } = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
});

const UserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        index: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 4,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = {
    User
};