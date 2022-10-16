export class PinballConfig {
    /**
     * wall 和 monster 的大小
     */
    blockSize = 40;

    monsterCount = 10;

    healthRange = [1, 10];

    /**
     * 弹珠的半径
     */
    ballRadius = 10;

    shootPosition: [number, number] = [0, 0];

    ballCount = 5;
    speed = 500;
    delay = 50;
}
