// require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
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

dotenv.config();
connectDB(); // Connexion à MongoDB

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// Désactiver le cache pour toutes les réponses
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Routes
app.use("/catways", catwayRoutes);
app.use("/reservations", reservationRoutes); // Utilise directement /reservations
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// // Route test
// app.get("/", (req, res) => {
//   res.send("Bienvenue à l'API du Port Russell ");
// });

// Page d'accueil avec formulaire de connexion
app.get("/", (req, res) => {
  res.render("index", { title: "Accueil", user: req.user || null });
});

//Page pour les catways
app.get("/catways", authMiddleware, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.render("catways/list", { catways, title: "Liste des Catways" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des catways");
  }
});

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

app.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.render("users/list", { title: "Liste des Utilisateurs", users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des utilisateurs");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/", { title: "Déconnexion - Port Russel" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

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

// Lancement du serveur
const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
