const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Маршрут для получения информации о пользователе по ID
router.get("/:id", authMiddleware, userController.getUserById);
// Маршрут для получения роли пользователя
router.get("/role", authMiddleware, userController.getUserRole);

// Маршрут для удаления пользователя (доступен только для роли GOD)
router.delete(
  "/delete",
  authMiddleware,
  roleMiddleware(["GOD"]),
  userController.deleteUser
);

// Маршрут для получения списка всех пользователей (доступен только модераторам и выше)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["MODERATOR", "GOD"]),
  userController.getAllUsers
);

module.exports = router;
