const mongoose = require('mongoose');
const Schema =  mongoose.Schema;


const ReservacionSchema  = Schema ({
    nombre: String, 
    personas: Number, 
    dia: Date,
    hora: Number
});

module.exports = mongoose.model('reservacion',ReservacionSchema);