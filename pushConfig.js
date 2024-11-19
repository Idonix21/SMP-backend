require("dotenv").config();
const webpush = require("web-push");

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

if (!publicVapidKey || !privateVapidKey) {
  throw new Error(
    "VAPID ключи отсутствуют. Пожалуйста, добавьте их в файл .env"
  );
}

webpush.setVapidDetails(
  "mailto:winipux21@mail.ru", // Укажите вашу почту или домен
  publicVapidKey,
  privateVapidKey
);

module.exports = webpush;
