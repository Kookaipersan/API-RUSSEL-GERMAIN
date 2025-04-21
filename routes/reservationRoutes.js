const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// 📝 Formulaire de création
router.get("/create", authMiddleware, (req, res) => {
  res.render("reservations/create");
});

// 🔐 Créer une nouvelle réservation
router.post("/", authMiddleware, async (req, res) => {
  const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;
  try {
    const reservation = new Reservation({
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate,
      userId: req.user._id
    });
    await reservation.save();
    res.status(201).json({ message: "Réservation créée avec succès", reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la création" });
  }
});

// 📋 Liste des réservations
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.render("reservations/list", { reservations, title: "Liste des réservations" });
  } catch (err) {
    res.status(500).send("Erreur lors du chargement des réservations");
  }
});

// 🔍 Voir une réservation
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("userId")
      .populate("catwayId");
    if (!reservation) return res.status(404).send("Réservation non trouvée");
    res.render("reservations/view", { reservation, title: "Détails de la réservation" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

// ✏️ Formulaire d'édition
router.get("/:id/edit", authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).send("Réservation non trouvée");
    res.render("reservations/edit", { reservation, title: "Modifier la réservation" });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
});

// 💾 Mise à jour
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await Reservation.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/reservations");
  } catch (err) {
    res.status(500).send("Erreur lors de la mise à jour");
  }
});

// 🗑️ Suppression
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect('/reservations');
  } catch (err) {
    res.status(500).send('Erreur lors de la suppression');
  }
});

module.exports = router;
