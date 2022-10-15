import { Engine } from '../ecs';
import { Camera } from './resource/camera';
import { CanvasService } from './resource/canvasService';
import { Config } from './resource/config';
import { State } from './resource/state';
import { Mouse } from './resource/mouse';

// TODO: add restart
export class ThrowBall extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initCanvas();
    }

    initConfig() {
        const config = new Config();
        config.enableDebug = true;

        this.addResourceInstance(config);
        this.addResource(State);
    }

    initCanvas() {
        this.addResource(Camera);

        const canvasService = new CanvasService();
        this.addResourceInstance(canvasService);

        const config = this.getResource(Config);

        const canvas = canvasService.createCanvas({
            name: 'map',
            width: config.width,
            height: config.height,
            container: this.container,
            isDefault: true,
        });

        const mouse = new Mouse();
        mouse.bindEvents(canvas);

        this.addResourceInstance(mouse);
    }

    tick() {
        const canvasService = this.getResource(CanvasService);
        for (const layer of canvasService.layers.values()) {
            layer.fillStyle = '#f1f1f1';
            layer.fillRect(0, 0, layer.canvas.width, layer.canvas.height);
        }
    }
}
