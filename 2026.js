// 定义数字的点阵图案，每个笔画只用一行
const digitPatterns = {
    '2': [
        [1, 1, 1, 1, 1, 1, 1],  // 顶部横线
        [0, 0, 0, 0, 0, 0, 1],  // 右上竖线
        [0, 0, 0, 0, 0, 0, 1],  // 右上竖线
        [0, 0, 0, 0, 0, 0, 1],  // 右上竖线
        [1, 1, 1, 1, 1, 1, 1],  // 中间横线
        [1, 0, 0, 0, 0, 0, 0],  // 左下竖线
        [1, 0, 0, 0, 0, 0, 0],  // 左下竖线
        [1, 0, 0, 0, 0, 0, 0],  // 左下竖线
        [1, 1, 1, 1, 1, 1, 1]   // 底部横线
    ],
    '0': [
        [1, 1, 1, 1, 1, 1, 1],  // 顶部横线
        [1, 0, 0, 0, 0, 0, 1],  // 左竖线
        [1, 0, 0, 0, 0, 0, 1],  // 左竖线
        [1, 0, 0, 0, 0, 0, 1],  // 左竖线
        [1, 0, 0, 0, 0, 0, 1],  // 左竖线
        [1, 0, 0, 0, 0, 0, 1],  // 右竖线
        [1, 0, 0, 0, 0, 0, 1],  // 右竖线
        [1, 0, 0, 0, 0, 0, 1],  // 右竖线
        [1, 1, 1, 1, 1, 1, 1]   // 底部横线
    ],
    '6': [
        [1, 1, 1, 1, 1, 1, 1],  // 顶部横线
        [1, 0, 0, 0, 0, 0, 0],  // 左上竖线
        [1, 0, 0, 0, 0, 0, 0],  // 左上竖线
        [1, 0, 0, 0, 0, 0, 0],  // 左上竖线
        [1, 1, 1, 1, 1, 1, 1],  // 中间横线
        [1, 0, 0, 0, 0, 0, 1],  // 左下和右下竖线
        [1, 0, 0, 0, 0, 0, 1],  // 左下和右下竖线
        [1, 0, 0, 0, 0, 0, 1],  // 左下和右下竖线
        [1, 1, 1, 1, 1, 1, 1]   // 底部横线
    ]
};

let imageIndex = 0;
const maxImages = 112; // 2026 需要的图片数量

// 加载图片（从 images/2026 文件夹）
function loadImage(index) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `images/2026/${index}.jpg`;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
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
                // 先分配图片索引，再异步加载图片
                const currentIndex = imageIndex;
                imageIndex++;
                loadImageForCell(cell, currentIndex);
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
async function loadImageForCell(cell, index) {
    if (index >= maxImages) {
        // 如果图片用完了，显示占位符
        cell.style.backgroundColor = '#ff6f61';
        cell.style.opacity = '0.5';
        return;
    }
    
    const img = await loadImage(index);
    
    if (img) {
        const imgElement = document.createElement('img');
        imgElement.src = img.src;
        imgElement.alt = 'Photo';
        cell.appendChild(imgElement);
    } else {
        // 如果图片加载失败，显示占位符
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

