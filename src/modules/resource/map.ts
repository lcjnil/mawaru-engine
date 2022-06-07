export interface Block {
    type: string;
}

/*
// 砖块世界坐标
---------------------------->x
|(0, 0), (2, 1), (2, 2), (2, 3)
|(1, 0), (1, 1), (1, 2), (1, 3)
|(2, 0), (0, 1), (0, 2), (0, 3)
↓
y

// 世界坐标 = 砖块世界坐标 * 砖块的大小
worldSpacePosition(x, y)

┌───────────────┬───────┬───────────────────────────┐
│               │       │                           │
│               │       │                           │
│               │       │                           │
│               │Wy     │ Cy                        │
│               │       │                           │
│               │       │                           │
│           ┌───┼───────┼──────────┐ ▲              │
│           │   │       │          │ │              │
│     Wx    │   ▼       │          │ │              │
├───────────┼──►@       ▼          │ │              │
├───────────┼──────────►C          │ │ height       │
│        Cx │                      │ │              │
│           │                      │ │              │
│           │               Camera │ │              │
│           └──────────────────────┘ ▼              │
│           ◄──────────────────────►                │
│                     width                         │
│                                                   │
│                                                   │
│                                     World Space   │
└───────────────────────────────────────────────────┘
    Screen Space:
    Sx = width/2 - (Cx - Wx)
    Sy = height/2 - (Cy - Wy)


*/

export class Map {
    // 先虚空来一个
    static blockSize = 10;

    constructor(
        public width: number,
        public height: number,
        public blocks: Block[]
    ) {}

    getBlockByPosition(x: number, y: number) {
        return this.blocks[y * this.width + x];
    }

    getPositionFromBlockIndex(index: number): [number, number] {
        return [index % this.width, Math.floor(index / this.width)];
    }

    /**
     * 获取一个 block 的世界坐标
     * @param index 砖块的 index
     */
    getBlockWorldPosition(index: number) {
        const [x, y] = this.getPositionFromBlockIndex(index);
        return [x * Map.blockSize, y * Map.blockSize];
    }
}
