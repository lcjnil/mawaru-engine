import { Engine, Resource, System } from '../../../ecs';
import { PinballConfig } from '../../resource/pinball/pinballConfig';
import { Speed } from '../../component/pinball/speed';
import { Obstacle } from '../../component/pinball/obstacle';
import { Health } from '../../component/pinball/health';
import { WillDamage } from '../../component/pinball/will-damage';
import { Delay } from '../../resource/pinball/delay';
import { Config } from '../../resource/config';
import { Rect } from '../../component/pinball/rect';
import { Position } from '../../component/pinball/position';
import { Monster } from '../../component/pinball/monster';

@System
export class MoveSystem {
    constructor(public engine: Engine) {}

    run(
        @Resource(PinballConfig) pinballConfig: PinballConfig,
        @Resource(Config) config: Config
    ) {
        const balls = this.engine.queryEntities(Position, Speed);
        const obstacles = this.engine.queryEntities(Obstacle, Rect);

        // TODO: 需要处理碰撞
        for (const ball of balls) {
            const position = ball.getComponentOrThrow(Position);
            const speed = ball.getComponentOrThrow(Speed);
            const isDelayed = ball.hasComponent(Delay);

            if (isDelayed) {
                continue;
            }

            const time = this.engine.deltaTickTime / 1000;
            const angle = speed.angle;

            const dx = speed.speed * Math.cos(angle) * time;
            const dy = speed.speed * Math.sin(angle) * time;

            position.x += dx;
            position.y += dy;

            for (const obstacle of obstacles) {
                // if (
                //     obstacle.getComponent(Monster) &&
                //     !obstacle.getComponent(Health)
                // ) {
                //     continue;
                // }

                const isHit = this.isHit(
                    position,
                    speed,
                    obstacle.getComponentOrThrow(Rect),
                    pinballConfig
                );

                if (isHit) {
                    if (obstacle.hasComponent(Health)) {
                        obstacle.addComponent(new WillDamage(1));
                    }

                    break;
                }
            }

            if (
                position.y >=
                    pinballConfig.shootPosition[1] + pinballConfig.blockSize ||
                position.x <= 0 ||
                position.x >= config.screenWidth
            ) {
                this.engine.removeEntity(ball);
            }
        }
    }

    isHit(
        ball: Position,
        speed: Speed,
        obstacle: Rect,
        pinballConfig: PinballConfig
    ) {
        if (speed.hitComponent === obstacle) {
            return;
        }

        const ballX = ball.x;
        const ballY = ball.y;

        const obstacleX = obstacle.x + obstacle.width / 2;
        const obstacleY = obstacle.y + obstacle.height / 2;

        const isHit = isCircleHitRect(
            [ball.x, ball.y],
            pinballConfig.ballRadius,
            [obstacle.x, obstacle.y, obstacle.width, obstacle.height]
        );

        if (!isHit) {
            return;
        }

        speed.hitComponent = obstacle;

        if (Math.abs(ballX - obstacleX) > Math.abs(ballY - obstacleY)) {
            speed.angle = Math.PI - speed.angle;
        } else {
            speed.angle = -speed.angle;
        }

        return isHit;
    }
}

function isCircleHitRect(
    [cx, cy]: [number, number],
    radius: number,
    [x, y, w, h]: [number, number, number, number]
) {
    const closestX = Math.max(Math.min(cx, x + w), x);
    const closestY = Math.max(Math.min(cy, y + h), y);

    const distanceX = cx - closestX;
    const distanceY = cy - closestY;

    const distanceSquared = distanceX * distanceX + distanceY * distanceY;
    return distanceSquared < radius * radius;
}
