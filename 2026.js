// 定义数字的点阵图案 (7x7 网格)
const digitPatterns = {
    '2': [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ],
    '0': [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ],
    '6': [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ]
};

let imageIndex = 0;
const maxImages = 105; // 根据你的图片数量调整

// 加载图片
function loadImage(index) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `images/${index}.jpg`;
        img.onload = () => resolve(img);
        img.onerror = () => {
            // 如果图片加载失败，尝试加载缩略图
            const thumbImg = new Image();
            thumbImg.src = `images/thumbs/${index}.jpg`;
            thumbImg.onload = () => resolve(thumbImg);
            thumbImg.onerror = () => resolve(null);
        };
    });
}

// 创建数字容器
function createDigitContainer(digit) {
    const container = document.createElement('div');
    container.className = 'digit-container';
    
    const grid = document.createElement('div');
    grid.className = 'digit-grid';
    
    const pattern = digitPatterns[digit];
    if (!pattern) return container;
    
    const rows = pattern.length;
    const cols = pattern[0].length;
    
    // 设置网格布局
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    // 创建单元格
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'digit-cell';
            
            if (pattern[row][col] === 1) {
                cell.classList.add('filled');
                // 异步加载图片
                loadImageForCell(cell);
            } else {
                cell.classList.add('empty');
            }
            
            grid.appendChild(cell);
        }
    }
    
    container.appendChild(grid);
    return container;
}

// 为单元格加载图片
async function loadImageForCell(cell) {
    let loaded = false;
    let attempts = 0;
    const maxAttempts = maxImages * 2; // 最多尝试次数
    
    while (!loaded && attempts < maxAttempts) {
        const img = await loadImage(imageIndex);
        imageIndex = (imageIndex + 1) % maxImages;
        attempts++;
        
        if (img) {
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.alt = 'Photo';
            cell.appendChild(imgElement);
            loaded = true;
        }
    }
    
    // 如果所有图片都加载失败，显示占位符
    if (!loaded) {
        cell.style.backgroundColor = '#ff6f61';
        cell.style.opacity = '0.5';
    }
}

// 初始化页面
async function init() {
    const container = document.getElementById('year2026-container');
    if (!container) return;
    
    // 创建 2026 四个数字
    const digits = ['2', '0', '2', '6'];
    
    for (const digit of digits) {
        const digitContainer = createDigitContainer(digit);
        container.appendChild(digitContainer);
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

