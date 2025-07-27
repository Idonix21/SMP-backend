1) Create a folder for your project (Create folder SMP)
2) After going to the folder, open the command prompt and write "git clone https://github.com/winipux21/SMP-backend"
3) Next, open the downloaded folder using a convenient code editor and make sure that you have installed Node.js
4) Use the "npm install" command to install all required dependencies
5) Since we use PostgreSQL in this program, you will need to download it, I used version 17.5, and you will also need to get the yandex map api for the map.
6) Now make sure you have the file.env with required variables:
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
7) And finally, to run it, use the command "node server.js"
