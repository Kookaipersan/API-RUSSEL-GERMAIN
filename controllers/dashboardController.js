// controllers/dashboardController.js
const Reservation = require("../models/Reservation");

exports.showDashboard = async (req, res) => {
  try {
    // Recherche des réservations de l'utilisateur connecté, avec population de catwayId
    const reservations = await Reservation.find({
      userId: req.user._id, // Réservations de l'utilisateur connecté
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    }).populate("catwayId"); // S'assurer que catwayId est bien une référence

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
