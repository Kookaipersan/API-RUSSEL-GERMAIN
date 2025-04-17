const mongoose = require('mongoose');

// Schéma réservation
const reservationSchema = new mongoose.Schema({
  catwayNumber: { type: String, required: true, ref: 'Catway' },
  clientName: { type: String, required: true },
  boatName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

// Création du modèle réservation
module.exports = mongoose.model('Reservation', reservationSchema);
