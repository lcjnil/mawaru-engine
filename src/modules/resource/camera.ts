export class Camera {
    /**
     * 摄像机的 x 世界坐标
     */
    x: number;
    /**
     * 摄像机的 y 世界坐标
     */
    y: number;

    /**
     * 摄像机的宽度
     */
    width: number;
    /**
     * 摄像机的高度
     */
    height: number;

    constructor({
        x,
        y,
        width,
        height,
    }: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }

    moveCamera(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getScreenSpaceFromWorldSpace(Wx: number, Wy: number) {
        return {
            x: this.width / 2 - (this.x - Wx),
            y: this.height / 2 - (this.y - Wy),
        };
    }
}
