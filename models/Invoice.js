const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    reservation_id:{
    type : String,
    required: [true, 'El ID de la reserva es obligatorio'],
    trim: true,
    unique: true,
    minlength: [9, 'El ID debe tener al menos 9 caracteres'],
    match: [/^RSV-[0-9]{5}$/, 'El formato debe ser RSV- seguido de 5 números (Ej: RSV-00001)']
  },  
  room_id:{
    type: String,
    required: [true, 'El ID de la habitación es obligatorio'],
    trim: true,
    minlength: [7, 'El ID debe tener al menos 7 caracteres'],
    match: [/^HAB-[0-9]{3}$/, 'El formato debe ser HAB- seguido de 3 números (Ej: HAB-101)']
    },
  user_id: {
        type: String,
        required: [true, 'El ID del usuario es obligatorio'],
        minlength: [9, 'El ID debe tener al menos 9 caracteres'],
        match: [/^(CLI|EMP)-[0-9]{5}$/, 'El formato debe ser CLI- o EMP- seguido de 5 números (Ej: EMP-00001)'],
        trim: true
    },
  check_in: {
        type: Date,
        required: [true, 'La fecha de entrada es obligatoria'],
        trim: true
    },
    check_out: {
        type: Date,
        required: [true, 'La fecha de salida es obligatoria'],
        trim: true
    },
    price:{
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min:[0 , 'El precio debe ser mayor o igual 0']
      
    },
    cancelation_date: {
        type: Date,
        default: null,
        trim: true
    },
    invoice_date:{
        type:Date,
        required:[true, 'La fecha de la factura es obligatoria']
    },
    invoice_number:{
        type : String,
        required: [true, 'El numero de factura es obligatorio'],
        trim: true,
        unique: true,
        match: [/^F[0-9]{4}-[0-9]{5}$/, 'El formato debe ser F seguido del año, guion y 5 números (Ej: F2026-00001)']
    },
    user_name:{
        type: String,
        required: [true, 'El nombre del usuario es algo obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre excede los 100 caracteres'],
        minlength: [1, 'El nombre no puede estar vacio']
    },
    user_surname:{
        type: String,
        required: [true, 'El Apellido del usuario es algo obligatorio'],
        trim: true,
        maxlength: [100, 'El apellido no puede exceder 100 caracteres'],
        minlength: [1, 'El apellido no puede estar vacío']
    },
    user_dni:{
        type: String,
        required: [true, 'El dni del usuario es algo obligatorio'],
        trim: true,
        uppercase: true,
    },
    user_city: {
        type: String,
        default: null,
        trim: true,
    },
    hotel_nombre: {
        type: String,
        required: [true, 'El nombre del hotel es obligatorio']
    },
    hotel_nif: {
        type: String,
        required: [true, 'El NIF es obligatorio']
    },
    hotel_direccion: {
        type: String
    },
    hotel_telefono: {
        type: String
    },
    hotel_cp: {
        type: String
    },
    hotel_ciudad: {
        type: String
    },
    hotel_provincia: {
        type: String
    }



},{ timestamps: true }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;