// controllers/dashboardController.js
const Reservation = require("../models/Reservation");

exports.showDashboard = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      userId: req.user._id, // 👈 uniquement celles de l'utilisateur connecté
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    }).populate("catwayId"); // si tu veux les infos du catway

    res.render("dashboard", {
      user: req.user,
      reservations,
      date: new Date().toLocaleDateString("fr-FR"),
    });
  } catch (err) {
    console.error("Erreur dashboard :", err);
    res.status(500).send("Erreur serveur");
  }
};
