// models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  boatName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  catwayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catway', // Référence au modèle Catway
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence à l'utilisateur
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;

