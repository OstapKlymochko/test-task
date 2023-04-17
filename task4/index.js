const fs = require('fs/promises');
const path = require('path');

const generateRandomMatrix = (w, h) => {
    const m = [];
    for (let i = 0; i < h; ++i) {
        m[i] = [];
        for (let j = 0; j < w; ++j) {
            m[i][j] = Math.floor(Math.random() * 1.99);
        }
    }
    return m;
}
const task4 = (async () => {
    const {m, n} = JSON.parse(await fs.readFile(path.join(__dirname, 'data.json')));
    const scene = generateRandomMatrix(m, n);
    // const scene = [];
    const result = [];
    //left
    const emptyPlaces = []
    for (let i = 0; i < scene.length; ++i) {
        for (let j = 0; j < scene[0].length; ++j) {
                if(scene[i][j] === 0) {
                    emptyPlaces.push({i, j});
                }
        }
    }
    let counter = 0;
    for(let i = 0; i < emptyPlaces.length; ++i) {
        //left
        for(let l = emptyPlaces[i].j; l >= 0; --l) {
            if(scene[emptyPlaces[i].i][l] === 1) {
                result.push({direction: 'left', ...emptyPlaces[i]});
                break;
            }
        }
        //right
        for(let r = emptyPlaces[i].j; r < scene[0].length; ++r) {
            if(scene[emptyPlaces[i].i][r] === 1) {
                result.push({direction: 'right', ...emptyPlaces[i]});
                break;
            }
        }
        //up
        for(let u = emptyPlaces[i].i; u >= 0; --u) {
            if(scene[u][emptyPlaces[i].j] === 1) {
                result.push({direction: 'up', ...emptyPlaces[i]});
                break;
            }
        }
        //down
        for(let d = emptyPlaces[i].i; d < scene.length; ++d) {
            if(scene[d][emptyPlaces[i].j] === 1) {
                result.push({direction: 'down', ...emptyPlaces[i]});
                break;
            }
        }
    }
    await fs.writeFile(path.join(__dirname, 'result.json'), JSON.stringify({scene, result}));

})()