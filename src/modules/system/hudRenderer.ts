import { Resource, System } from '../ecs';
import { PlayState, State } from '../resource/state';
import { CanvasService } from '../resource/canvasService';
import { Block } from '../resource/block';

@System
export class HudRenderer {
    run(
        @Resource(State) state: State,
        @Resource(Block) block: Block,
        @Resource(CanvasService) canvasService: CanvasService
    ) {
        if (state.state === PlayState.initial) {
            return;
        }

        const ctx = canvasService.defaultLayer;

        const remains = Math.max(
            0,
            state.duration - ((state.endTime || Date.now()) - state.startTime)
        );

        const displayTime = remains.toString().padStart(5, '0').slice(0, 4);

        ctx.textAlign = 'center';
        ctx.font = '40px serif';
        ctx.fillStyle = 'green';
        ctx.fillText(
            `${displayTime.slice(0, 2)}:${displayTime.slice(2)}''`,
            (block.lane * block.blockWidth) / 2,
            block.blockHeight * 0.5
        );

        ctx.font = '40px serif';
        ctx.fillStyle = 'blue';
        ctx.fillText(
            `${block.yIndex - 1}`,
            (block.lane * block.blockWidth) / 2,
            block.blockHeight * 0.8
        );
    }
}
