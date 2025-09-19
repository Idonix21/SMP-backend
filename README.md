# SMP Backend Setup Guide

Welcome! This guide will help you set up and run the **SMP Backend** project locally  
Technologies used: **Node.js**, **PostgreSQL** and **Yandex Maps API**

![Static Badge](https://img.shields.io/badge/Node.js-20.18.3-green?link=https%3A%2F%2Fnodejs.org%2Fen%2Fdownload) ![Static Badge](https://img.shields.io/badge/PostgreSQL-17-blue?link=https%3A%2F%2Fwww.postgresql.org%2Fdownload%2F) ![Static Badge](https://img.shields.io/badge/Jandex%20Map%20API-red?link=https%3A%2F%2Fyandex.ru%2Fmaps-api%2Fdocs)

[english](https://github.com/idonix21/SMP-backend/blob/master/README.md) [русский](https://github.com/idonix21/SMP-backend/blob/master/README/ru.md)
---

## 1. Clone the Repository

Create a folder for the project, for example "SMP"

Next, use this command to ```git clone https://github.com/idonix21/SMP-backend``` the repository into the created folder

## 2. Install Dependencies

Use the ```npm install``` command to install all required dependencies and you will also need 
- Install **PostgreSQL** (I used version 17.5)
- Get the API key for **Yandex Map**

Now make sure you have the file ```.env``` with required variables:
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

## 3. Run the Server
Start the backend server with: to run it, use the command ```node server.js```

And of course, don't forget to download the frontend part - [SMP-Frontend](https://github.com/idonix21/SMP-frontend)
