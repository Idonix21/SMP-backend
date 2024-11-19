const jwt = require("jsonwebtoken");

// Middleware для проверки JWT токена
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Предполагается, что токен отправляется в формате "Bearer TOKEN"
    if (!token) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Добавляем декодированную информацию о пользователе в запрос
    next();
  } catch (error) {
    return res.status(401).json({ message: "Пользователь не авторизован" });
  }
};
