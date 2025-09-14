

## ตัวอย่าง Express.js, MySQL, และ CORS เพื่อสร้าง API 

## ติดตั้ง

1. ติดตั้ง dependencies
   ```bash
   npm install
   ```

3. สร้างไฟล์ `.env` และตั้งค่าตามต้องการ
   ```env
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_DATABASE=your_database_name
   ```

4. สร้างฐานข้อมูลและตาราง
   ```sql
   CREATE DATABASE your_database_name;
   USE your_database_name;
   CREATE TABLE products (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       price DECIMAL(10,2) NOT NULL,
       discount INT,
       review_count INT,
       image_url VARCHAR(255)
   );
   ```

## การใช้งาน

1. เริ่มต้นแอปพลิเคชัน
   ```bash
   npm start
   ```

2. API จะรันที่ `http://localhost:3000`

## Endpoints

### GET /products

ดึงข้อมูลทั้งหมดของผลิตภัณฑ์

### GET /products/:id

ดึงข้อมูลผลิตภัณฑ์ตาม ID

### POST /products

สร้างผลิตภัณฑ์ใหม่

### PUT /products/:id

อัปเดตข้อมูลผลิตภัณฑ์ตาม ID

### DELETE /products/:id

ลบผลิตภัณฑ์ตาม ID

### GET /products/search/:keyword

ค้นหาผลิตภัณฑ์ตามคีย์เวิร์ด

## ข้อมูลเพิ่มเติม

- [Express.js](https://expressjs.com/)
- [MySQL2](https://www.npmjs.com/package/mysql2)
- [CORS](https://www.npmjs.com/package/cors)

