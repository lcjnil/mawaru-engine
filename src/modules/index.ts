import { Engine } from './ecs';
import { Camera } from './resource/camera';
import { CanvasService } from './resource/canvasService';
import { Config } from './resource/config';
import { Map } from './resource/map';
import { Mouse } from './resource/mouse';
import { MapRenderer } from './system/mapRenderer';
import { MoveCamera } from './system/moveCanvas';

export class MyEngine extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initMap();
        this.initCanvas();

        this.addSystem(MapRenderer);
        this.addSystem(MoveCamera);
    }

    initConfig() {
        const config = new Config();
        config.enableDebug = true;
        this.addResourceInstance(config);
    }

    initMap() {
        const map = new Map(25, 25, this.genMap(25 * 25));
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

        const createCanvas = (name: string, width: number, height: number) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.style.imageRendering = 'pixelated';

            this.container.appendChild(canvas);
            canvasService.addLayer(name, canvas);

            return canvas;
        };

        const FULL_WIDTH = 500;
        const FULL_HEIGHT = 500;

        const CAMERA_WIDTH = 200;
        const CAMERA_HEIGHT = 200;

        const mapCanvas = createCanvas('map', FULL_WIDTH, FULL_HEIGHT);
        const cameraCanvas = createCanvas(
            'camera',
            CAMERA_WIDTH,
            CAMERA_HEIGHT
        );

        const camera = new Camera({
            x: CAMERA_WIDTH / 2,
            y: CAMERA_HEIGHT / 2,
            width: CAMERA_WIDTH,
            height: CAMERA_HEIGHT,
        });

        this.addResourceInstance(camera);

        const mouse = new Mouse();
        mouse.bindEvents(mapCanvas);

        this.addResourceInstance(mouse);
    }

    tick() {
        const canvasService = this.getResource(CanvasService);
        for (const layer of canvasService.layers.values()) {
            layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        }
    }
}
