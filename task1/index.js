const fs = require('node:fs/promises');
const path = require("path");

const mul_two = (num1, num2) => {
    while (num1 < num2) {
        num1 *= 2;
    }
    return num1 === num2 ? 'Perfecto' : -1;
}
const add_one = (num1, num2) => {
    while (num1 < num2) {
        num1 = +(num1.toString() + '1');
    }
    return num1 === num2 ? 'Perfecto' : -1;

}


const make_number = (async () => {
    let {first_num, second_num} = JSON.parse(await fs.readFile(path.join(__dirname, 'data.json'), {encoding: 'utf-8'}));

    if (second_num < first_num) {
        throw new Error('Impossible to solve');
    }
    const writeData = {guessedNum: second_num};
    if (second_num % 2 === 0) {
        const res = mul_two(first_num, second_num);
        console.log('Multiplying by 2', res !== -1 ? res : 'Impossible');
        writeData.way = 'Multiplying by 2';
    }

    [first_num, second_num] = [first_num.toString(), second_num.toString()];

    if (second_num.slice(0, first_num.length) === first_num && second_num.slice(-1) === '1') {
        const res = add_one(+first_num, +second_num);
        console.log('Adding "1" to the end', res !== -1 ? res : 'Impossible');
        writeData.way = 'Adding "1" to the end';
    }
    if (!Object.keys(writeData).includes('way')) {
        writeData.way = 'Impossible to solve';
    }
    await fs.writeFile(path.join(__dirname, 'result.json'), JSON.stringify(writeData));
})()
