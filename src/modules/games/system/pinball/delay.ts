import { Engine, System } from '../../../ecs';
import { Delay } from '../../resource/pinball/delay';

@System
export class DelaySystem {
    constructor(public engine: Engine) {}

    run() {
        const delayEntityList = this.engine.queryEntities(Delay);

        for (const entity of delayEntityList) {
            const delay = entity.getComponentOrThrow(Delay);
            delay.delay -= this.engine.deltaTickTime;

            if (delay.delay <= 0) {
                entity.removeComponent(Delay);
            }
        }
    }
}
