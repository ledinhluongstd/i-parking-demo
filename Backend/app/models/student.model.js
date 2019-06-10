const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    sex: String,
    nation: String,
    address: String,
    area:String,
    block: String,
    test_score: Number,
    faculty: String,
    education_program: String,
    result: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);