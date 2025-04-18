// seeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Reservation = require("./models/Reservation");
const Catway = require("./models/Catway");
const User = require("./models/User");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connecté à MongoDB Atlas"))
  .catch((err) => console.error("❌ Erreur de connexion à MongoDB", err));

const seedData = async () => {
  try {
    // 1. Charger les données
    const catways = JSON.parse(fs.readFileSync("./data/catways.json", "utf-8"));
    const reservations = JSON.parse(fs.readFileSync("./data/reservations.json", "utf-8"));

    // 2. Supprimer les anciennes données
    await Reservation.deleteMany();
    await Catway.deleteMany();

    // 3. Ajouter les catways
    await Catway.insertMany(catways);
    console.log("✅ Catways insérés");

    // 4. Récupérer un utilisateur existant (n'importe lequel)
    const user = await User.findOne();
    if (!user) {
      throw new Error("❌ Aucun utilisateur trouvé pour lier les réservations");
    }

    // 5. Ajouter son ID à chaque réservation
    const reservationsWithUser = reservations.map(r => ({
      ...r,
      userId: user._id
    }));

    // 6. Insérer les réservations
    await Reservation.insertMany(reservationsWithUser);
    console.log("✅ Réservations insérées");
    
    process.exit();

  } catch (err) {
    console.error("❌ Erreur lors de l'importation :", err);
    process.exit(1);
  }
};

seedData();


   