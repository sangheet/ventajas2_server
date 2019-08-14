const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Plan', planSchema);