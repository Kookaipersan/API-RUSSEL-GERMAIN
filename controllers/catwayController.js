// controllers/catwayController.js
const Catway = require('../models/Catway'); // Import du modèle Catway

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Crée un nouveau catway
 *     tags: [Catways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: string
 *                 description: Le numéro du catway
 *               catwayType:
 *                 type: string
 *                 description: Le type de catway
 *               catwayState:
 *                 type: string
 *                 description: L'état du catway
 *     responses:
 *       201:
 *         description: Catway créé avec succès
 *       500:
 *         description: Erreur lors de la création du catway
 */

/**
 * Crée un nouveau catway.
 * @route POST /catways
 * @param {Object} req - L'objet de requête Express
 * @param {Object} res - L'objet de réponse Express
 */

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

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Récupère tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste de tous les catways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 *       500:
 *         description: Erreur serveur
 */

/**
 * Récupère tous les catways.
 * @route GET /catways
 * @param {Object} req - L'objet de requête Express
 * @param {Object} res - L'objet de réponse Express
 */

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find(); // Récupère tous les catways depuis la base de données
    res.render('catways/list', { catways, title: "Liste des Catways" }); // Passe les catways à la vue
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Récupère un catway par son ID
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catway trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       404:
 *         description: Catway non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * Récupère un catway par son ID.
 * @route GET /catways/:id
 * @param {Object} req - L'objet de requête Express
 * @param {Object} res - L'objet de réponse Express
 */

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

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     summary: Met à jour l'état d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayState:
 *                 type: string
 *                 description: L'état du catway à mettre à jour
 *     responses:
 *       200:
 *         description: Catway mis à jour avec succès
 *       404:
 *         description: Catway non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * Met à jour l'état d'un catway.
 * @route PUT /catways/:id
 * @param {Object} req - L'objet de requête Express
 * @param {Object} res - L'objet de réponse Express
 */

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

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catway supprimé avec succès
 *       404:
 *         description: Catway non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * Supprime un catway.
 * @route DELETE /catways/:id
 * @param {Object} req - L'objet de requête Express
 * @param {Object} res - L'objet de réponse Express
 */

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
