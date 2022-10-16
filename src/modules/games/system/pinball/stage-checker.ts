import { Engine, Resource, System } from '../../../ecs';
import { State } from '../../resource/state';
import { PinballState } from '../../resource/pinball/pinballState';
import { Line } from '../../component/pinball/line';
import { Mouse } from '../../resource/mouse';
import { PinballConfig } from '../../resource/pinball/pinballConfig';
import { Entity } from '../../../ecs/base/entity';
import { Pinball } from '../../component/pinball/pinball';
import { Position } from '../../component/pinball/position';
import { Speed } from '../../component/pinball/speed';
import { Delay } from '../../resource/pinball/delay';
import { Monster } from '../../component/pinball/monster';

@System
export class StageChecker {
    constructor(public engine: Engine) {}

    run(
        @Resource(PinballState) pinballState: PinballState,
        @Resource(PinballConfig) pinballConfig: PinballConfig,
        @Resource(Mouse) mouse: Mouse
    ) {
        // TODO: 根据当前的状态进行状态机流转
        // shoot -> move -> monster -> shoot -> ... -> finish

        if (pinballState.state === 'shoot') {
            const line = this.engine.queryEntities(Line)[0];
            if (!line) {
                return;
            }

            const lineComponent = line.getComponentOrThrow(Line);

            if (lineComponent.changed && mouse.x === -1 && mouse.y === -1) {
                // shoot balls
                for (let i = 0; i < pinballConfig.ballCount; i++) {
                    this.engine.addEntity(
                        new Entity(
                            new Pinball(),
                            new Position(...pinballConfig.shootPosition),
                            new Speed(lineComponent.angle, pinballConfig.speed),
                            new Delay((i + 1) * pinballConfig.delay)
                        )
                    );
                }

                pinballState.state = 'move';
                lineComponent.reset();
            }
        } else if (pinballState.state === 'move') {
            const balls = this.engine.queryEntities(Pinball);
            if (balls.length) {
                return;
            }

            const monsters = this.engine.queryEntities(Monster, Position);
            // TODO: 判断游戏结束

            for (const monster of monsters) {
                const position = monster.getComponentOrThrow(Position);
                position.y += pinballConfig.blockSize;
            }

            pinballState.state = 'shoot';
        }
    }
}
