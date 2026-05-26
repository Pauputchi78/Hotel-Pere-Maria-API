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
    },
    canMas7Dias: {
        type: Number,
        default: 100,
        required: [true, 'El porcentaje para más de 7 días es obligatorio'],
        min: [0, 'El porcentaje no puede ser menor a 0'],
        max: [100, 'El porcentaje no puede ser mayor a 100']
    },
    canMas3Dias: {
        type: Number,
        default: 50,
        required: [true, 'El porcentaje para más de 3 días es obligatorio'],
        min: [0, 'El porcentaje no puede ser menor a 0'],
        max: [100, 'El porcentaje no puede ser mayor a 100'],
        validate: {
            validator: function(value) {
                return value < this.canMas7Dias;
            },
            message: 'El porcentaje de 3 días ({VALUE}%) debe ser menor que el de 7 días.'
        }
    }


},{ timestamps: true,
    collection: 'hotelconfigs'
 });

const Hotelconfig = mongoose.model('Hotelconfig', hotelconfigSchema);
module.exports = Hotelconfig;