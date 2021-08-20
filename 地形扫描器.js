const drawingArea = document.getElementById('drawingArea');
const pen = drawingArea.getContext("2d");
const fileInput = document.getElementById('file-input');
var data = [];
var enlarge = 1;
var drawing = false;
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

function copy(value) {
    var w = document.createElement('input');
    w.value = value;
    document.body.appendChild(w);
    w.select();
    document.execCommand("Copy");
    w.remove();
}
const colours = {
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
/**
 * 
 * @param {string} voxel - 方块名称
 * @returns {string} 16进制颜色
 */
function colour(voxel) {
    if (voxel.includes('plank_') || voxel.includes('board_') || voxel == 'wooden_box') return '#B0823F';
    if (voxel.includes('board')) return '#B67746';
    if (voxel.includes('window')) return '#422221';
    if (voxel.includes('glass')) return '#9AABB6';
    if (voxel.includes('lantern') || voxel.includes('lamp') || voxel == 'palace_lamp') return '#FFFFFF';
    if (voxel.includes('brick')) return '#BEBEBE';
    if (voxel.includes('carpet')) return '#FFFF88';
    if (voxel.includes('palace')) return '#003371';
    if (voxel.includes('stone')) return '#ABABAB';
    if (voxel.includes('lab')) return '#707070';
    if (direct.includes(conversion(conversion(conversion(voxel, 'decorative_light'), 'light', ''), 'gift', ''))) return conversion(voxel, '_', '');
    for (let i in colours)
        if (colours[i].includes(voxel))
            return i;
    return '#4B4B4B';
}

async function draw(data) {
    if (!drawing) {
        console.log(data);
        drawing = true;
        pen.clearRect(0, 0, 512, 512);
        for (let x in data) {
            for (let z in data[x]) {
                if (data[x][z] != 'air' || colour(data[x][z]) != '#4B4B4B') {
                    pen.fillStyle = colour(data[x][z]);
                    pen.fillRect(x * enlarge * 2, z * enlarge * 2, x * enlarge * 2, z * enlarge * 2);
                } else {
                    pen.clearRect(x * enlarge * 2, z * enlarge * 2, x * enlarge * 2, z * enlarge * 2);
                }
            }
        }
        console.log(drawingArea.width, drawingArea.height);
        drawing = false;
    }
}

function loadFile() {
    if (fileInput.files[0] != undefined) {
        var filereader = new FileReader();
        var fileType = fileInput.files[0].type;
        console.log(fileType)
        if (fileType == "text/plain" || fileType == "application/json" || fileType == "text/javascript") {
            console.log(fileInput.result, fileInput.files[0]);
            filereader.readAsText(fileInput.files[0], 'gbk');
            filereader.onload = function(evt) {
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