const fs = require('node:fs/promises');
const path = require("path");

const find_duplicate = (async () => {
    const arr = JSON.parse(await fs.readFile(path.join(__dirname, 'data.json'), {encoding: 'utf-8'}));
    if (arr.length !== Math.max(...arr) + 1) {
        throw new Error('Unsuitable data');
    }
    for (let i = 0; i < arr.length - 1; ++i) {
        if (arr[i] === arr[i + 1]) {
            console.log(arr[i], `duplicate at ${i}, ${i + 1}`);
            await fs.writeFile(path.join(__dirname, 'result.json'), JSON.stringify({
                result: arr[i],
                indexes: [i, i + 1]
            }));
            return
        }
    }
})();

