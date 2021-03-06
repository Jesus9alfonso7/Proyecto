const mongoose = require('mongoose');
const Schema =  mongoose.Schema;


const FoodSchema  = Schema ({
    name: String,
    price: Number, 
    calories: Number,
    protein: Number,
    fat: Number,
    img: String,
    description: String,
});

module.exports = mongoose.model('food',FoodSchema);