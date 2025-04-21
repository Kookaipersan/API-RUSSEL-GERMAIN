const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");  // Import du middleware
const userController = require("../controllers/userController");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Crée un utilisateur avec les informations fournies dans le corps de la requête.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Informations de l'utilisateur
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 */



/**
 * @route POST /users
 * @group Utilisateurs - Création
 * @summary Crée un nouvel utilisateur
 * @param {string} username.body.required - Nom d'utilisateur
 * @param {string} email.body.required - Email
 * @param {string} password.body.required - Mot de passe
 * @returns {object} 201 - Utilisateur créé
 * @returns {Error} 500 - Erreur serveur
 */

// Créer un utilisateur
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     description: Crée un utilisateur avec les informations d'inscription.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Informations de l'utilisateur
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 */

/**
 * @route POST /users/register
 * @group Utilisateurs - Création
 * @summary Enregistre un nouvel utilisateur (équivalent à POST /)
 * @param {string} username.body.required
 * @param {string} email.body.required
 * @param {string} password.body.required
 * @returns {object} 201 - Utilisateur enregistré
 * @returns {Error} 500 - Erreur serveur
 */

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     description: Récupère tous les utilisateurs enregistrés dans la base de données.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Erreur serveur
 */

/**
 * @route GET /users
 * @group Utilisateurs - Lecture
 * @summary Liste tous les utilisateurs
 * @returns {HTML} 200 - Liste des utilisateurs
 * @returns {Error} 500 - Erreur serveur
 */

// Lister tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("users/list", { users, title: "Liste des utilisateurs" }); // 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users/{id}/edit:
 *   get:
 *     summary: Formulaire d'édition d'un utilisateur
 *     description: Affiche un formulaire permettant de modifier un utilisateur par son ID.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulaire d'édition
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @route GET /users/:id/edit
 * @group Utilisateurs - Formulaires
 * @summary Formulaire d'édition d'un utilisateur
 */

router.get('/:id/edit', userController.editUserForm);

/**
 * @swagger
 * /users/{id}/edit:
 *   post:
 *     summary: Met à jour un utilisateur
 *     description: Met à jour les informations de l'utilisateur spécifié par son ID.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         description: Nouvelles informations de l'utilisateur
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       500:
 *         description: Erreur serveur
 */


/**
 * @route POST /users/:id/edit
 * @group Utilisateurs - Mise à jour
 * @summary Met à jour un utilisateur (via POST)
 */

router.post('/:id/edit', userController.updateUser); 

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Affiche les détails d'un utilisateur
 *     description: Affiche les informations d'un utilisateur spécifique par son ID.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */


/**
 * @route GET /users/:id
 * @group Utilisateurs - Lecture
 * @summary Détails d'un utilisateur
 */

router.get('/:id', userController.viewUser);

/**
 * @swagger
 * /users/{id}/delete:
 *   post:
 *     summary: Supprime un utilisateur
 *     description: Supprime un utilisateur spécifié par son ID.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @route POST /users/:id/delete
 * @group Utilisateurs - Suppression
 * @summary Supprime un utilisateur (via POST)
 */

router.post('/:id/delete', userController.deleteUser); 

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Récupère un utilisateur par email
 *     description: Recherche un utilisateur via son email.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */


/**
 * @route GET /users/email/:email
 * @group Utilisateurs - Lecture
 * @summary Récupère un utilisateur par son email
 * @param {string} email.path.required - Email de l'utilisateur
 */


// Récupérer un utilisateur par son email
router.get("/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/**
 * @swagger
 * /users/email/{email}:
 *   put:
 *     summary: Met à jour un utilisateur par email
 *     description: Permet de mettre à jour un utilisateur en fonction de son email.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email de l'utilisateur
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         description: Nouvelles informations à mettre à jour
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */


/**
 * @route PUT /users/email/:email
 * @group Utilisateurs - Mise à jour
 * @summary Met à jour un utilisateur par email
 * @middleware auth - Authentification requise
 */

// Modifier un utilisateur
router.put("/email/:email", auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /users/email/{email}:
 *   delete:
 *     summary: Supprime un utilisateur par email
 *     description: Supprime un utilisateur à partir de son email.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @route DELETE /users/email/:email
 * @group Utilisateurs - Suppression
 * @summary Supprime un utilisateur par email
 * @middleware auth - Authentification requise
 */

// Supprimer un utilisateur
router.delete("/email/:email", auth, async (req, res) =>{
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route POST /users/login
 * @group Authentification
 * @summary Connecte un utilisateur et retourne un token
 * @param {string} email.body.required
 * @param {string} password.body.required
 */

// Route pour connecter un utilisateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Tentative de login pour :', email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const token = user.generateAuthToken();
    res.json({ token });
  } catch (err) {
    console.error('Erreur dans /login :', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', userController.viewUser);

/**
 * @route GET /users/logout
 * @group Authentification
 * @summary Déconnecte l'utilisateur (logique côté client)
 */

// Déconnexion d'un utilisateur (logique simple pour déconnexion)
router.get("/logout", (req, res) => {
  // La déconnexion sera gérée côté client (par suppression du token)
  res.json({ message: "Logged out successfully" });
});

/**
 * @route DELETE /users/:id
 * @group Utilisateurs - Suppression
 * @summary Supprime un utilisateur par ID
 */

router.delete('/:id', userController.deleteUser);


module.exports = router;
