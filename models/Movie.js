const mongoose = require(`mongoose`);
const { getMaxListeners } = require("../../../../backend/s43-s50/models/Enrollment");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, `Movie Title is Required`]
    },
    director: {
        type: String,
        required: [true, `Movie Director is Required`]
    },
    year: {
        type: Number,
        required: [true, `Movie Year is Required`]
    },
    description: {
        type: String,
        required: [true, `Movie Description is Required`]
    },
    genre: {
        type: String,
        required: [true, `Movie Genre is Required`]
    },
    comments: [
        {
            userId: {
                type: String,
                required: [true, "UserId is required"]
            },
            comment: {
                type: String,
                required: [true, "Comment is required"]
            }
        }
    ]
});

module.exports = mongoose.model("Movie", movieSchema);