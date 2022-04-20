const drawingArea = document.getElementById('drawingArea');
const pen = drawingArea.getContext("2d");
const fileInput = document.getElementById('file-input');
const scanResult = document.getElementById('scanResult');
const schedule = document.getElementById('schedule');
var data = [];
var enlarge = 1;
var drawing = false;
/**
 * 等待数毫秒
 * @param {number} ms 等待时间，单位为毫秒
 * @returns 
 */
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function dealWith(value, length = 2) {
    return value.length >= length ? value : '0' + String(value);
}
class RGBColour {
    /**
     * 定义一个RGB值
     * @param hex {string | number[]} - 16进制颜色或者一个数组`[r,g,b]`
     */
    constructor(hex = "#000000") {
        if (typeof hex == "string") {
            this.r = parseInt(hex.slice(1, 3), 16);
            this.g = parseInt(hex.slice(3, 5), 16);
            this.b = parseInt(hex.slice(5, 7), 16);
            this.hex = hex;
        } else {
            this.r = hex[0];
            this.g = hex[1];
            this.b = hex[2];
            this.hex = '#' + dealWith(this.r.toString(16)) + dealWith(this.g.toString(16)) + dealWith(this.b.toString(16));
        }
    }
}

function copy(value) {
    var w = document.createElement('input');
    w.value = value;
    document.body.appendChild(w);
    w.select();
    document.execCommand("Copy");
    w.remove();
}
const colours = {
    '': ['air'],
    '#86C349': ['grass', 'dark_grass', 'windygrass', 'bamboo', 'greenbelt_L', 'greenbelt_L1'],
    '#854D31': ['dirt'],
    '#ABABAB': ['stone', 'dark_stone', 'rock'],
    '#50AA50': ['green_leaf', 'leaf_01', 'leaf_02', 'leaf_03', 'leaf_04', 'leaf_05', 'leaf_06'],
    '#3232FF': ['water'],
    '#D6B882': ['wood', 'acacia', 'palm'],
    '#AAAAAA': ['snow', 'ice', 'snowland', 'polar_region', 'polar_ice', 'white_grass', 'bear_footprint', 'spiderweb'],
    '#FF3232': ['lava01', 'lava02', 'fu'],
    '#FFFF32': ['sand', 'yellow_grass'],
    '#182940': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    '#623116': ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
    '#1C260A': ['exclamation_mark', 'question_mark'],
    '#2E1F15': ['add', 'subtract', 'multiply', 'divide', 'equal', 'ampersand', 'asterisk', 'at', 'backslash', 'bracket_close', 'bracket_open', 'caret', 'colon', 'comma', 'dollar', 'greater_than', 'less_than', 'paren_open', 'paren_close', 'percent', 'period', 'pound', 'quotation_mark', 'semicolon', 'slash', 'tilde'],
    '#969696': ['stainless_steel'],
    '#C2EDF8': ['powder_blue']
};
const direct = ['cadet_blue', 'sky_blue', 'powdr_blue', 'dark_gray', 'light_gray', 'olive_green', 'yellow_green', 'pale_green', 'red', 'dark_red', 'brick_red', 'medium_gray', 'dark_slate_blue', 'pink', 'sakura_pink', 'black', 'white', 'blue', 'turquoise', 'dark_orchid', 'medium_orchid', 'medium_purple', 'medium_violet_red', 'maroon', 'coffee_gray', 'peru', 'dark_salmon', 'navajo_white', 'orange_red', 'medium_yellow', 'medium_green', 'sienna', 'mint_green', 'medium_spring_green'];

/**
 * 在text字符串中把所有的a替换成b
 * @param {string} text - 字符串
 * @param {string} a - 需要被替换的字符
 * @param {string} b - 替换a的字符
 * @returns {string} 处理后的文本
 */
function conversion(text, a, b = '') {
    var newText = '';
    for (let i of text) {
        if (i == a) newText += b;
        else newText += i;
    }
    return newText;
}

function shadow(colour, drop = 0) {
    var { r, g, b } = new RGBColour(colour);
    r = Math.max(0, r / drop * 100);
    g = Math.max(0, g / drop * 100);
    b = Math.max(0, b / drop * 100);
    return new RGBColour([r, g, b]).hex;
}

/**
 * 
 * @param {string} voxel - 方块名称
 * @returns {string} 16进制颜色
 */
function colour(voxel1) {
    if ((typeof voxel1) != 'object' && voxel1.voxel == undefined) {
        voxel = voxel1.toString();
    } else {
        voxel = voxel1.voxel.toString();
    }
    for (let i in colours) {
        if (colours[i].includes(voxel)) {
            return i;
        }
    }
    if (voxel.includes('plank_') || voxel.includes('board_') || voxel == 'wooden_box') return '#B0823F';
    else if (voxel.includes('board')) return '#B67746';
    else if (voxel.includes('window')) return '#422221';
    else if (voxel.includes('glass')) return '#9AABB6';
    else if (voxel.includes('lantern') || voxel.includes('lamp') || voxel == 'palace_lamp') return '#FFFFFF';
    else if (voxel.includes('brick')) return '#BEBEBE';
    else if (voxel.includes('carpet')) return '#FFFF88';
    else if (voxel.includes('palace')) return '#003371';
    else if (voxel.includes('stone')) return '#ABABAB';
    else if (voxel.includes('lab')) return '#707070';
    else if (direct.includes(voxel)) return conversion(direct[direct.indexOf(voxel)], '_');
    else if (direct.includes(voxel.slice(0, voxel.indexOf('_')))) return voxel.slice(0, voxel.indexOf('_' + 1));//conversion(), '_', '');//voxel
    return '';
}


async function draw(data) {
    if (!drawing) {
        console.log(data);
        drawing = true;
        pen.clearRect(0, 0, 512, 512);
        console.group('画图日志');
        console.log('画布大小：', drawingArea.width, drawingArea.height);
        console.group('画图');
        var total = 0, completed = 0;
        for (let x in data) {
            total += data[x].length;
        }
        schedule.style.width = `0%`;
        schedule.style.backgroundColor = '#ff8800';
        for (let x in data) {
            for (let y in data[x]) { // y相当于地图中的z
                if (((typeof (data[x][y]) != 'object') ? colour(data[x][y]) : colour(data[x][y].voxel)) != '#FF8A65') {
                    try {
                        if (x > 0 && y > 0 && false) {
                            if (typeof data[x][y] != undefined && typeof data[x + 1][y].voxel != undefined) {
                                pen.fillStyle = shadow(colour(data[x][y].voxel), data[x + 1][y].high - data[x][y].high);
                                pen.fillRect(x * enlarge * 2, y * enlarge * 2, x * enlarge * 2, y * enlarge * 2);
                                console.log(typeof data[x][y] != undefined, x >= 0, y >= 0, typeof data[x + 1][y] != undefined);
                                console.groupEnd();
                            } else {
                                pen.fillStyle = colour(data[x][y]);
                                pen.fillRect(x * enlarge * 2, y * enlarge * 2, x * enlarge * 2, y * enlarge * 2);
                                console.log((typeof data[x][y]) != undefined, x >= 0, y >= 0, (typeof data[x - 1][y]) != undefined);
                                console.groupEnd();
                            }
                        } else {
                            var color = colour(data[x][y]);
                            pen.fillStyle = color;
                            if (color == '') {
                                pen.clearRect(x * enlarge * 2, y * enlarge * 2, x * enlarge * 2, y * enlarge * 2);
                            }
                            pen.fillRect(x * enlarge * 2, y * enlarge * 2, x * enlarge * 2, y * enlarge * 2);
                        }
                    } catch (error) {
                        if (typeof data[x][y] != undefined) pen.fillStyle = colour(data[x][y].voxel);
                        else pen.fillStyle = colour(data[x][y]);
                        pen.fillRect(x * enlarge * 2, y * enlarge * 2, x * enlarge * 2, y * enlarge * 2);
                    }
                    completed++;
                    schedule.style.width = `${Math.round(completed / total * 10000) / 100}%`;
                    schedule.innerText = `${Math.round(completed / total * 100)}%`;
                    if (completed % 16 == 0) await sleep(1);
                } else {
                    pen.clearRect(x * enlarge * 2, y * enlarge * 2, x * enlarge * 2, y * enlarge * 2);
                }
            }
        }
        drawing = false;
        schedule.innerText = '完成！';
        schedule.style.backgroundColor = '#0fb900';
    }
}

function loadFile() {
    if (fileInput.files[0] != undefined) {
        var filereader = new FileReader();
        var fileType = fileInput.files[0].type;
        console.log(fileType)
        if (fileType == "text/plain" || fileType == "application/json" || fileType == "text/javascript") {
            console.log(fileInput.result, fileInput.files[0]);
            filereader.readAsText(fileInput.files[0], 'utf-8');
            filereader.onload = function (evt) {
                var fileString = evt.target.result;
                try {
                    data = JSON.parse(fileString);
                    alert('上传成功');
                } catch {
                    alert('请上传正确的文件');
                }
            }
        } else {
            alert('文件格式错误');
            fileInput.files[0] = undefined;
        }
    } else {
        alert("请先上传文件！")
    }
}
document.getElementById('help').addEventListener('click', () => {
    alert('帮助：\n首先复制扫描代码，然后在地图的控制台输入扫描代码，把扫描结果保存在.txt文件中（.js或者.json也可以），点击[输入扫描结果]，上传结果文件，之后会把地形显示出来');
});
document.getElementById('draw').addEventListener('click', () => {
    draw(data);
});
fileInput.addEventListener('change', () => {
    loadFile();
});
document.getElementById('enlarge').addEventListener('click', () => {
    setSize();
});
document.getElementById('copy').addEventListener('click', () => {
    copy('(async function () {var scanResult = []; for (let x = 0; x <= voxels.shape.x; x++) {scanResult.push([]);for (let z = 0; z <= voxels.shape.z; z++) {for (let y = voxels.shape.y; y >= 0; y--) {if(y <= 0) scanResult[scanResult.length - 1].push(voxels.name(0)); else if (voxels.getVoxelId(x, y, z) != 0) {scanResult[scanResult.length - 1].push({voxel:voxels.name(voxels.getVoxelId(x, y, z)),high:y});break;}}}await sleep(16);}console.log(JSON.stringify(scanResult));}());');
    alert('复制成功！');
})
setInterval(() => {
    if (!document.getElementById('hint')) {
        var hint = document.createElement('p');
        hint.innerHTML = '温馨提示：地形扫描器是开源的，但转载时不要忘记表明原作者哦~<br>原作者：全能岛民';
        hint.style.color = "red";
        hint.style.float = "left";
        hint.id = 'hint';
        document.getElementById('mainInterface').appendChild(hint);
    } else {
        var hint = document.getElementById('hint');
        if (hint.innerHTML != '温馨提示：地形扫描器是开源的，但转载时不要忘记表明原作者哦~<br>原作者：全能岛民') hint.innerHTML = '温馨提示：地形扫描器是开源的，但转载时不要忘记表明原作者哦~<br>原作者：全能岛民';
        if (hint.style.color != "red") hint.style.color = "red";
        if (hint.style.float != "left") hint.style.float = "left";
    }
}, 100);
async function setSize() {
    if (!drawing) {
        let input = Number(prompt('请输入放大倍数'));
        enlarge = input ? input : 1;
        document.getElementById('enlarge').innerHTML = `设置放大倍数（当前放大倍数${enlarge}x）`;
        drawingArea.width = 512 * enlarge;
        drawingArea.height = 512 * enlarge;
        drawingArea.style.width = 512 * enlarge;
        drawingArea.style.height = 512 * enlarge;
        scanResult.style.width = 512 * enlarge;
        scanResult.style.height = 512 * enlarge;
        draw(data);
    }
}