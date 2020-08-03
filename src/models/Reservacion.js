const mongoose = require('mongoose');
const Schema =  mongoose.Schema;


const ReservacionSchema  = Schema ({
    nombre: String, 
    apellido: String,
    numPersonas: String, 
    fecha: String,
    año: Number,
    mes:Number,
    dia: Number,
    hora: Number,
    minuto: Number,
    numeroTelefono: String,
    email: String
});


module.exports = mongoose.model('reservacion',ReservacionSchema);