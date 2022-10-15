import { Engine, Resource, System } from '../../../ecs';
import { CanvasService } from '../../resource/canvasService';
import { PinballConfig } from '../../resource/pinball/PinballConfig';
import { Position } from '../../component/pinball/position';
import { Pinball } from '../../component/pinball/pinball';

@System
export class PinballRenderer {
    constructor(public engine: Engine) {}

    run(
        @Resource(CanvasService) canvasService: CanvasService,
        @Resource(PinballConfig) pinballConfig: PinballConfig
    ) {
        const pinball = this.engine.queryEntities(Pinball, Position);
        const ctx = canvasService.defaultLayer;

        for (const ball of pinball) {
            const position = ball.getComponentOrThrow(Position);
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(
                position.x,
                position.y,
                pinballConfig.ballRadius,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
}
