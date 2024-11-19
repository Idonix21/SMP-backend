const https = require("https");
const fs = require("fs");
const express = require("express");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./models/models");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const logRoutes = require("./routes/logRoutes");
require("./autoApprove"); // Подключение скрипта для автоматического одобрения заявок

const app = express();
const PORT = 8443; // Новый SSL-порт

// Middleware для CORS
const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://threeyakorya.ru:8080", // Укажите ваш домен с портом
  })
);

// Middleware для парсинга JSON
app.use(express.json());

// Подключение маршрутов
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/logs", logRoutes);

// Указываем папку для раздачи статических файлов фронтенда
app.use(express.static(path.join(__dirname, "../threeYakorya-frontend/dist")));

// Обработка всех остальных маршрутов для поддержки client-side routing
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../threeYakorya-frontend/dist", "index.html")
  );
});

// Настройка SSL-сертификатов (замените пути на ваши файлы сертификатов)
const privateKey = fs.readFileSync(
  path.join(__dirname, "ssl", "certificate.key"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "ssl", "certificate.crt"),
  "utf8"
);
const ca = fs.readFileSync(
  path.join(__dirname, "ssl", "certificate_ca.crt"),
  "utf8"
);

const credentials = { key: privateKey, cert: certificate, ca: ca };

const httpsServer = https.createServer(credentials, app);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Подключение к базе данных успешно установлено.");

    await sequelize.sync({ alter: true });
    console.log("Все таблицы синхронизированы.");

    httpsServer.listen(PORT, () => {
      console.log(`HTTPS сервер запущен на https://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка при подключении к базе данных:", error);
  }
};

start();
