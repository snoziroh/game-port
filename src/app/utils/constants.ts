const pokemons = [
    'aipom', 'ampharos', 'beedrill', 'bulbasaur', 'butterfree', 'caterpie', 'charmander', 'chikorita',
    'cleffa', 'corsola', 'delibird', 'dewgong', 'flareon', 'gligar', 'growlithe', 'horsea', 'ledyba',
    'mareep', 'marill', 'meowth', 'mew', 'miltank', 'natu', 'nidorina', 'omanyte', 'pidgey', 'pikachu',
    'politoed', 'poliwhirl', 'psyduck', 'rapidash', 'squirtle', 'togepi', 'togetic', 'totodie', 'vaporeon'
]

const rowCount = 9;
const columnCount = 16;

function getRandom2DArray() {
    if (pokemons.length * 4 !== rowCount * columnCount) {
        throw new Error("Số lượng phần tử không khớp với kích thước mảng 2D.");
    }

    // 1. Nhân bản mỗi phần tử 4 lần
    let elements: string[] = [];
    pokemons.forEach(str => {
        for (let i = 0; i < 4; i++) {
            elements.push(str);
        }
    });

    // 2. Xáo trộn mảng (Fisher-Yates Shuffle)
    for (let i = elements.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [elements[i], elements[j]] = [elements[j], elements[i]];
    }

    // 3. Chuyển thành mảng 2D
    let grid = Array.from({ length: rowCount }, () => Array(columnCount).fill(null));
    let index = 0;

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            grid[r][c] = elements[index++];
        }
    }

    // 4. Tạo lớp bọc (đường biên)
    const newGrid = Array.from({ length: grid.length + 2 }, () => Array(grid[0].length + 2).fill(''));
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            newGrid[i + 1][j + 1] = grid[i][j];
        }
    }

    return newGrid;
}

type Point = { x: number; y: number; dir: number; turnCount: number };

function isValid(x: number, y: number, rows: number, cols: number): boolean {
    return x >= 0 && y >= 0 && x < cols && y < rows;
  }

function canScored(grid: string[][], x1: number, y1: number, x2: number, y2: number): boolean {
    const rows = grid.length;
    const cols = grid[0].length;

    if (grid[y1][x1] === '' || grid[y2][x2] === '' || (x1 === x2 && y1 === y2)) return false;

    const directions = [
        { dx: 0, dy: 1 },  // Đi xuống
        { dx: 0, dy: -1 }, // Đi lên
        { dx: 1, dy: 0 },  // Đi phải
        { dx: -1, dy: 0 }  // Đi trái
    ];

    const queue: Point[] = [];
    const visited = Array.from({ length: rows }, () => Array.from({ length: cols }, () => new Set()));

    for (let d = 0; d < 4; d++) {
        const nx = x1 + directions[d].dx;
        const ny = y1 + directions[d].dy;
        if (isValid(nx, ny, rows, cols) && (grid[ny][nx] === '' || (nx === x2 && ny === y2))) {
            queue.push({ x: nx, y: ny, dir: d, turnCount: 0 });
            visited[ny][nx].add(d);
        }
    }

    while (queue.length > 0) {
        const { x, y, dir, turnCount } = queue.shift()!;

        if (x === x2 && y === y2) return true;

        for (let d = 0; d < 4; d++) {
            const nx = x + directions[d].dx;
            const ny = y + directions[d].dy;
            const newTurnCount = dir === d ? turnCount : turnCount + 1;

            if (
                isValid(nx, ny, rows, cols) &&
                newTurnCount <= 2 &&
                !visited[ny][nx].has(d) &&
                (grid[ny][nx] === '' || (nx === x2 && ny === y2))
            ) {
                queue.push({ x: nx, y: ny, dir: d, turnCount: newTurnCount });
                visited[ny][nx].add(d);
            }
        }
    }

    return false;
}

function checkForMatchingPairsAndPaths(grid: string[][]): boolean {
    const rows = grid.length;
    const cols = grid[0].length;

    // Duyệt qua mảng tìm cặp giống nhau
    for (let y1 = 0; y1 < rows; y1++) {
        for (let x1 = 0; x1 < cols; x1++) {
            const pokemon1 = grid[y1][x1];

            if (pokemon1 === '') continue; // Nếu là vật cản, bỏ qua

            for (let y2 = y1; y2 < rows; y2++) {
                for (let x2 = y2 === y1 ? x1 + 1 : 0; x2 < cols; x2++) {
                    const pokemon2 = grid[y2][x2];

                    if (pokemon1 === pokemon2 && pokemon2 !== '') {
                        // Tìm được cặp giống nhau và không phải là vật cản
                        // Kiểm tra xem có đường đi hợp lệ giữa chúng không
                        if (canScored(grid, x1, y1, x2, y2)) {
                            console.log(`Found pair: (${x1}, ${y1}) and (${x2}, ${y2})`);
                            return true;  // Nếu có đường đi hợp lệ, trả về true
                        }
                    }
                }
            }
        }
    }

    // Nếu không tìm thấy cặp giống nhau hoặc không có đường đi hợp lệ
    return false;
}

function shuffleGrid(grid: string[][]): string[][] {
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Bước 1: Thu thập tất cả phần tử khác ''
    const elements: string[] = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] !== '') {
                elements.push(grid[y][x]);
            }
        }
    }

    // Bước 2: Xáo trộn mảng elements bằng thuật toán Fisher-Yates
    for (let i = elements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [elements[i], elements[j]] = [elements[j], elements[i]];
    }

    // Bước 3: Gán lại các phần tử đã xáo trộn vào grid
    let index = 0;
    const newGrid = grid.map(row => row.map(cell => {
        if (cell !== '') {
            return elements[index++];
        }
        return ''; // Giữ nguyên vị trí của ''
    }));

    return newGrid;
}


export { pokemons, getRandom2DArray, canScored, checkForMatchingPairsAndPaths, shuffleGrid };
