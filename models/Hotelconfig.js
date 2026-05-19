const mongoose = require('mongoose');

const hotelconfigSchema = new mongoose.Schema({
    nombreHotel: {
        type: String,
        required: [true, 'El nombre del hotel es obligatorio'],
        default: 'Hotel IES Pere Maria'
    },
    nif: {
        type: String,
        required: [true, 'El NIF es obligatorio'],
        default: 'N05746789'
    },
    direccion: {
        type: String,
        default: 'Barca del Bou, 18'
    },
    telefono: {
        type: String,
        default: '+34 965 04 10 88'
    },
    cp: {
        type: String,
        default: '03502'
    },
    ciudad: {
        type: String,
        default: 'Benidorm'
    },
    provincia: {
        type: String,
        default: 'Alicante'
    }


},{ timestamps: true,
    collection: 'hotelconfigs'
 });

const Hotelconfig = mongoose.model('Hotelconfig', hotelconfigSchema);
module.exports = Hotelconfig;