const webpush = require("../pushConfig");
const axios = require("axios");
// Обязательно импортируем Sequelize
const { sequelize } = require("../models/models"); // Важно для работы с `sequelize.fn`
const { MissingPerson, Avatar, User, Log } = require("../models/models");
const { Op } = require("sequelize"); // Импортируем оператор из Sequelize
const logController = require("./logController");
const multer = require("multer");
const path = require("path"); // Импортируем path для работы с путями

// Функция для обеспечения наличия статуса по умолчанию
const ensureDefaultStatus = async () => {
  const [status] = await Status.findOrCreate({
    where: { id: 1 },
    defaults: { status: "Pending" },
  });
  return status.id;
};

// Конфигурация multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Папка для сохранения фото
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Лимит файла: 1MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Ошибка: Только изображения (jpeg, jpg, png) поддерживаются!");
  },
}).single("photo");

// Метод для получения координат по адресу
async function getCoordinates(address) {
  try {
    // Добавляем Нижегородскую область в адрес, если она отсутствует
    const fullAddress = address.includes("Нижегородская область")
      ? address
      : `${address}, Нижегородская область`;

    console.log("Вызов функции getCoordinates с адресом:", fullAddress);
    const response = await axios.get("https://geocode-maps.yandex.ru/1.x/", {
      params: {
        apikey: process.env.YANDEX_API_KEY,
        format: "json",
        geocode: fullAddress,
      },
    });
    console.log("Ответ от Яндекс Геокодера:", response.data);

    const coordinates =
      response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
        " "
      );
    console.log("Извлеченные координаты:", coordinates);

    return {
      longitude: parseFloat(coordinates[0]),
      latitude: parseFloat(coordinates[1]),
    };
  } catch (error) {
    console.error("Ошибка при получении координат:", error);
    return null;
  }
}

// Метод для создания новой заявки с фото
exports.createReport = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const {
        firstNameApplicant,
        patronymicApplicant,
        secondNameApplicant,
        firstName,
        patronymic,
        secondName,
        gender,
        birthday,
        addressLoss,
        telMissing,
        contactNumberApplicant,
        dateLoss,
        timeLoss,
        circumstances,
        healthStatus,
        addInf,
        items,
        topClothes,
        bottomClothes,
        headWear,
      } = req.body;

      const coordinates = await getCoordinates(addressLoss);
      if (!coordinates) {
        return res
          .status(400)
          .json({ message: "Не удалось получить координаты по адресу" });
      }

      const newReportData = {
        firstNameApplicant,
        patronymicApplicant,
        secondNameApplicant,
        firstName,
        patronymic,
        secondName,
        gender,
        birthday: birthday ? new Date(birthday) : null,
        addressLoss,
        telMissing: telMissing || null,
        contactNumberApplicant,
        dateLoss: dateLoss ? new Date(dateLoss) : null,
        timeLoss: timeLoss || null,
        circumstances: circumstances || null,
        healthStatus: healthStatus || "Неизвестно",
        addInf: addInf || null,
        items: items || null,
        topClothes: topClothes || "Неизвестно",
        bottomClothes: bottomClothes || "Неизвестно",
        headWear: headWear || "Неизвестно",
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        photoUrl: req.file ? req.file.filename : null,
        idStatus: 1,
        idUser: req.user.id, // Привязываем заявку к id пользователя
      };

      const newReport = await MissingPerson.create(newReportData);
      res
        .status(201)
        .json({ message: "Заявка успешно создана", report: newReport });
    } catch (error) {
      console.error("Ошибка при создании заявки:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });
};

// Метод для получения всех заявок с координатами
exports.getReportsWithCoordinates = async (req, res) => {
  try {
    const reports = await MissingPerson.findAll({
      where: { idStatus: 2 }, // Только одобренные заявки (статус 2)
      attributes: [
        "id",
        "firstName",
        "secondName",
        "latitude",
        "longitude",
        "dateLoss",
        "addressLoss",
        "firstNameApplicant",
        "patronymicApplicant",
        "secondNameApplicant",
        "gender",
        "birthday",
        "telMissing",
        "contactNumberApplicant",
        "circumstances",
        "healthStatus",
        "addInf",
        "items",
        "topClothes",
        "bottomClothes",
        "headWear",
        [
          sequelize.fn(
            "concat",
            "http://localhost:7000/uploads/",
            sequelize.col("photoUrl")
          ),
          "photoUrl",
        ], // Полный URL для фото
      ],
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Ошибка при получении заявок с координатами:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Метод для получения всех заявок
exports.getAllReports = async (req, res) => {
  try {
    const reports = await MissingPerson.findAll({
      where: {
        idStatus: {
          [Op.notIn]: [2, 3],
        },
      },
      include: [
        { model: User, attributes: ["firstName", "patronymic", "secondName"] },
      ],
      attributes: [
        "id",
        "firstNameApplicant",
        "secondNameApplicant",
        "patronymicApplicant",
        "firstName",
        "secondName",
        "patronymic",
        "gender",
        "birthday",
        "addressLoss",
        "telMissing",
        "dateLoss",
        "timeLoss",
        "contactNumberApplicant",
        "circumstances",
        "healthStatus",
        "addInf",
        "items",
        "topClothes",
        "bottomClothes",
        "headWear",
        [
          sequelize.fn(
            "concat",
            "http://localhost:7000/uploads/",
            sequelize.col("photoUrl")
          ),
          "photoUrl",
        ], // Полный URL для фото
      ],
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Ошибка при получении списка заявок:", error.message);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Метод для получения заявки по ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await MissingPerson.findByPk(id, {
      include: [
        { model: Avatar }, // Включение данных об аватаре
        { model: User, attributes: ["firstName", "patronymic", "secondName"] }, // Включение данных о пользователе, если нужно
      ],
    });
    if (!report) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error("Ошибка при получении заявки:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Метод для обновления данных 2D-модельки пропавшего человека
exports.updateAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const { headdress, outwear, underware, color } = req.body;

    const report = await MissingPerson.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    report.headdress = headdress || report.headdress;
    report.outwear = outwear || report.outwear;
    report.underware = underware || report.underware;
    report.color = color || report.color;

    await report.save();
    res.status(200).json({ message: "Аватар обновлен", report });
  } catch (error) {
    console.error("Ошибка при обновлении аватара:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Метод для модерации заявки
exports.moderateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const report = await MissingPerson.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    // Обновление статуса заявки
    report.idStatus = status === "approved" ? 2 : 3; // Используйте корректные значения ID для статусов

    report.status = status; // Добавьте это, если у вас есть поле `status` в модели
    report.reason =
      status === "rejected" ? reason || "Причина отклонения не указана" : null;
    await report.save(); // Сохраните изменения
    console.log(`Заявка ${id} обновлена. Новый статус: ${report.idStatus}`); // Лог для проверки

    if (status === "approved") {
      const applicantInitials = `${report.firstNameApplicant[0]}. ${report.secondNameApplicant[0]}.`;
      const missingPersonInitials = `${report.firstName[0]}. ${report.secondName[0]}.`;
      const reportLocation = report.addressLoss;

      await Log.create({
        reportId: report.id,
        reporterName: applicantInitials,
        reportLocation,
        userId: req.user.id,
        message: `Пользователь ${applicantInitials} сообщил о пропаже ${missingPersonInitials} на ${reportLocation}.`,
      });
    }

    res.status(200).json({ message: "Заявка обновлена", report });
  } catch (error) {
    console.error("Ошибка при модерации заявки:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
};

// Метод для отметки заявки как найденной
exports.markAsFound = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await MissingPerson.findByPk(id, {
      include: [{ model: User, attributes: ["firstName", "secondName"] }],
    });

    if (!report) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    report.idStatus = 4; // Статус "найден"
    await report.save();

    await logController.createLog(
      {
        body: { reportId: id, action: "found" },
        user: req.user,
      },
      res
    );

    res.status(200).json({ message: "Заявка помечена как 'найден'", report });
  } catch (error) {
    console.error("Ошибка при обновлении статуса заявки:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Метод для получения API-ключа карты
exports.getMapApiKey = (req, res) => {
  res.status(200).json({ apiKey: process.env.YANDEX_API_KEY });
};

// Метод для удаления заявки по ID
exports.deleteReportById = async (req, res) => {
  try {
    const { id } = req.params;

    // Находим заявку по ID
    const report = await MissingPerson.findByPk(id);

    if (!report) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    // Удаление файла фото, если он существует
    if (report.photoUrl) {
      const fs = require("fs");
      const filePath = path.join(__dirname, "../uploads", report.photoUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Ошибка при удалении файла:", err);
      });
    }

    // Удаляем заявку из базы данных
    await report.destroy();
    res.status(200).json({ message: "Заявка успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении заявки:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
/*
exports.getReportByUserId = async (req, res) => {
  try {
    const userId = req.user?.id; // Получаем ID пользователя из токена

    if (!userId) {
      return res.status(400).json({ message: "ID пользователя не найден" });
    }

    const reports = await MissingPerson.findAll({
      where: { idUser: userId },
    });

    if (reports.length === 0) {
      return res.status(404).json({ message: "Заявки не найдены" });
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error("Ошибка при получении заявок пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
*/
