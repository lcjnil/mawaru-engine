import { Engine, Resource, System } from '../../../ecs';
import { CanvasService } from '../../resource/canvasService';

import bgImg from '../../assets/bg-small.jpg';

const backgroundSize = {
    width: 828,
    height: 1398,
};

/**
 * 这里是一些关于背景的知识
 * 中间部分是宽度约为 7 * 90，高度约为 12.5 * 90
 * 左右边距是 99
 * 下边距 270
 */

@System
export class BackgroundRenderer {
    bg = new Image();

    constructor(public engine: Engine) {
        this.bg.src = bgImg;
    }

    run(@Resource(CanvasService) canvasService: CanvasService) {
        const ctx = canvasService.defaultLayer;
        const canvasSize = canvasService.defaultLayerSize;

        const scaleRatio = canvasSize.width / backgroundSize.width;

        ctx.fillStyle = '#FFD192';
        ctx.rect(0, 0, canvasSize.width, canvasSize.height);
        ctx.fill();

        ctx.drawImage(
            this.bg,
            0,
            0,
            backgroundSize.width,
            backgroundSize.height,
            0,
            0,
            canvasSize.width,
            backgroundSize.height * scaleRatio
        );
    }
}
