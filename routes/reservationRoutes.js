const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


/**
 * @swagger
 * /reservations/create:
 *   get:
 *     summary: Affiche le formulaire de création de réservation
 *     description: Affiche un formulaire pour créer une nouvelle réservation.
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []  # Authentification requise
 *     responses:
 *       200:
 *         description: Page du formulaire de création
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Non autorisé si l'utilisateur n'est pas authentifié
 */



/**
 * @route GET /reservations/create
 * @group Réservations - Formulaires
 * @summary Affiche le formulaire de création de réservation
 * @middleware authMiddleware - Authentification requise
 * @returns {HTML} 200 - Page du formulaire de création
 */


//  Formulaire de création
router.get("/create", authMiddleware, (req, res) => {
  res.render("reservations/create");
});


/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     description: Cette route permet de créer une nouvelle réservation avec les informations fournies dans le corps de la requête.
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []  # Authentification requise
 *     parameters:
 *       - in: body
 *         name: reservation
 *         description: Informations de la réservation
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             catwayNumber:
 *               type: string
 *               description: Le numéro de catway
 *             clientName:
 *               type: string
 *               description: Le nom du client
 *             boatName:
 *               type: string
 *               description: Le nom du bateau
 *             startDate:
 *               type: string
 *               format: date
 *               description: Date de début de la réservation
 *             endDate:
 *               type: string
 *               format: date
 *               description: Date de fin de la réservation
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                 reservation:
 *                   type: object
 *                   $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Erreur serveur lors de la création
 */


/**
 * @route POST /reservations
 * @group Réservations - Création
 * @summary Crée une nouvelle réservation
 * @middleware authMiddleware - Authentification requise
 * @param {string} catwayNumber.body.required - Numéro de catway
 * @param {string} clientName.body.required - Nom du client
 * @param {string} boatName.body.required - Nom du bateau
 * @param {Date} startDate.body.required - Date de début
 * @param {Date} endDate.body.required - Date de fin
 * @returns {object} 201 - Détails de la réservation créée
 * @returns {Error} 500 - Erreur serveur
 */

//  Créer une nouvelle réservation
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

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Récupère et affiche la liste des réservations
 *     description: Cette route récupère toutes les réservations existantes.
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []  # Authentification requise
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Erreur lors du chargement des réservations
 */



/**
 * @route GET /reservations
 * @group Réservations - Lecture
 * @summary Récupère et affiche la liste des réservations
 * @middleware authMiddleware - Authentification requise
 * @returns {HTML} 200 - Page listant les réservations
 * @returns {Error} 500 - Erreur lors du chargement
 */

//  Liste des réservations
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.render("reservations/list", { reservations, title: "Liste des réservations" });
  } catch (err) {
    res.status(500).send("Erreur lors du chargement des réservations");
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Affiche les détails d'une réservation
 *     description: Affiche les détails d'une réservation spécifique en utilisant son ID.
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []  # Authentification requise
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */


/**
 * @route GET /reservations/:id
 * @group Réservations - Lecture
 * @summary Affiche les détails d'une réservation
 * @middleware authMiddleware - Authentification requise
 * @param {string} id.path.required - ID de la réservation
 * @returns {HTML} 200 - Page avec les détails
 * @returns {Error} 404 - Réservation non trouvée
 * @returns {Error} 500 - Erreur serveur
 */

//  Voir une réservation
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

/**
 * @swagger
 * /reservations/{id}/edit:
 *   get:
 *     summary: Affiche le formulaire d'édition d'une réservation
 *     description: Affiche un formulaire pour éditer une réservation existante.
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []  # Authentification requise
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulaire d'édition de réservation
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */


/**
 * @route GET /reservations/:id/edit
 * @group Réservations - Formulaires
 * @summary Affiche le formulaire d'édition d'une réservation
 * @middleware authMiddleware - Authentification requise
 * @param {string} id.path.required - ID de la réservation
 * @returns {HTML} 200 - Formulaire de modification
 * @returns {Error} 404 - Réservation non trouvée
 * @returns {Error} 500 - Erreur serveur
 */

//  Formulaire d'édition
router.get("/:id/edit", authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).send("Réservation non trouvée");
    res.render("reservations/edit", { reservation, title: "Modifier la réservation" });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Met à jour une réservation existante
 *     description: Met à jour les informations d'une réservation en fonction de son ID.
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []  # Authentification requise
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *       - in: body
 *         name: reservation
 *         description: Données à mettre à jour
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             catwayNumber:
 *               type: string
 *             clientName:
 *               type: string
 *             boatName:
 *               type: string
 *             startDate:
 *               type: string
 *               format: date
 *             endDate:
 *               type: string
 *               format: date
 *     responses:
 *       302:
 *         description: Redirige vers la liste des réservations
 *       500:
 *         description: Erreur serveur lors de la mise à jour
 */


/**
 * @route PUT /reservations/:id
 * @group Réservations - Mise à jour
 * @summary Met à jour une réservation existante
 * @middleware authMiddleware - Authentification requise
 * @param {string} id.path.required - ID de la réservation
 * @returns {Redirect} 302 - Redirige vers la liste des réservations
 * @returns {Error} 500 - Erreur serveur
 */

//  Mise à jour
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await Reservation.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/reservations");
  } catch (err) {
    res.status(500).send("Erreur lors de la mise à jour");
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Supprime une réservation
 *     description: Supprime une réservation existante en fonction de son ID.
 *     tags:
 *       - Réservations
 *     security:
 *       - bearerAuth: []  # Authentification requise
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirige vers la liste des réservations
 *       500:
 *         description: Erreur lors de la suppression
 */


/**
 * @route DELETE /reservations/:id
 * @group Réservations - Suppression
 * @summary Supprime une réservation
 * @middleware authMiddleware - Authentification requise
 * @param {string} id.path.required - ID de la réservation
 * @returns {Redirect} 302 - Redirige vers la liste des réservations
 * @returns {Error} 500 - Erreur lors de la suppression
 */

//  Suppression
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect('/reservations');
  } catch (err) {
    res.status(500).send('Erreur lors de la suppression');
  }
});

module.exports = router;
