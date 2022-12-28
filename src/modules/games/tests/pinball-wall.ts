import { Engine } from '../../ecs';
import { Config } from '../resource/config';
import { Camera } from '../resource/camera';
import { CanvasService } from '../resource/canvasService';
import { Mouse } from '../resource/mouse';
import { PinballConfig } from '../resource/pinball/pinballConfig';
import { WallRenderer } from '../system/pinball/wall-renderer';
import { Entity } from '../../ecs/base/entity';
import { Wall } from '../component/pinball/wall';
import { Position } from '../component/pinball/position';
import { Obstacle } from '../component/pinball/obstacle';
import { Pinball } from '../component/pinball/pinball';
import { Speed } from '../component/pinball/speed';
import { PinballRenderer } from '../system/pinball/pinball-renderer';
import { MoveSystem } from '../system/pinball/move';

export default class PinballWall extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initCanvas();

        this.initMap();

        this.addSystem(WallRenderer)
            .addSystem(MoveSystem)
            .addSystem(PinballRenderer);
    }

    initConfig() {
        this.addResource(Config);
        this.addResource(PinballConfig);
    }

    initCanvas() {
        this.addResource(Camera);

        const canvasService = new CanvasService();
        this.addResourceInstance(canvasService);

        const config = this.getResource(Config);

        const canvas = canvasService.createCanvas({
            name: 'map',
            width: config.screenWidth,
            height: config.screenHeight,
            container: this.container,
            isDefault: true,
        });

        const mouse = new Mouse();
        mouse.bindEvents(canvas);

        this.addResourceInstance(mouse);
    }

    initMap() {
        // create walls and obstacles around the map

        for (let x = 0; x < 400; x += 40) {
            for (let y = 0; y < 400; y += 40) {
                if (x === 40 || x === 360 || y === 40 || y === 360) {
                    this.addEntity(
                        new Entity(
                            new Wall(),
                            new Position(x, y),
                            new Obstacle()
                        )
                    );
                }
            }
        }

        this.addEntity(
            new Entity(
                new Pinball(),
                new Position(120, 120),
                new Speed(Math.PI * 0.3, 100)
            )
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
