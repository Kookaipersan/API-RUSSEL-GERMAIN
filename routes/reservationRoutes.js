const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


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
      userId: req.user._id  // 👈 Lien avec l'utilisateur connecté
    });

    await reservation.save();
    res.status(201).json({ message: "Réservation créée avec succès", reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la création de la réservation" });
  }
});

// Lister les réservations d'un catway
router.get('/:id/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer une réservation spécifique
router.get('/:id/reservations/:reservationId', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Modifier une réservation
router.put('/:id/reservations/:reservationId', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    reservation.clientName = req.body.clientName || reservation.clientName;
    reservation.boatName = req.body.boatName || reservation.boatName;
    reservation.startDate = req.body.startDate || reservation.startDate;
    reservation.endDate = req.body.endDate || reservation.endDate;
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer une réservation
router.delete('/:id/reservations/:reservationId', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    await reservation.remove();
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
