const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Маршрут для добавления новой записи в лог (доступен только модераторам и выше)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["MODERATOR", "GOD"]),
  logController.createLog
);

// Маршрут для получения всех записей в логах (доступен всем авторизованным пользователям)
router.get("/", authMiddleware, logController.getAllLogs);

// Новые маршруты для удаления логов
router.delete("/delete/all", logController.deleteAllLogs);
router.delete("/delete/:reportId", logController.deleteLogsByReportId);

module.exports = router;
