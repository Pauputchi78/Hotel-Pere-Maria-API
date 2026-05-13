const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Room = require('../models/Room');
const Invoice = require('../models/Invoice')
const mongoose = require('mongoose');

async function getAllInvoices(req, res) {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar las facturas', detalle: err.message });
  }
}

module.exports = {
    getAllInvoices
};