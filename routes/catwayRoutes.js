const express = require('express');
const Catway = require('../models/Catway');
const auth = require("../middleware/authMiddleware"); // Importer le middleware d'authentification
const router = express.Router();


// Exemple de route protégée
router.get("/", auth, async (req, res) => {
    try {
      const catways = await Catway.find();
      res.status(200).send(catways);
    } catch (err) {
      res.status(500).send({ error: "Erreur lors de la récupération des catways" });
    }
  });


// Créer un catway
router.post('/', async (req, res) => {
  const { catwayNumber, catwayType, catwayState } = req.body;
  try {
    const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
    await newCatway.save();
    res.status(201).json(newCatway);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lister tous les catways
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer un catway par son numéro
router.get('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: 'Catway not found' });
    }
    res.json(catway);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour l'état d'un catway
router.put('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: 'Catway not found' });
    }
    catway.catwayState = req.body.catwayState || catway.catwayState;
    await catway.save();
    res.json(catway);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer un catway
router.delete('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: 'Catway not found' });
    }
    await catway.remove();
    res.json({ message: 'Catway deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
