import { Resource, System } from '../ecs';
import { Map } from '../resource/map';
import { Camera } from '../resource/camera';
import { Config } from '../resource/config';
import { CanvasService } from '../resource/canvasService';

@System
export class MapRenderer {
    run(
        @Resource(Map) map: Map,
        @Resource(Camera) camera: Camera,
        @Resource(Config) config: Config,
        @Resource(CanvasService) canvasService: CanvasService
    ) {
        const renderLayer = canvasService.getLayer('map')!;

        for (const index in map.blocks) {
            const [x, y] = map.getBlockWorldPosition(
                index as unknown as number
            )!;

            const block = map.blocks[index];

            renderLayer.fillStyle = '#000';

            if (config.enableDebug) {
                renderLayer.font = '10px Arial';
                renderLayer.fillText(
                    block.type,
                    x * canvasService.scaleRatio,
                    (y + Map.blockSize / 2) * canvasService.scaleRatio
                );
            }
        }
    }
}
