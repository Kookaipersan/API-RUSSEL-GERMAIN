const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");  // Import du middleware
const userController = require("../controllers/userController");


// Créer un utilisateur
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lister tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("users/list", { users, title: "Liste des utilisateurs" }); // 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/edit', userController.editUserForm);
router.post('/:id/edit', userController.updateUser); // ou PUT si tu fais via AJAX ou form méthode PUT
router.get('/:id', userController.viewUser);
router.post('/:id/delete', userController.deleteUser); // ou DELETE si AJAX





// Récupérer un utilisateur par son email
router.get("/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Modifier un utilisateur
router.put("/email/:email", auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer un utilisateur
router.delete("/email/:email", auth, async (req, res) =>{
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour connecter un utilisateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Tentative de login pour :', email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const token = user.generateAuthToken();
    res.json({ token });
  } catch (err) {
    console.error('Erreur dans /login :', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', userController.viewUser);

// Déconnexion d'un utilisateur (logique simple pour déconnexion)
router.get("/logout", (req, res) => {
  // La déconnexion sera gérée côté client (par suppression du token)
  res.json({ message: "Logged out successfully" });
});



router.delete('/:id', userController.deleteUser);


module.exports = router;
