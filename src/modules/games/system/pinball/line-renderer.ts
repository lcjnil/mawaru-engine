import { Engine, Resource, System } from '../../../ecs';
import { Line } from '../../component/pinball/line';
import { CanvasService } from '../../resource/canvasService';
import { PinballState } from '../../resource/pinball/pinballState';
import { Mouse } from '../../resource/mouse';

@System
export class LineRenderer {
    constructor(public engine: Engine) {}

    run(
        @Resource(CanvasService) canvasService: CanvasService,
        @Resource(PinballState) pinballState: PinballState,
        @Resource(Mouse) mouse: Mouse
    ) {
        if (pinballState.state !== 'shoot') {
            return;
        }

        // TODO: 这里叫 renderer 也不完全，因为还有移动的处理
        const line = this.engine.queryEntities(Line)[0];

        if (!line) {
            return;
        }

        // if x y exists, move line's angle
        const lineComponent = line.getComponentOrThrow(Line);

        const { x, y } = mouse;

        if (x !== -1 && y !== -1) {
            const dx = x - lineComponent.position[0];
            const dy = y - lineComponent.position[1];
            lineComponent.angle = Math.atan2(dy, dx);
            lineComponent.changed = true;
        }

        const ctx = canvasService.defaultLayer;

        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.setLineDash([5, 10]);
        ctx.moveTo(lineComponent.position[0], lineComponent.position[1]);
        // TODO: add collision
        ctx.lineTo(
            lineComponent.position[0] + Math.cos(lineComponent.angle) * 10000,
            lineComponent.position[1] + Math.sin(lineComponent.angle) * 10000
        );
        ctx.stroke();
    }
}
