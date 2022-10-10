import { Resource, System } from '../ecs';
import { Camera } from '../resource/camera';
import { Map } from '../resource/map';
import { CanvasService } from '../resource/canvasService';
import { Config } from '../resource/config';

/*
┌──────────────────────────┐
│┼───────────▲────────────┼│ ▲
││           │            ││ │
││           │            ││ │
││           │            ││ │
││           │ y          ││ │
││           │            ││ │  height
││           │            ││ │
││           │            ││ │
││           │            ││ │
│◄───────────x            ││ │
││     x                  ││ │
├┴────────────────────────┴┤ ▼
│                          │ │
│                          │ │
│                          │ │  offset
│                          │ │
│                          │ │
└──────────────────────────┘ ▼

cameraY + worldY = offset + height

 */

@System
export class MapRenderSystem {
    run(
        @Resource(Camera) camera: Camera,
        @Resource(Map) map: Map,
        @Resource(Config) config: Config,
        @Resource(CanvasService) canvasService: CanvasService
    ) {
        const ctx = canvasService.defaultLayer;
        const { offset } = camera;
        const { height } = config;

        // TODO: add some start
        const range = [offset, config.height + offset];

        for (
            let worldY = Math.ceil(range[1] / 100) * 100;
            worldY >= Math.floor(range[0] / 100) * 100;
            worldY -= 100
        ) {
            const cameraY = offset + height - worldY;
            ctx.beginPath();
            ctx.moveTo(0, cameraY);
            ctx.lineTo(config.width, cameraY);
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.font = '20px serif';
            ctx.fillText(worldY.toString(), config.width / 2, cameraY + 8);
        }
    }
}
