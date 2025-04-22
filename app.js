
/**
 * @file app.js
 * @description Point d'entrée principal de l'application. 
 * Ce fichier configure l'application Express, les middlewares, les routes, et la connexion à la base de données.
 * Il configure également la vue (avec EJS) et la gestion des sessions utilisateurs.
 * Le serveur est démarré à la fin du fichier sur un port configuré dans les variables d'environnement.
 * 
 * @requires express
 * @requires dotenv
 * @requires cookie-parser
 * @requires method-override
 * @requires body-parser
 * @requires morgan
 * @requires cors
 * @requires path
 * @requires jsonwebtoken
 * @requires swagger-ui-express
 * @requires ./swaggerOptions
 * @requires ./config/db
 * @requires ./middleware/authMiddleware
 * @requires ./routes/catwayRoutes
 * @requires ./routes/reservationRoutes
 * @requires ./routes/userRoutes
 * @requires ./routes/dashboardRoutes
 * @requires ./models/Reservation
 * @requires ./models/Catway
 * @requires ./models/User
 */

// require("dotenv").config();

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const authMiddleware = require("./middleware/authMiddleware"); // Ajuste le chemin si nécessaire

const catwayRoutes = require("./routes/catwayRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const Reservation = require("./models/Reservation");
const Catway = require("./models/Catway");

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions');




dotenv.config();
connectDB(); // Connexion à MongoDB

const app = express();

/**
 * Middleware de gestion des logs, de la sécurité, et du corps des requêtes.
 */
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));



/**
 * Route pour afficher la documentation de l'API via Swagger UI.
 * @route {GET} /documentation
 * @returns {HTML} L'interface Swagger UI pour interagir avec l'API.
 */

app.use(
  '/documentation',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: `
      .topbar-wrapper::before {
        content: '← Retour à l\\'accueil';
        display: inline-block;
        margin: 10px 0;
        font-size: 16px;
        color: #3498db;
        cursor: pointer;
      }

      .topbar-wrapper::before:hover {
        text-decoration: underline;
      }
    `,
    customJs: '/swagger-custom.js' // Une seule ligne maintenant
  })
);

/**
 * Middleware pour désactiver le cache sur toutes les réponses HTTP.
 */
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

/**
 * Configuration des routes pour les catways, réservations, utilisateurs et dashboard.
 * Ces routes gèrent les opérations CRUD pour chaque modèle et le tableau de bord de l'utilisateur.
 * @route {GET} /catways - Liste des catways
 * @route {GET} /reservations - Liste des réservations
 * @route {GET} /users - Liste des utilisateurs
 * @route {GET} /dashboard - Tableau de bord de l'utilisateur
 */

app.use("/catways", catwayRoutes);
app.use("/reservations", reservationRoutes); // Utilise directement /reservations
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);

/**
 * Configuration du moteur de vue EJS.
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * Route d'accueil de l'application avec un formulaire de connexion.
 * @route {GET} /
 * @returns {void}
 * @summary Page d'accueil avec formulaire de connexion
 */

app.get("/", (req, res) => {
  res.render("index", { title: "Accueil", user: req.user || null });
});

/**
 * Route pour afficher la liste des catways (exigence d'authentification).
 * @route {GET} /catways
 * @returns {void}
 * @summary Liste des catways
 * @security JWT
 * @description Route protégée pour afficher tous les catways.
 */

app.get("/catways", authMiddleware, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.render("catways/list", { catways, title: "Liste des Catways" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des catways");
  }
});

/**
 * Route pour afficher la liste des réservations (exigence d'authentification).
 * @route {GET} /reservations
 * @returns {void}
 * @summary Liste des réservations
 * @security JWT
 * @description Route protégée pour afficher toutes les réservations.
 */

app.get("/reservations", authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.render("reservations/list", {
      title: "Liste des Réservations",
      reservations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des réservations");
  }
});

/**
 * Route pour afficher la liste des utilisateurs (exigence d'authentification).
 * @route {GET} /users
 * @returns {void}
 * @summary Liste des utilisateurs
 * @security JWT
 * @description Route protégée pour afficher tous les utilisateurs.
 */

app.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.render("users/list", { title: "Liste des Utilisateurs", users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des utilisateurs");
  }
});

/**
 * Route pour gérer la déconnexion en supprimant le cookie contenant le token.
 * @route {GET} /logout
 * @returns {void}
 * @summary Déconnexion de l'utilisateur
 * @description Déconnecte un utilisateur en supprimant le cookie contenant le token.
 */

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/", { title: "Déconnexion - Port Russel" });
});

/**
 * Middleware de gestion des erreurs.
 * @param {Error} err - L'erreur capturée.
 * @param {Object} req - L'objet de la requête.
 * @param {Object} res - L'objet de la réponse.
 * @param {Function} next - Fonction pour passer à l'erreur suivante.
 * @returns {void}
 * @description Middleware pour capturer et gérer les erreurs serveur.
 */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

/**
 * Route de connexion de l'utilisateur.
 * @route {POST} /login
 * @param {string} email.body.required - Email de l'utilisateur
 * @param {string} password.body.required - Mot de passe de l'utilisateur
 * @returns {object} 200 - Token JWT
 * @returns {Error} 401 - Identifiants invalides
 * @summary Authentifie un utilisateur
 */

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .render("index", {
          error: "Email ou mot de passe invalide.",
          title: "Connexion - Port Russel",
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Stocke le token dans un cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 jours
    });

    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
});

/**
 * Lancement du serveur Express.
 * Le serveur écoute sur le port spécifié dans les variables d'environnement.
 * @param {number} PORT - Le port sur lequel le serveur va écouter.
 * @returns {void}
 * @summary Démarre le serveur Express sur un port spécifié.
 */

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
