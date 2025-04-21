const mongoose = require('mongoose');

/**
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Le numéro unique du catway
 * @property {string} catwayType - Le type de catway (ex : short, long)
 * @property {string} catwayState - L'état du catway (ex : bon état, moyen état)
 */

/**
 * Schéma du modèle Catway
 * @type {mongoose.Schema<Catway>}
 */

const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true, unique: true },
  catwayType: { type: String, required: true },      // ex: short, long
  catwayState: { type: String, required: true }      // ex: bon état, moyen état
});

/**
 * Modèle Catway pour MongoDB
 * @type {mongoose.Model<Catway>}
 */

module.exports = mongoose.model('Catway', catwaySchema);
