

// routes/catwayRoutes.js
const express = require('express');
const Catway = require('../models/Catway');
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const catwayController = require('../controllers/catwayController');


/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Récupère la liste de tous les catways
 *     description: Récupère tous les catways disponibles dans la base de données.
 *     responses:
 *       200:
 *         description: Liste des catways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 */

/**
 * @route GET /catways
 * @group Catways - Gestion des catways
 * @summary Liste tous les catways
 * @returns {HTML} 200 - Page HTML avec la liste des catways
 * @returns {Error} 500 - Erreur lors de la récupération
 */

// Lister tous les catways
router.get('/', async (req, res) => {
    const catways = await Catway.find();
    res.render('catways/list', { catways, title: "Liste des Catways" });
  });

  /**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Détail d’un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page HTML avec les détails du catway
 *       404:
 *         description: Catway introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @route GET /catways/:id
 * @group Catways - Gestion des catways
 * @summary Affiche les détails d’un catway
 * @param {string} id.path.required - ID du catway
 * @returns {HTML} 200 - Page HTML avec les détails
 * @returns {Error} 404 - Catway introuvable
 * @returns {Error} 500 - Erreur serveur
 */

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

  /**
 * @swagger
 * /catways/{id}/edit:
 *   get:
 *     summary: Formulaire d’édition du catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulaire HTML
 *       404:
 *         description: Catway introuvable
 *       500:
 *         description: Erreur serveur
 */

  /**
 * @route GET /catways/:id/edit
 * @group Catways - Gestion des catways
 * @summary Affiche le formulaire d’édition d’un catway
 * @param {string} id.path.required - ID du catway
 * @returns {HTML} 200 - Formulaire d’édition
 * @returns {Error} 404 - Catway introuvable
 * @returns {Error} 500 - Erreur serveur
 */
  
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

  /**
 * @swagger
 * /catways/{id}/edit:
 *   post:
 *     summary: Enregistre les modifications du catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirection vers /catways
 *       500:
 *         description: Erreur lors de la mise à jour
 */


  /**
 * @route POST /catways/:id/edit
 * @group Catways - Gestion des catways
 * @summary Enregistre les modifications sur un catway
 * @param {string} id.path.required - ID du catway
 * @returns {Redirect} 302 - Redirection vers /catways
 * @returns {Error} 500 - Erreur lors de la mise à jour
 */
  
  // Enregistrer la modification
  router.post('/:id/edit', async (req, res) => {
    try {
      await Catway.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/catways');
    } catch (err) {
      res.status(500).send('Erreur lors de la mise à jour');
    }
  });

  /**
 * @swagger
 * /catways/{id}/delete:
 *   post:
 *     summary: Supprime un catway via formulaire
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirection vers /catways
 *       500:
 *         description: Erreur lors de la suppression
 */

  /**
 * @route POST /catways/:id/delete
 * @group Catways - Gestion des catways
 * @summary Supprime un catway via formulaire
 * @param {string} id.path.required - ID du catway
 * @returns {Redirect} 302 - Redirection vers /catways
 * @returns {Error} 500 - Erreur lors de la suppression
 */
  
  // Supprimer un catway
  router.post('/:id/delete', async (req, res) => {
    try {
      await Catway.findByIdAndDelete(req.params.id);
      res.redirect('/catways');
    } catch (err) {
      res.status(500).send('Erreur lors de la suppression du catway');
    }
  });

  /**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Supprime un catway (API)
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirection vers /catways
 *       500:
 *         description: Erreur lors de la suppression
 */


  /**
 * @route DELETE /catways/:id
 * @group Catways - Gestion des catways
 * @summary Supprime un catway via requête DELETE (API)
 * @param {string} id.path.required - ID du catway
 * @returns {Redirect} 302 - Redirection vers /catways
 * @returns {Error} 500 - Erreur lors de la suppression
 */

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
