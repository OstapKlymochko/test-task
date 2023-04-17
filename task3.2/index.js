const fs = require('fs/promises');
const path = require("path");

const positions = {
    S: 1,
    M: 2,
    L: 3,
    XL: 4,
    XXL: 5,
    XXXL: 6
}
const task3 = (async () => {
    const {
        available_sizes: sizes,
        participants
    } = JSON.parse(await fs.readFile(path.join(__dirname, 'data.json'), {encoding: 'utf-8'}));

    for (const p of participants) {
        if (p.size.length > 2) {
            throw new Error('Invalid data')
        }
        if (p.size.length === 2 && Math.abs(positions[p.size[0]] - positions[p.size[1]]) !== 1) {
            console.log(Math.abs(positions[p.size[0]] - positions[p.size[1]]))
            throw new Error('Invalid data')
        }
    }

    const countSizes = (arr, counts = {}) => {
        for (const a of arr) {
            for (const size of a.size) {
                counts[size] ? counts[size] = counts[size] + 1 : counts[size] = 1;
            }
        }
        return counts;
    }
    const cs = countSizes(participants);
    for (const c in cs) {
        if (cs[c] > sizes[c]) {
            throw new Error('Impossible')
        }
    }
await fs.writeFile(path.join(__dirname, 'result.json'), JSON.stringify(cs))
})()