import { Resource, System } from '../ecs';
import { Camera } from '../resource/camera';
import { CanvasService } from '../resource/canvasService';
import { Block } from '../resource/block';

@System
export class BlockRenderer {
    run(
        @Resource(Camera) camera: Camera,
        @Resource(Block) block: Block,
        @Resource(CanvasService) canvasService: CanvasService
    ) {
        this.clear(block, canvasService);
        this.renderBlocks(camera, block, canvasService);
        this.renderDivider(camera, block, canvasService);
    }

    clear(block: Block, canvasService: CanvasService) {
        const ctx = canvasService.defaultLayer;
        ctx.fillStyle = '#FFFFFF';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    renderBlocks(camera: Camera, block: Block, canvasService: CanvasService) {
        const visibleBlockIndex = Math.floor(camera.offset / block.blockHeight);
        const blocks = block.blocks.slice(
            visibleBlockIndex,
            visibleBlockIndex + block.verticalCount + 1
        );

        const ctx = canvasService.defaultLayer;

        for (let i = 0; i < blocks.length; i++) {
            // x dimension
            const x = blocks[i] * block.blockWidth;
            // y dimension
            const y =
                block.blockHeight * block.verticalCount -
                ((visibleBlockIndex + i + 1) * block.blockHeight -
                    camera.offset);

            ctx.fillStyle = '#262626';
            ctx.fillRect(x, y, block.blockWidth, block.blockHeight);
        }

        // render animated block
        const now = Date.now();
        for (const item of block.animateBlocks) {
            const p = Math.min(1, (now - item.startTime) / item.duration);
            const x = item.x * block.blockWidth;
            const y =
                block.blockHeight * block.verticalCount -
                ((item.y + 1) * block.blockHeight - camera.offset);

            // 不管怎么样，先清空
            ctx.fillStyle = item.type === 'success' ? '#262626' : '#FFFFFF';
            ctx.fillRect(x, y, block.blockWidth, block.blockHeight);

            if (item.type === 'success') {
                const width = p * block.blockWidth;
                const height = p * block.blockHeight;
                ctx.fillStyle = '#EBEBEB';
                ctx.fillRect(
                    x + (block.blockWidth - width) / 2,
                    y + (block.blockHeight - height) / 2,
                    width,
                    height
                );
            } else {
                const isBlink = Math.floor(p * 4) % 2;
                ctx.fillStyle = isBlink ? 'red' : '#FFFFFF';
                ctx.fillRect(x, y, block.blockWidth, block.blockHeight);
            }

            if (p > 1) {
                const index = block.animateBlocks.indexOf(item);
                block.animateBlocks.splice(index, 1);
            }
        }
    }

    renderDivider(camera: Camera, block: Block, canvasService: CanvasService) {
        const ctx = canvasService.defaultLayer;
        const visibleBlockIndex = Math.floor(camera.offset / block.blockHeight);

        // render x
        for (let i = 0; i < block.blockWidth - 1; i++) {
            const x = (i + 1) * block.blockWidth;
            ctx.strokeStyle = '#777777';
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
            ctx.stroke();
        }

        // render y
        for (let i = 0; i < block.verticalCount; i++) {
            const y =
                block.blockHeight * block.verticalCount -
                ((visibleBlockIndex + i + 1) * block.blockHeight -
                    camera.offset);
            ctx.strokeStyle = '#777777';
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
        }
    }
}
