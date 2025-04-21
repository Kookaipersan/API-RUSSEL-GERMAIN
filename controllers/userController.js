const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     description: Authentifie un utilisateur et renvoie un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, token JWT retourné
 *       400:
 *         description: Utilisateur non trouvé ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */

/**
 * Gère la connexion d'un utilisateur.
 * Vérifie les informations d'identification, génère un token et redirige l'utilisateur.
 * @route POST /login
 * @param {Object} req - L'objet de requête Express contenant l'email et le mot de passe
 * @param {Object} res - L'objet de réponse Express pour envoyer la réponse
 */

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("index", { error: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("index", { error: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // On envoie le token dans un cookie sécurisé
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true si HTTPS
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 jours
    });

    res.redirect("/dashboard"); // Redirection vers la vue protégée
  } catch (err) {
    console.error(err);
    res.status(500).render("index", { error: "Erreur serveur" });
  }
};

/**
 * Affiche les détails d'un utilisateur spécifique.
 * @route GET /users/:id
 * @param {Object} req - L'objet de requête Express contenant l'ID de l'utilisateur
 * @param {Object} res - L'objet de réponse Express pour envoyer la réponse
 */

exports.viewUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('Utilisateur non trouvé');
    res.render('users/view', { user, title: 'Détail utilisateur' });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Affiche le formulaire pour modifier un utilisateur.
 * @route GET /users/:id/edit
 * @param {Object} req - L'objet de requête Express contenant l'ID de l'utilisateur
 * @param {Object} res - L'objet de réponse Express pour envoyer la réponse
 */

exports.editUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('Utilisateur non trouvé');
    res.render('users/edit', { user, title: 'Modifier utilisateur' });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Met à jour les informations d'un utilisateur.
 * @route POST /users/:id/edit
 * @param {Object} req - L'objet de requête Express contenant les nouvelles données de l'utilisateur
 * @param {Object} res - L'objet de réponse Express pour envoyer la réponse
 */

exports.updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Supprime un utilisateur de la base de données.
 * @route DELETE /users/:id
 * @param {Object} req - L'objet de requête Express contenant l'ID de l'utilisateur
 * @param {Object} res - L'objet de réponse Express pour envoyer la réponse
 */

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};
