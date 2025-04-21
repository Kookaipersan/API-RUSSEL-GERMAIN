/**
 * @file authMiddleware.js
 * @description Middleware qui vérifie l'authentification de l'utilisateur.
 * Ce middleware vérifie la présence et la validité du token d'authentification dans l'en-tête `Authorization` ou dans un cookie.
 * Si le token est valide, il attache l'utilisateur à la requête (`req.user`) et permet à l'application de continuer le traitement.
 * Si le token est invalide ou manquant, il redirige ou renvoie une réponse d'erreur.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware d'authentification.
 * Vérifie la validité du token d'authentification dans l'en-tête `Authorization` ou dans les cookies.
 * Si le token est valide, l'utilisateur est ajouté à la requête (`req.user`).
 * Si le token est invalide ou manquant, une erreur est renvoyée ou l'utilisateur est redirigé.
 *
 * @function auth
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {Function} next - La fonction pour passer au middleware suivant si l'authentification est réussie.
 * @returns {void}
 * @throws {Object} 401 Unauthorized - Si le token est manquant ou invalide.
 * @example
 * app.use('/protectedRoute', auth, (req, res) => {
 *   res.json({ message: 'Accès autorisé' });
 * });
 */


const auth = async (req, res, next) => {
  let token = null;

  //  Priorité à l'en-tête Authorization (API REST)
  if (req.header("Authorization")?.startsWith("Bearer ")) {
    token = req.header("Authorization").split(" ")[1];
  }

  // Sinon, token dans le cookie (frontend EJS)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    // Différencier le rendu selon le contexte (API ou frontend)
    return req.accepts("html")
      ? res.redirect("/")
      : res.status(401).json({ error: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    // Si cookie invalide → on le supprime et redirige
    if (req.cookies?.token) {
      res.clearCookie("token");
      return res.redirect("/");
    }
    res.status(401).json({ error: "Token invalide" });
  }
};

module.exports = auth;

