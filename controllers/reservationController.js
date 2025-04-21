/**
 * @swagger
 * /reservations/{id}/edit:
 *   post:
 *     summary: Met à jour une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *       - in: body
 *         name: reservation
 *         description: Nouvelle réservation
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               description: L'utilisateur qui effectue la réservation
 *             catway:
 *               type: string
 *               description: Le catway réservé
 *             date:
 *               type: string
 *               format: date
 *               description: La date de la réservation
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */


const Reservation = require("../models/Reservation");

/**
 * Crée une nouvelle réservation.
 * @route POST /reservations
 * @param {Object} req - L'objet de requête Express contenant les informations de la réservation
 * @param {Object} res - L'objet de réponse Express pour envoyer la réponse
 */
exports.createReservation = async (req, res) => {
  const { user, catway, date } = req.body;
  
  try {
    const newReservation = new Reservation({ user, catway, date });
    await newReservation.save();
    res.redirect('/reservations');
  } catch (err) {
    res.status(500).send('Erreur lors de la création de la réservation');
  }
};

/**
 * Modifie une réservation.
 * @route POST /reservations/:id/edit
 * @param {Object} req - L'objet de requête Express contenant les nouvelles données de la réservation
 * @param {Object} res - L'objet de réponse Express pour envoyer la réponse
 */
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { user, catway, date } = req.body;

  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(id, {
      user,
      catway,
      date
    }, { new: true });
    
    if (!updatedReservation) {
      return res.status(404).send('Réservation non trouvée');
    }

    res.redirect('/reservations');
  } catch (err) {
    res.status(500).send('Erreur lors de la mise à jour de la réservation');
  }
};

/**
 * Supprime une réservation.
 * @route DELETE /reservations/:id
 * @param {Object} req - L'objet de requête Express contenant l'ID de la réservation
 * @param {Object} res - L'objet de réponse Express pour envoyer la réponse
 */
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByIdAndDelete(id);
    
    if (!reservation) {
      return res.status(404).send('Réservation non trouvée');
    }

    res.redirect('/reservations');
  } catch (err) {
    res.status(500).send('Erreur lors de la suppression de la réservation');
  }
};
