const { User } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Функция для генерации JWT токена
const generateJwt = (id, tel, role) => {
  return jwt.sign({ id, tel, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Функция для проверки сложности пароля и назначения роли
const validatePassword = (password) => {
  const lengthCheck = password.length > 5;
  const digitCheck = /\d/.test(password);
  const symbolCheck = /[!@#$%&*]/.test(password);
  const latinCheck = /^[A-Za-z0-9!@#$%&*]+$/.test(password);

  // Назначение роли на основе структуры пароля
  const hasModeratorKeyword = password.includes("MODERATOR");
  const hasGodKeyword = password.includes("GOD");

  let role = "USER"; // Роль по умолчанию
  if (hasGodKeyword) {
    role = "GOD";
  } else if (hasModeratorKeyword) {
    role = "MODERATOR";
  }

  return {
    isValid: lengthCheck && digitCheck && symbolCheck && latinCheck,
    role,
  };
};

// Регистрация пользователя
exports.registerUser = async (req, res) => {
  try {
    const { tel, password } = req.body;

    // Проверка существования пользователя
    const candidate = await User.findOne({ where: { tel } });
    if (candidate) {
      return res.status(400).json({
        message: "Пользователь с таким номером телефона уже существует",
      });
    }

    // Проверка сложности пароля и определение роли
    const { isValid, role } = validatePassword(password);
    if (!isValid) {
      return res.status(400).json({
        message:
          "Пароль должен быть больше 5 символов, содержать цифру, символ из !,@,#,$,%,&,*, и только латинские буквы.",
      });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      tel,
      password: hashedPassword,
      role, // Назначаем роль на основе пароля
    });

    // Генерация токена
    const token = generateJwt(user.id, user.tel, user.role);

    return res.status(201).json({ token });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Авторизация пользователя
exports.loginUser = async (req, res) => {
  try {
    const { tel, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ where: { tel } });
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    // Генерация токена
    const token = generateJwt(user.id, user.tel, user.role);

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
