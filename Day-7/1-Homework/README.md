

## Express CRUD API แบบไม่ได้ต่อ Database

### Overview
โปรเจ็กต์นี้ใช้ CRUD พื้นฐาน (Create, Read, Update, Delete) โดยใช้เฟรมเวิร์ก Express.js ใน Node.js

### Prerequisites
- Node.js installed (https://nodejs.org/)
- npm (Node Package Manager) installed

### Installation
1. สร้างไฟล์ package.json:
   ```
   npm init
   ```

2. ติดตั้ง express
   ```
   npm install express
   ```

### Usage
1. รันไฟล์ (Start Server):
   ```
   node homework.js
   ```

2. เข้าถึง API โดยใช้โปรแกรมในการทดสอบอย่าง  Postman

### API Endpoints

#### 1. **POST /products**
   - เพิ่ม product ใหม่ลงในรายการ
   - Request:
     ```
     POST /products
     Content-Type: application/json

     {
       "id": 1,
       "name": "Product 1",
       "price": 20.99
     }
     ```
   - Response:
     ```
     [
       {
         "id": 1,
         "name": "Product 1",
         "price": 20.99
       }
     ]
     ```

#### 2. **GET /products**
   - ดึงรายการ product ทั้งหมด
   - Request:
     ```
     GET /products
     ```
   - Response:
     ```
     [
       {
         "id": 1,
         "name": "Product 1",
         "price": 20.99
       }
       // ข้อมูล Product เพิ่มเติม...
     ]
     ```

#### 3. **GET /products/:id**
   - ดึงข้อมูล product  เฉพาะด้วย ID
   - Request:
     ```
     GET /products/1
     ```
   - Response:
     ```
     {
       "id": 1,
       "name": "Product 1",
       "price": 20.99
     }
     ```

#### 4. **PUT /products/:id**
   - อัพเดต product  เฉพาะตาม ID
   - Request:
     ```
     PUT /products/1
     Content-Type: application/json

     {
       "name": "Updated Product",
       "price": 25.99
     }
     ```
   - Response:
     ```
     {
       "id": 1,
       "name": "Updated Product",
       "price": 25.99
     }
     ```

#### 5. **DELETE /products/:id**
   - ลบ product เฉพาะด้วย ID
   - Request:
     ```
     DELETE /products/1
     ```
   - Response:
     ```
     [
       // Remaining products...
     ]
     ```

