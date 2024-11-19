// logController.js
const { Log, User, MissingPerson } = require("../models/models");
const moment = require("moment");

// Метод для добавления записи в лог
exports.createLog = async (req, res) => {
  try {
    const { reportId, action } = req.body;

    const report = await MissingPerson.findByPk(reportId, {
      include: [
        { model: User, attributes: ["firstName", "secondName", "patronymic"] },
      ],
    });

    if (!report) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    const applicant = report.User; // Получаем данные заявителя
    const applicantName = applicant
      ? `${applicant.secondName} ${applicant.firstName || ""} ${
          applicant.patronymic || ""
        }`
      : "Неизвестно";

    const missingPersonName =
      report.secondName && report.firstName
        ? `${report.secondName} ${report.firstName} ${report.patronymic || ""}`
        : "Неизвестно";

    let message = "";

    if (action === "approved") {
      message = `Пользователь ${applicantName} сообщил о пропаже ${missingPersonName} в ${report.addressLoss.split(
        ","
      )}`;
    } else if (action === "found") {
      message = `Пользователь ${applicantName} сообщил о нахождении ${missingPersonName} в ${report.addressLoss.split(
        ","
      )}`;
    } else {
      return res.status(400).json({ message: "Некорректное действие" });
    }

    const logEntry = await Log.create({
      reportId,
      reporterName: applicantName,
      reportLocation: report.addressLoss,
      userId: req.user.id,
      message,
      time: new Date(),
    });

    res
      .status(201)
      .json({ message: "Запись в лог успешно добавлена", logEntry });
  } catch (error) {
    console.error("Ошибка при создании записи в логе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Метод для получения всех логов
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["firstName", "secondName"] }],
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Ошибка при получении логов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Метод для удаления всех логов
exports.deleteAllLogs = async (req, res) => {
  try {
    await Log.destroy({ where: {} }); // Удаление всех записей из таблицы Log
    res.status(200).json({ message: "Все логи успешно удалены" });
  } catch (error) {
    console.error("Ошибка при удалении логов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Метод для удаления логов по reportId
exports.deleteLogsByReportId = async (req, res) => {
  try {
    const { reportId } = req.params;
    const deletedCount = await Log.destroy({ where: { reportId } });

    if (deletedCount > 0) {
      res
        .status(200)
        .json({ message: `Логи для reportId ${reportId} успешно удалены` });
    } else {
      res
        .status(404)
        .json({ message: "Логи не найдены для указанного reportId" });
    }
  } catch (error) {
    console.error("Ошибка при удалении логов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
