// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Affiche le tableau de bord de l'utilisateur connecté
 *     description: Cette route affiche la page du tableau de bord de l'utilisateur connecté, avec des informations personnalisées.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []  # Si tu utilises une authentification JWT avec un token dans l'en-tête Authorization
 *     responses:
 *       200:
 *         description: Page du tableau de bord de l'utilisateur
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Non autorisé si l'utilisateur n'est pas connecté ou le token est invalide
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @route GET /dashboard
 * @group Dashboard - Interface utilisateur
 * @summary Affiche le tableau de bord de l'utilisateur connecté
 * @middleware authMiddleware - Requiert une authentification
 * @returns {HTML} 200 - Page du tableau de bord
 * @returns {Error} 401 - Non autorisé si l'utilisateur n'est pas connecté
 */

router.get("/", auth, dashboardController.showDashboard);

module.exports = router;
