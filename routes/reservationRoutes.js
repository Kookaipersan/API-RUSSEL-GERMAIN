const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();

// Créer une réservation
router.post('/:id/reservations', async (req, res) => {
  const { clientName, boatName, startDate, endDate } = req.body;
  try {
    const reservation = new Reservation({
      catwayNumber: req.params.id,
      clientName,
      boatName,
      startDate,
      endDate
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
