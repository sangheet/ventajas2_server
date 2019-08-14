const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    nombre: String,
    precio: String,
    categoryId: String, 
    planId: String,
    modalidad: String,
    canal: String,
    
});

module.exports = mongoose.model('Product', productSchema);