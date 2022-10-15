import { Engine, Resource, System } from '../../../ecs';
import { CanvasService } from '../../resource/canvasService';
import { Position } from '../../component/pinball/position';
import { PinballConfig } from '../../resource/pinball/PinballConfig';
import { Monster } from '../../component/pinball/monster';
import { Health } from '../../component/pinball/health';

@System
export class MonsterRenderer {
    constructor(public engine: Engine) {}

    run(
        @Resource(CanvasService) canvasService: CanvasService,
        @Resource(PinballConfig) pinballConfig: PinballConfig
    ) {
        const ctx = canvasService.defaultLayer;
        const walls = this.engine.queryEntities(Monster, Position);

        for (const wall of walls) {
            const position = wall.getComponentOrThrow(Position);

            ctx.strokeStyle = 'blue';
            ctx.strokeRect(
                position.x + 2,
                position.y + 2,
                pinballConfig.blockSize - 4,
                pinballConfig.blockSize - 4
            );

            const health = wall.getComponentOrThrow(Health);
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.fillText(
                health.value.toString(),
                position.x + pinballConfig.blockSize / 2,
                position.y + pinballConfig.blockSize / 2
            );
        }
    }
}
