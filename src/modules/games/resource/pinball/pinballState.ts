export class PinballState {
    /**
     * 弹球游戏分为三个阶段，分别是准备射击、弹球移动、怪物移动、结束
     */
    state: 'shoot' | 'move' | 'finish' = 'shoot';
}
