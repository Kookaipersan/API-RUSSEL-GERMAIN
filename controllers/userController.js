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
