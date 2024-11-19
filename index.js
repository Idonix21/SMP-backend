const express = require("express");
const path = require("path");
const { sequelize } = require("./models/models");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const logRoutes = require("./routes/logRoutes");
require("./autoApprove"); // Подключение скрипта для автоматического одобрения заявок
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // Укажите адрес вашего фронтенда
  })
);
app.use(express.json());

// Подключение маршрутов
app.use("/api/auth", authRoutes); // Проверьте, что этот маршрут подключён
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/logs", logRoutes);
// Настройка для обслуживания статических файлов из папки 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Подключение к базе данных успешно установлено.");

    await sequelize.sync({ alter: true });
    console.log("Все таблицы синхронизированы.");

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка при подключении к базе данных:", error);
  }
};

start();
