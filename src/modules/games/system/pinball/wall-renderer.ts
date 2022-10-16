import { Engine, Resource, System } from '../../../ecs';
import { CanvasService } from '../../resource/canvasService';
import { Wall } from '../../component/pinball/wall';
import { Position } from '../../component/pinball/position';
import { PinballConfig } from '../../resource/pinball/pinballConfig';

@System
export class WallRenderer {
    constructor(public engine: Engine) {}

    run(
        @Resource(CanvasService) canvasService: CanvasService,
        @Resource(PinballConfig) pinballConfig: PinballConfig
    ) {
        const ctx = canvasService.defaultLayer;
        const walls = this.engine.queryEntities(Wall, Position);

        for (const wall of walls) {
            const position = wall.getComponentOrThrow(Position);

            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#000';
            ctx.setLineDash([]);
            ctx.fillRect(
                position.x + 2,
                position.y + 2,
                pinballConfig.blockSize - 4,
                pinballConfig.blockSize - 4
            );
        }
    }
}
