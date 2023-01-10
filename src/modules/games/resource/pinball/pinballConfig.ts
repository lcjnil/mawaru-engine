const scaleRatio = window.innerWidth / 414;

export class PinballConfig {
    /**
     * wall 和 monster 的大小
     */
    blockSize = 40;

    /**
     * 弹珠的半径
     */
    ballRadius = 10;

    shootPosition: [number, number] = [0, 0];

    ballCount = 5;
    speed = 1500;

    // acceleration = -400;
    // minSpeed = 50;

    monsterScreenSize = 90 * scaleRatio;

    // 弹球区域的左右边界
    leftRightScreenPadding = 100 * scaleRatio;

    // 弹球区域的高度
    areaScreenHeight = 1130 * scaleRatio;

    healthArcRadius = 15 * scaleRatio;
    healthTextSize = 20 * scaleRatio + 'px';

    /** 水平方向的格子个数 */
    verticalCount = 7;
    /** 垂直方向的格子个数 */
    horizontalCount = 11;

    healthRange = [1, 10] as const;

    delay = (1000 / 60) * 3;
}
