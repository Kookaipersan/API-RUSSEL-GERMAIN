const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    res.redirect("/dashboard"); // 👈 Redirection vers la vue protégée
  } catch (err) {
    console.error(err);
    res.status(500).render("index", { error: "Erreur serveur" });
  }
};

exports.viewUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('Utilisateur non trouvé');
    res.render('users/view', { user, title: 'Détail utilisateur' });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

exports.editUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('Utilisateur non trouvé');
    res.render('users/edit', { user, title: 'Modifier utilisateur' });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

exports.updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};
