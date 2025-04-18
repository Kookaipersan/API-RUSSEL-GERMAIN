// require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');  // Ajuste le chemin si nécessaire


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
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// Routes
app.use("/catways", catwayRoutes);
app.use('/catways/:id/reservations', reservationRoutes); // Réservations sous catwayId spécifique
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);


// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route test
app.get("/", (req, res) => {
  res.send("Bienvenue à l'API du Port Russell ");
});

// Page d'accueil (connexion)
app.get('/', (req, res) => {
  res.render('index');
});

//Route pour afficher le dashboard
app.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id });
    const catways = await Catway.find(); // si tu veux aussi afficher les catways

    res.render("dashboard", {
      user: req.user,
      reservations,
      catways,
      date: new Date().toLocaleDateString("fr-FR"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors du chargement du dashboard");
  }
});
 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).render("index", { error: "Email ou mot de passe invalide." });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
  
      // On stocke le token dans un cookie (pour frontend EJS, pratique)
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 jours
      });
  
      res.redirect("/dashboard");
    } catch (err) {
      res.status(500).send("Erreur serveur");
    }
  });
  app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  });


// Lancement du serveur
const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
