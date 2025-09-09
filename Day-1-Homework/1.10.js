const values = [
    "Hello",
    3500,
    3.1415,
    "4/2",
    3 * 5,
    12 - 150,
    0
];

values.forEach(v => {
    console.log(`${JSON.stringify(v)} => ${typeof v}`);
});