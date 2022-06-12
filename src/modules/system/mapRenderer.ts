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
        this.renderFull(map, camera, config, canvasService);
        this.renderCamera(map, camera, config, canvasService);
    }

    private renderFull(
        map: Map,
        camera: Camera,
        config: Config,
        canvasService: CanvasService
    ) {
        const renderLayer = canvasService.getLayer('map');

        if (!renderLayer) {
            return;
        }

        for (const index in map.blocks) {
            const [x, y] = map.getBlockWorldPosition(
                index as unknown as number
            )!;

            const block = map.blocks[index];

            renderLayer.fillStyle = '#000';

            if (config.enableDebug) {
                renderLayer.font = '10px Arial';
                renderLayer.fillText(block.type, x, y + Map.blockSize / 2);
            }
        }

        // render grid
        renderLayer.strokeStyle = 'rgba(0, 0, 0, 1)';
        renderLayer.lineWidth = 1;

        for (let i = 1; i < map.width; i++) {
            renderLayer.beginPath();
            renderLayer.moveTo(i * Map.blockSize, 0);
            renderLayer.lineTo(i * Map.blockSize, map.height * Map.blockSize);
            renderLayer.stroke();
        }

        for (let i = 1; i < map.height; i++) {
            renderLayer.beginPath();
            renderLayer.moveTo(0, i * Map.blockSize);
            renderLayer.lineTo(map.width * Map.blockSize, i * Map.blockSize);
            renderLayer.stroke();
        }

        // render camera rect
        renderLayer.strokeStyle = 'rgba(0, 0, 0, 1)';
        renderLayer.lineWidth = 1;
        renderLayer.strokeRect(
            camera.x - camera.width / 2,
            camera.y - camera.height / 2,
            camera.width,
            camera.height
        );
    }

    private renderCamera(
        map: Map,
        camera: Camera,
        config: Config,
        canvasService: CanvasService
    ) {
        const renderLayer = canvasService.getLayer('camera');

        if (!renderLayer) {
            return;
        }

        for (const index in map.blocks) {
            const [wx, wy] = map.getBlockWorldPosition(
                index as unknown as number
            )!;

            const [sx, sy] = camera.getScreenSpaceFromWorldSpace(wx, wy);
            if (
                sx < -(Map.blockSize / 2) ||
                sy < -Map.blockSize / 2 ||
                sx > camera.width ||
                sy > camera.height
            ) {
                continue;
            }

            const block = map.blocks[index];

            renderLayer.fillStyle = '#000';

            if (config.enableDebug) {
                renderLayer.font = '10px Arial';
                renderLayer.fillText(block.type, sx, sy + Map.blockSize / 2);
            }
        }
    }
}
