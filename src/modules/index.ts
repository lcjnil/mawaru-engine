import { Engine } from './ecs';
import { Camera } from './resource/camera';
import { CanvasService } from './resource/canvasService';
import { Config } from './resource/config';
import { State } from './resource/state';
import { MapRenderSystem } from './system/mapRenderSystem';
import { Ball } from './component/ball';
import { Position } from './component/position';
import { Throwable } from './component/Throwable';
import { Mouse } from './resource/mouse';

// TODO: add restart
export class ThrowBall extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initCanvas();

        this.addBall();

        import('./system/positionSystem').then(({ PositionSystem }) =>
            this.addSystem(PositionSystem)
        );
        import('./system/cameraSystem').then(({ CameraSystem }) =>
            this.addSystem(CameraSystem)
        );
        this.addSystem(MapRenderSystem);
        import('./system/ballRenderSystem').then(({ BallRenderSystem }) =>
            this.addSystem(BallRenderSystem)
        );
        import('./system/throwSystem').then(({ ThrowSystem }) =>
            this.addSystem(ThrowSystem)
        );
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

    addBall() {
        const config = this.getResource(Config);
        this.addEntity(
            new Ball(),
            new Position([config.width / 2, 50, 50]),
            new Throwable()
        );
    }

    tick() {
        const canvasService = this.getResource(CanvasService);
        for (const layer of canvasService.layers.values()) {
            layer.fillStyle = '#f1f1f1';
            layer.fillRect(0, 0, layer.canvas.width, layer.canvas.height);
        }
    }
}
