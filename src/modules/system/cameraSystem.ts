import { Resource, System } from '../ecs';
import { Camera } from '../resource/camera';
import { ThrowBall } from '../index';
import { Position } from '../component/position';
import { Config } from '../resource/config';

@System
export class CameraSystem {
    run(
        @Resource(Camera) camera: Camera,
        @Resource(Config) config: Config,
        @Resource(ThrowBall) engine: ThrowBall
    ) {
        const position = engine.queryEntity(Position)?.[0]?.[0];
        if (!position) {
            return;
        }

        if (position.position[1] < (config.height * 3) / 4) {
            return;
        }

        camera.offset = position.position[1] - (config.height * 3) / 4;
    }
}
