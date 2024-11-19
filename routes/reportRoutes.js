const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Маршрут для получения API-ключа карты
router.get("/map-api-key", reportController.getMapApiKey);

// Маршрут для получения всех заявок с координатами
router.get("/map-data", reportController.getReportsWithCoordinates);

// Маршрут для создания новой заявки (доступен только авторизованным пользователям)
router.post("/", authMiddleware, reportController.createReport);

// Маршрут для обновления данных 2D-модельки пропавшего человека
router.put("/update-avatar/:id", authMiddleware, reportController.updateAvatar);

// Маршрут для пометки заявки как найденной (доступен только заявителю и пользователям с ролью GOD)
router.put(
  "/mark-as-found/:id",
  authMiddleware,
  roleMiddleware(["USER", "GOD"]),
  reportController.markAsFound
);

// Маршрут для модерации заявки (доступен только модераторам и пользователям с ролью GOD)
router.put(
  "/moderate/:id",
  authMiddleware,
  roleMiddleware(["MODERATOR", "GOD"]),
  reportController.moderateReport
);

// Маршрут для получения всех заявок (доступен модераторам и пользователям с ролью GOD)
router.get(
  "/all",
  authMiddleware,
  roleMiddleware(["MODERATOR", "GOD"]),
  reportController.getAllReports
);

// Маршрут для получения заявки по ID
router.get("/:id", authMiddleware, reportController.getReportById);

/*router.get("/user/:idUser", authMiddleware, reportController.getReportByUserId); */

module.exports = router;

// Маршрут для удаления заявки по ID (доступен только модераторам и пользователям с ролью GOD)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["MODERATOR", "GOD"]),
  reportController.deleteReportById
);
