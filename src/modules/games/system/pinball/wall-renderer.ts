import { Engine, Resource, System } from '../../../ecs';
import { CanvasService } from '../../resource/canvasService';
import { Wall } from '../../component/pinball/wall';
import { PinballConfig } from '../../resource/pinball/pinballConfig';
import { Rect } from '../../component/pinball/rect';

@System
export class WallRenderer {
    constructor(public engine: Engine) {}

    run(
        @Resource(CanvasService) canvasService: CanvasService,
        @Resource(PinballConfig) pinballConfig: PinballConfig
    ) {
        const ctx = canvasService.defaultLayer;
        const walls = this.engine.queryEntities(Wall, Rect);

        for (const wall of walls) {
            const rect = wall.getComponentOrThrow(Rect);

            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#000';
            ctx.setLineDash([]);

            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        }
    }
}
