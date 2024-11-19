const { User } = require("../models/models");

// Получение информации о пользователе по ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение роли пользователя по ID
exports.getUserRole = async (req, res) => {
  try {
    const userId = req.user.id; // Получаем ID пользователя из middleware
    const user = await User.findByPk(userId, { attributes: ["role"] });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error("Ошибка при получении роли пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение списка всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Исключаем поле пароля для безопасности
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Вершим правосудие(удаление пользователя)
exports.deleteUser = async (req, res) => {
  try {
    const { id, tel } = req.body; // Принимаем либо ID пользователя, либо его номер телефона

    let user;
    if (id) {
      user = await User.findByPk(id);
    } else if (tel) {
      user = await User.findOne({ where: { tel } });
    } else {
      return res
        .status(400)
        .json({ message: "Необходимо указать userID или номер телефона" });
    }

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Проверяем, чтобы пользователь не был другим "GOD"
    if (user.role === "GOD") {
      return res.status(403).json({
        message: "Удаление другого пользователя с ролью GOD запрещено",
      });
    }

    // Удаляем пользователя
    await user.destroy();
    res.status(200).json({ message: "Пользователь успешно удален" });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
