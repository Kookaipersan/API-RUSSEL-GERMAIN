const mongoose = require('mongoose');

// Schéma catway
const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: String, required: true, unique: true },
  catwayType: { type: String, enum: ['long', 'short'], required: true },
  catwayState: { type: String, required: true }
});

// Création du modèle catway
module.exports = mongoose.model('Catway', catwaySchema);
