import { Resource, System } from '../ecs';
import { ThrowBall } from '../index';
import { Camera } from '../resource/camera';
import { Map } from '../resource/map';
import { Config } from '../resource/config';
import { Mouse } from '../resource/mouse';
import { Ball } from '../component/ball';
import { Throwable } from '../component/Throwable';
import { Position } from '../component/position';

@System
export class ThrowSystem {
    isDragging = false;
    startTime = 0;
    draggingPosition = [0, 0];

    run(
        @Resource(ThrowBall) engine: ThrowBall,
        @Resource(Camera) camera: Camera,
        @Resource(Map) map: Map,
        @Resource(Config) config: Config,
        @Resource(Mouse) mouse: Mouse
    ) {
        const { x, y } = mouse;
        const dragEntity = engine.queryEntity(Ball, Throwable, Position)?.[0];

        if (!dragEntity) {
            return;
        }

        const [ballComponent, _, positionComponent] = dragEntity;

        if (x === -1 || y === -1) {
            if (!this.isDragging) {
                return;
            }

            this.isDragging = false;

            const dragOffset = [
                this.draggingPosition[0] - x,
                this.draggingPosition[1] - y,
            ];
            const dragDuration = (Date.now() - this.startTime) / 1000;
            const xRatio = 12;
            const yRatio = 3;

            // TODO: 呜呜呜这里需要调参
            positionComponent.move(
                [
                    -dragOffset[0] / 8 / dragDuration / xRatio,
                    -dragOffset[1] / 8 / dragDuration / yRatio,
                    0,
                ],
                [
                    dragOffset[0] / dragDuration / xRatio,
                    dragOffset[1] / dragDuration / yRatio,
                    0,
                ]
            );

            return;
        }

        if (this.isDragging) {
            return;
        }

        const worldY = config.height - y + camera.offset;

        const xInRange =
            Math.abs(x - positionComponent.position[0]) < ballComponent.width;
        const yInRange =
            Math.abs(worldY - positionComponent.position[1]) <
            ballComponent.width;

        if (xInRange && yInRange) {
            this.isDragging = true;
            this.startTime = Date.now();
            this.draggingPosition = [x, y];
        }
    }
}
