// routes/catwayRoutes.js
const express = require('express');
const Catway = require('../models/Catway');
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const catwayController = require('../controllers/catwayController');

// Lister tous les catways
router.get('/', async (req, res) => {
    const catways = await Catway.find();
    res.render('catways/list', { catways, title: "Liste des Catways" });
  });
  
  // Voir un catway
  router.get('/:id', async (req, res) => {
    try {
      const catway = await Catway.findById(req.params.id);
      if (!catway) return res.status(404).send('Catway introuvable');
      res.render('catways/view', { catway, title: "Détails du Catway" });
    } catch (err) {
      res.status(500).send('Something went wrong');
    }
  });
  
  // Formulaire de modification
  router.get('/:id/edit', async (req, res) => {
    try {
      const catway = await Catway.findById(req.params.id);
      if (!catway) return res.status(404).send('Catway introuvable');
      res.render('catways/edit', { catway, title: "Modifier le Catway" });
    } catch (err) {
      res.status(500).send('Erreur serveur');
    }
  });
  
  // Enregistrer la modification
  router.post('/:id/edit', async (req, res) => {
    try {
      await Catway.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/catways');
    } catch (err) {
      res.status(500).send('Erreur lors de la mise à jour');
    }
  });
  
  // Supprimer un catway
  router.post('/:id/delete', async (req, res) => {
    try {
      await Catway.findByIdAndDelete(req.params.id);
      res.redirect('/catways');
    } catch (err) {
      res.status(500).send('Erreur lors de la suppression du catway');
    }
  });

// Supprimer un catway
router.delete('/:id', async (req, res) => {
    try {
      await Catway.findByIdAndDelete(req.params.id);
      res.redirect('/catways');
    } catch (err) {
      console.error('Erreur lors de la suppression du catway', err);
      res.status(500).send('Erreur lors de la suppression du catway');
    }
  });

  
  module.exports = router;
