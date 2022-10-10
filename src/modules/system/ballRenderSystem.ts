import { Resource, System } from '../ecs';
import { ThrowBall } from '../index';
import { Camera } from '../resource/camera';
import { Map } from '../resource/map';
import { Config } from '../resource/config';
import { CanvasService } from '../resource/canvasService';
import { Ball } from '../component/ball';
import { Position } from '../component/position';

@System
export class BallRenderSystem {
    run(
        @Resource(ThrowBall) engine: ThrowBall,
        @Resource(Camera) camera: Camera,
        @Resource(Map) map: Map,
        @Resource(Config) config: Config,
        @Resource(CanvasService) canvasService: CanvasService
    ) {
        const ctx = canvasService.defaultLayer;
        const { offset } = camera;
        const { height } = config;

        const BallEntity = engine.queryEntity(Ball, Position)?.[0];
        if (!BallEntity) {
            return;
        }

        const [_, positionComponent] = BallEntity;

        const [x, y, z] = positionComponent.position;
        const cameraY = offset + height - y;
        const cameraX = x;

        ctx.beginPath();
        ctx.arc(cameraX, cameraY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.fill();
    }
}
