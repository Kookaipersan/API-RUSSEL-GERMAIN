const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la gestion des tokens JWT


/**
 * @typedef {Object} User
 * @property {string} username - Le nom d'utilisateur unique
 * @property {string} email - L'email unique de l'utilisateur
 * @property {string} password - Le mot de passe haché de l'utilisateur
 */

/**
 * Schéma du modèle User
 * @type {mongoose.Schema<User>}
 */

// Schéma utilisateur
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/**
 * Middleware qui hache le mot de passe de l'utilisateur avant la sauvegarde.
 * @function
 * @name userSchema.pre('save')
 * @param {Function} next - La fonction de rappel qui permet de passer à la prochaine étape du middleware.
 */


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Méthode pour comparer les mots de passe lors de la connexion.
 * @function
 * @name userSchema.methods.matchPassword
 * @param {string} enteredPassword - Le mot de passe entré par l'utilisateur lors de la connexion.
 * @returns {Promise<boolean>} Retourne `true` si le mot de passe est correct, sinon `false`.
 */


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Méthode pour générer un token JWT pour l'utilisateur.
 * @function
 * @name userSchema.methods.generateAuthToken
 * @returns {string} Le token JWT généré.
 */


userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * Modèle User pour MongoDB
 * @type {mongoose.Model<User>}
 */

module.exports = mongoose.model('User', userSchema);
