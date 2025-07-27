# SMP Backend Setup Guide

Welcome! This guide will help you set up and run the **SMP Backend** project locally  
Technologies used: **Node.js**, **PostgreSQL** and **Yandex Maps API**

---

## 1. Clone the Repository

Create a folder for the project, for example "SMP"

Next, use this command to ```git clone https://github.com/winipux21/SMP-backend``` the repository into the created folder

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
