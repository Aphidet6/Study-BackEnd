const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('กรุณาใส่น้ำหนักของคุณ (กก.): ', answer => {
    const weight = parseFloat(answer.replace(',', '.'));
    if (isNaN(weight) || weight <= 0) {
        console.log('กรุณาใส่น้ำหนักเป็นตัวเลขที่มากกว่า 0');
        rl.close();
        return;
    }

    const recCc = Math.round(weight * 33);

    console.log(`\nน้ำหนัก: ${weight} กก.`);
    console.log(`ปริมาณน้ำที่แนะนำต่อวัน: ประมาณ ${recCc.toLocaleString('en-US')} cc`);

    rl.close();
});