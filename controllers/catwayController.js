// controllers/catwayController.js
const Catway = require('../models/Catway'); // Import du modèle Catway

// Créer un catway
exports.createCatway = async (req, res) => {
  const { catwayNumber, catwayType, catwayState } = req.body;

  try {
    const newCatway = new Catway({
      catwayNumber,
      catwayType,
      catwayState
    });

    await newCatway.save();
    res.redirect('/catways'); // Redirige vers la liste des catways
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création du catway');
  }
};

// Récupérer tous les catways
exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find(); // Récupère tous les catways depuis la base de données
    res.render('catways/list', { catways, title: "Liste des Catways" }); // Passe les catways à la vue
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Récupérer un catway spécifique
exports.getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) {
      return res.status(404).json({ message: 'Catway non trouvé' });
    }
    res.render('catways/detail', { catway }); // Affiche les détails d'un catway
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier l'état d'un catway
exports.updateCatwayState = async (req, res) => {
  const { id } = req.params;
  const { catwayState } = req.body; // Seul l'état est modifiable
  
  try {
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: id },
      { catwayState }, // Mise à jour de l'état
      { new: true } // Retourne le catway mis à jour
    );

    if (!catway) {
      return res.status(404).send('Catway non trouvé');
    }

    res.status(200).json(catway); // Envoi du catway mis à jour
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la mise à jour du catway');
  }
};

// Supprimer un catway
exports.deleteCatway = async (req, res) => {
  const { id } = req.params;

  try {
    const catway = await Catway.findOneAndDelete({ catwayNumber: id });

    if (!catway) {
      return res.status(404).send('Catway non trouvé');
    }

    res.status(200).send('Catway supprimé');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la suppression du catway');
  }
};
