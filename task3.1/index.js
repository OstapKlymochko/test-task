const fs = require('node:fs/promises');
const path = require("path");


const findMin = (arr) => {
    let min = arr[0];
    for (let i = 1; i < arr.length; ++i) {
        if (arr[i].total < min.total) {
            min = arr[i];
        }
        if (arr[i].total <= min.total && arr[i].count < min.count) {
            min = arr[i];
        }
    }
    return min;
}

const lbs = 0.45359237;
const findMinBiggerThanRecord = (async () => {
    const start = Date.now();
    let {
        weightsKg,
        weightsLbs,
        record
    } = JSON.parse(await fs.readFile(path.join(__dirname, 'data.json'), {encoding: 'utf-8'}));
    const maxKg = 24 * Math.max(...weightsKg) + 20;
    const maxLbs = 24 * Math.max(...weightsLbs) * lbs + 20;
    if (!record || record < 20 || record >= Math.max(maxKg, maxLbs)) {
        throw new Error('Invalid data');
    }
    let allCombinations = [];
    // Calculating minimal combining plates of the same weight
    for (let i = 1; i <= 12; ++i) {
        for (const w of weightsKg) {
            const curr = 2 * i * w + 20;
            if (curr > record) {
                allCombinations.push({count: 2 * i, plate: w.toString() + ' kg', total: curr});
            }
        }
        for (const w of weightsLbs) {
            const curr = 2 * i * w * lbs + 20;
            if (curr > record) {
                allCombinations.push({count: 2 * i, plate: w.toString() + ' lbs', total: curr});
            }
        }
    }

    const min = findMin(allCombinations);
    // Calculating minimal combining plates of the same weight
    allCombinations = [];
    //Finding elements in neighborhood of record
    for (let i = 1; i <= 12; ++i) {
        for (const w of weightsKg) {
            const curr = 2 * i * w + 20;
            const eps = record - 2 * i * w;
            if (curr > eps && curr < record) {
                // console.log({count: 2 * i, plate: w.toString() + ' kg', total: curr})
                allCombinations.push({count: 2 * i, plate: w.toString() + ' kg', total: curr});
            }
        }
        for (const w of weightsLbs) {
            const curr = 2 * i * w * lbs + 20;
            const eps = record - 2 * i * w;
            if (curr > eps && curr < record) {
                allCombinations.push({count: 2 * i, plate: w.toString() + ' lbs', total: curr});
            }
        }
    }
    //Finding elements in neighborhood of record

    const resArr = [min];
    // Adding rest to the previous collection
    for (const comb of allCombinations) {
        for (let i = 1; i <= 12 - (comb.count / 2); ++i) {
            for (const w of weightsKg) {
                const curr = 2 * i * w;
                if (comb.total + curr > record && comb.total + curr < record + 5) {
                    resArr.push({
                        counts: [comb.count, 2 * i],
                        plates: [comb.plate, w.toString() + ' kg'],
                        total: comb.total + curr
                    })
                }
            }
            for (const w of weightsLbs) {
                const curr = 2 * i * w * lbs;
                if (comb.total + curr > record && comb.total + curr < record + 5) {
                    resArr.push({
                        counts: [comb.count, 2 * i],
                        plates: [comb.plate, w.toString() + ' lbs'],
                        total: comb.total + curr
                    })
                }
            }
        }
    }
    // Adding rest to the previous collection
    const result = findMin(resArr);
    console.log(result);
    if (result) {
        await fs.writeFile(path.join(__dirname, 'result.json'), JSON.stringify(result));
    } else {
        await fs.writeFile(path.join(__dirname, 'result.json'), JSON.stringify({ERROR: 'Smth went wrong :('}))
    }
    console.log(Date.now() - start, 'ms');
})();
