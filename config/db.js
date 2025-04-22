const mongoose = require("mongoose");
require("dotenv").config(); // Bien présent ici aussi (important si ce fichier est appelé isolément)

const connectDB = async () => {
  try {
    console.log("ENV ENTIER", process.env); // <- ajoute ça tout en haut
    const uri = process.env.MONGODB_URI;
    console.log("URI de MongoDB:", uri); // ← ça aide à voir ce que Render reçoit
    await mongoose.connect(uri);
    console.log("MongoDB connecté avec succès");
  } catch (err) {
    console.error("Erreur de connexion MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


