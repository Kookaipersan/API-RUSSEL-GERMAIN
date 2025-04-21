const mongoose = require('mongoose');

// Schéma catway
const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true, unique: true },
  catwayType: { type: String, required: true },      // ex: short, long
  catwayState: { type: String, required: true }      // ex: bon état, moyen état
});

// Création du modèle catway
module.exports = mongoose.model('Catway', catwaySchema);
