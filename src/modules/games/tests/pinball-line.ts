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
import { Monster } from '../component/pinball/monster';
import { Health } from '../component/pinball/health';
import { MonsterRenderer } from '../system/pinball/monster-renderer';
import { DamageSystem } from '../system/pinball/damage';
import { LineRenderer } from '../system/pinball/line-renderer';
import { Line } from '../component/pinball/line';
import { PinballState } from '../resource/pinball/pinballState';

export default class PinballWall extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initCanvas();

        const config = this.getResource(Config);

        this.addEntity(
            new Entity(
                new Line(Math.PI * 1.5, [config.width / 2, config.height - 100])
            )
        );

        this.addSystem(LineRenderer);
    }

    initConfig() {
        this.addResource(Config);
        this.addResource(PinballConfig);
        this.addResource(PinballState);
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
