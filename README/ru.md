# Руководство по настройке серверной части SMP

Добро пожаловать! Это руководство поможет вам настроить и запустить серверную часть проекта SMP локально  
Используемые технологии: **Node.js**, **PostgreSQL** и **Yandex Maps API**

![Static Badge](https://img.shields.io/badge/Node.js-20.18.3-green?link=https%3A%2F%2Fnodejs.org%2Fen%2Fdownload) ![Static Badge](https://img.shields.io/badge/PostgreSQL-17-blue?link=https%3A%2F%2Fwww.postgresql.org%2Fdownload%2F) ![Static Badge](https://img.shields.io/badge/Jandex%20Map%20API-red?link=https%3A%2F%2Fyandex.ru%2Fmaps-api%2Fdocs)

[english](https://github.com/winipux21/SMP-backend/blob/master/README.md) [russian](https://github.com/winipux21/SMP-backend/blob/master/Readme/ru.dm)
---

## 1. Клонируйте репозиторий

Создайте папку для проекта, например "SMP"

Затем используйте эту команду: ```git clone https://github.com/winipux21/SMP-backend```, чтобы скопировать репозиторий в созданную папку

## 2. Устанавливка зависимостей

Используйте команду ```npm install``` для установки всех необходимых зависимостей, и вам также потребуется:
- Устьановить **PostgreSQL** (Я использовал версию 17.5)
- Получить ключ для **Yandex Map**

Теперь убедитесь, что у вас есть файл ```.env``` с необходимыми переменными:
```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=localhost=
DB_PORT=5432
DB_DIALECT=postgres
PORT = 7000
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https: 
YANDEX_API_KEY=
```

## 3. Запуска серверной части
Запустите внутренний сервер с помощью команды ```node server.js```

И, конечно, не забудьте скачать интерфейсную часть - [SMP-Frontend](https://github.com/winipux21/SMP-frontend)
