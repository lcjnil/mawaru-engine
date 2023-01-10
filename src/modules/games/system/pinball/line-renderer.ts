import { Engine, Resource, System } from '../../../ecs';
import { Line } from '../../component/pinball/line';
import { CanvasService } from '../../resource/canvasService';
import { PinballState } from '../../resource/pinball/pinballState';
import { Mouse } from '../../resource/mouse';

import FortPng from '../../assets/forts.png';

@System
export class LineRenderer {
    private fortImage = new Image();
    fortImageRect = {
        width: 216,
        height: 237,
    };
    scaleRatio = 0.5;

    constructor(public engine: Engine) {
        this.fortImage.src = FortPng;
    }

    run(
        @Resource(CanvasService) canvasService: CanvasService,
        @Resource(PinballState) pinballState: PinballState,
        @Resource(Mouse) mouse: Mouse
    ) {
        // if (pinballState.state !== 'shoot') {
        //     return;
        // }

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

        if (pinballState.state === 'shoot') {
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.setLineDash([5, 10]);
            ctx.moveTo(lineComponent.position[0], lineComponent.position[1]);
            // TODO: add collision
            ctx.lineTo(
                lineComponent.position[0] +
                    Math.cos(lineComponent.angle) * 10000,
                lineComponent.position[1] +
                    Math.sin(lineComponent.angle) * 10000
            );
            ctx.stroke();
        }

        // rotate to angle
        ctx.save();
        ctx.translate(lineComponent.position[0], lineComponent.position[1]);
        ctx.rotate(lineComponent.angle + Math.PI / 2);
        ctx.translate(-lineComponent.position[0], -lineComponent.position[1]);
        ctx.drawImage(
            this.fortImage,
            0,
            0,
            this.fortImageRect.width,
            this.fortImageRect.height,
            lineComponent.position[0] -
                (this.fortImageRect.width * this.scaleRatio) / 2,
            lineComponent.position[1] -
                (this.fortImageRect.height * this.scaleRatio) / 2,
            this.fortImageRect.width * this.scaleRatio,
            this.fortImageRect.height * this.scaleRatio
        );
        ctx.restore();
    }
}
