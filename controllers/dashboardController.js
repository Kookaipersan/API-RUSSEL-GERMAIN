// controllers/dashboardController.js
const Reservation = require("../models/Reservation");

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Récupère les informations du tableau de bord
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Détails du tableau de bord
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 100
 *                 totalReservations:
 *                   type: integer
 *                   example: 250
 *                 totalCatways:
 *                   type: integer
 *                   example: 30
 */

/**
 * Affiche le dashboard de l'utilisateur avec ses réservations actuelles.
 * @route GET /dashboard
 * @param {Object} req - L'objet de requête Express
 * @param {Object} res - L'objet de réponse Express
 */

exports.showDashboard = async (req, res) => {
  try {
    // Recherche des réservations de l'utilisateur connecté, avec population de catwayId
    const reservations = await Reservation.find({
      userId: req.user._id, // Réservations de l'utilisateur connecté
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    }).populate("catwayId"); 

    // Rendu de la page dashboard avec les réservations et autres informations
    res.render("dashboard", {
      user: req.user,
      reservations,
      title: 'Dashboard - Port Russel',
      date: new Date().toLocaleDateString("fr-FR"),
    });
  } catch (err) {
    console.error("Erreur dashboard :", err);
    res.status(500).send("Erreur serveur");
  }
};
