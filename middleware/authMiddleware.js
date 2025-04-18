const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  let token = null;

  // ✅ 1. Priorité à l'en-tête Authorization (API REST)
  if (req.header("Authorization")?.startsWith("Bearer ")) {
    token = req.header("Authorization").split(" ")[1];
  }

  // ✅ 2. Sinon, token dans le cookie (frontend EJS)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    // Différencier le rendu selon le contexte (API ou frontend)
    return req.accepts("html")
      ? res.redirect("/")
      : res.status(401).json({ error: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    // Si cookie invalide → on le supprime et redirige
    if (req.cookies?.token) {
      res.clearCookie("token");
      return res.redirect("/");
    }
    res.status(401).json({ error: "Token invalide" });
  }
};

module.exports = auth;

