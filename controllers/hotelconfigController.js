const mongoose = require('mongoose');
const Hotelconfig = require('../models/Hotelconfig');


async function getConfig(req, res) {
  try {
    const config = await Hotelconfig.findOne();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener configuracion', detalle: err.message });
  }
}

async function modconfig(req, res){
    try {
        const datosRecibidos = req.body;
        const update = {};

        Object.keys(datosRecibidos).forEach(key => {
            if (datosRecibidos[key] && datosRecibidos[key].toString().trim() !== "") {
                update[key] = datosRecibidos[key];
            }
        });

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ error: "No se enviaron datos válidos para actualizar" });
        }

        const config = await Hotelconfig.findOneAndUpdate(
            {}, 
            { $set: update },
            { new: true, upsert: true }
        );

        res.json({ msg: "Actualizado (se ignoraron campos vacíos)", config });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
  getConfig,
  modconfig
};