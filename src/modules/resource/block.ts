export class Block {
    lane = 4;
    verticalCount = 4;

    blockWidth = 100;
    blockHeight = 200;

    yIndex = 1;

    blocks: number[] = [];

    animateBlocks: Array<{
        x: number;
        y: number;
        startTime: number;
        duration: number;
        type: 'success' | 'failure';
    }> = [];

    generateBlockIndex() {
        this.blocks = [...new Array(100)].map(() =>
            Math.floor(this.lane * Math.random())
        );
        this.blocks.unshift(-1);
    }
}
