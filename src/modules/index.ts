import { Engine } from './ecs';
import { Camera } from './resource/camera';
import { CanvasService } from './resource/canvasService';
import { Config } from './resource/config';
import { Map } from './resource/map';
import { MapRenderer } from './system/mapRenderer';

export class MyEngine extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initMap();
        this.initCanvas();

        this.addSystem(MapRenderer);
    }

    initConfig() {
        const config = new Config();
        config.enableDebug = true;
        this.addResourceInstance(config);
    }

    initMap() {
        const map = new Map(10, 10, this.genMap(100));
        this.addResourceInstance(map);
    }

    private genMap(count: number) {
        return [...new Array(count)].map((_, index) => ({
            type: index.toString(),
        }));
    }

    initCanvas() {
        const canvasService = new CanvasService(2);
        this.addResourceInstance(canvasService);

        const canvas = document.createElement('canvas');
        canvas.width = 100 * 2;
        canvas.height = 100 * 2;
        canvas.style.width = '500px';
        canvas.style.height = '500px';

        this.container.appendChild(canvas);
        canvasService.addLayer('map', canvas);

        const camera = new Camera({
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
        });
        this.addResourceInstance(camera);
    }

    tick() {
        // do nothing
    }
}
