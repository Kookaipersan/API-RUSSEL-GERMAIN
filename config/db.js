const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Change `MONGO_URI` en `MONGODB_URI`
    await mongoose.connect(process.env.MONGODB_URI); 
    console.log('✅ MongoDB connecté avec succès');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

