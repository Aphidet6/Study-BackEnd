const readline = require('readline');

const MULTIPLIER = 33; // มิลลิลิตรต่อกิโลกรัม

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('กรุณากรอกน้ำหนักตัว (กก.): ', input => {
    const weight = parseFloat(input.replace(',', '.'));
    if (!Number.isFinite(weight) || weight <= 0) {
        console.log('ค่าน้ำหนักไม่ถูกต้อง');
        rl.close();
        return;
    }

    const milliliters = weight * MULTIPLIER;
    const liters = milliliters / 1000;
    console.log(`ปริมาณน้ำที่ควรดื่มต่อวัน: ${liters.toFixed(2)} ลิตร`);
    rl.close();
});