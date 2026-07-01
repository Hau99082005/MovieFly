const mongoose = require('mongoose');

const countriesSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
}, { timestamps: true});

const Countries = mongoose.model('Countries', countriesSchema);
module.exports = Countries;