const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // Проверьте путь к файлу

// Маршрут для регистрации
router.post("/register", authController.registerUser);

// Маршрут для входа
router.post("/login", authController.loginUser);

module.exports = router;
