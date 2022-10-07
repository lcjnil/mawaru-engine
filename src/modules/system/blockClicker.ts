import { Resource, System } from '../ecs';
import { Camera } from '../resource/camera';
import { Block } from '../resource/block';
import { Mouse } from '../resource/mouse';
import { PlayState, State } from '../resource/state';

@System
export class BlockClicker {
    canHit = true;

    async run(
        @Resource(State) state: State,
        @Resource(Camera) camera: Camera,
        @Resource(Mouse) mouse: Mouse,
        @Resource(Block) block: Block
    ) {
        if (state.state !== PlayState.playing) {
            return;
        }

        const { x, y } = mouse;

        if (!this.canHit) {
            return;
        }

        if (x === -1 || y === -1) {
            return;
        }

        const clickedXIndex = Math.floor(x / block.blockWidth);
        const clickedYIndex = Math.floor(
            (block.verticalCount * block.blockHeight - y + camera.offset) /
                block.blockHeight
        );

        if (clickedYIndex !== block.yIndex) {
            return;
        }

        const isHit = block.blocks[clickedYIndex] === clickedXIndex;

        block.animateBlocks.push({
            x: clickedXIndex,
            y: clickedYIndex,
            startTime: Date.now(),
            duration: isHit ? 150 : 500,
            type: isHit ? 'success' : 'failure',
        });

        // Hit~
        if (isHit) {
            block.yIndex++;
            mouse.x = -1;
            mouse.y = -1;

            await new Promise((resolve) => setTimeout(resolve, 100));
            await camera.moveDelta(block.blockHeight, 130);
        } else {
            this.canHit = false;
            state.state = PlayState.finished;
            state.endTime = Date.now();
            return;
        }

        if (Date.now() - state.startTime >= state.duration) {
            state.state = PlayState.finished;
            state.endTime = Date.now();
        }
    }
}
