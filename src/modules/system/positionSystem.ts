import { Resource, System } from '../ecs';
import { Config } from '../resource/config';
import { ThrowBall } from '../index';
import { Position } from '../component/position';

@System
export class PositionSystem {
    lastTime = 0;

    run(
        @Resource(Config) config: Config,
        @Resource(ThrowBall) engine: ThrowBall
    ) {
        const positions = engine.queryEntity(Position);
        if (!positions.length) {
            return;
        }

        const [[positionComponent]] = positions;
        const {
            startTime,
            acceleration,
            position,
            velocity,
            originalPosition,
        } = positionComponent;

        if (startTime === 0) {
            return;
        }

        // const now = Date.now();
        // const t = (now - startTime) / 1000;
        // // 根据起点算的
        // for (let i = 0; i < 3; i++) {
        //     const a = acceleration[i];
        //     const v = velocity[i];
        //     const x = originalPosition[i];
        //
        //     position[i] = x + v * t + 0.5 * a * t * t;
        //
        //     if (i == 1) {
        //         if (v + a * t <= 5) {
        //             positionComponent.startTime = 0;
        //         }
        //     }
        // }

        // calculate by delta
        const now = Date.now();
        if (!this.lastTime) {
            this.lastTime = now;
            return;
        }
        for (let i = 0; i < 3; i++) {
            const a = acceleration[i];

            const dt = (now - this.lastTime) / 1000;

            velocity[i] = velocity[i] + a * dt;
            position[i] = position[i] + velocity[i] * dt;

            if (i === 0) {
                const offset = Math.abs(position[i] - config.width / 2);
                if (offset > config.width / 4) {
                    acceleration[i] *= 1.08;
                }

                if (velocity[i] <= 0) {
                    acceleration[i] = 0;
                    velocity[i] = 0;
                }
            }

            if (i == 1) {
                if (velocity[i] <= 5) {
                    positionComponent.startTime = 0;
                }
            }
        }

        this.lastTime = Date.now();
    }
}
