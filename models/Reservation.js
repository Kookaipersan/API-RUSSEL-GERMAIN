// models/Reservation.js
const mongoose = require('mongoose');

/**
 * @typedef {Object} Reservation
 * @property {string} clientName - Le nom du client ayant effectué la réservation
 * @property {string} boatName - Le nom du bateau réservé
 * @property {Date} startDate - La date de début de la réservation
 * @property {Date} endDate - La date de fin de la réservation
 * @property {mongoose.Types.ObjectId} catwayId - Référence à l'ID du Catway réservé
 * @property {mongoose.Types.ObjectId} userId - Référence à l'ID de l'utilisateur ayant fait la réservation
 */

/**
 * Schéma du modèle Reservation
 * @type {mongoose.Schema<Reservation>}
 */

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

/**
 * Modèle Reservation pour MongoDB
 * @type {mongoose.Model<Reservation>}
 */

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;

