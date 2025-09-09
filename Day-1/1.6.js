const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your weight in kilograms: ', (weightInput) => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
        console.log('Please enter a valid positive number for weight.');
    } else {
        const DrinkWater = weight * 33;
        console.log(`You should drink ${DrinkWater.toLocaleString('en-US')} cubic centimeters (cc) of water per day.`);
    }
    rl.close();
});