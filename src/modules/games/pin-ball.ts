import { Engine } from '../ecs';
import { Camera } from './resource/camera';
import { CanvasService } from './resource/canvasService';
import { Config } from './resource/config';
import { State } from './resource/state';
import { Mouse } from './resource/mouse';
import { PinballState } from './resource/pinball/pinballState';
import { MoveSystem } from './system/pinball/move';
import { DamageSystem } from './system/pinball/damage';
import { WallRenderer } from './system/pinball/wall-renderer';
import { MonsterRenderer } from './system/pinball/monster-renderer';
import { PinballRenderer } from './system/pinball/pinball-renderer';
import { LineRenderer } from './system/pinball/line-renderer';
import { StageChecker } from './system/pinball/stage-checker';
import { Pinball } from './component/pinball/pinball';
import { PinballConfig } from './resource/pinball/pinballConfig';
import { Entity } from '../ecs/base/entity';
import { Line } from './component/pinball/line';
import { Monster } from './component/pinball/monster';
import { Obstacle } from './component/pinball/obstacle';
import { Position } from './component/pinball/position';
import { Health } from './component/pinball/health';
import { Wall } from './component/pinball/wall';
import { DelaySystem } from './system/pinball/delay';

// TODO: add restart
export class PinBallEngine extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initCanvas();

        this.initEntities();

        // NOTE: 现在 system 比较多，可能需要根据 stage 来切换 活跃的 system
        this.addSystem(DelaySystem)
            .addSystem(LineRenderer)
            .addSystem(MoveSystem)
            .addSystem(DamageSystem)
            .addSystem(WallRenderer)
            .addSystem(MonsterRenderer)
            .addSystem(PinballRenderer)
            .addSystem(StageChecker);
    }

    initConfig() {
        const config = new Config();
        config.enableDebug = true;

        const pinballConfig = new PinballConfig();
        pinballConfig.shootPosition = [config.width / 2, config.height - 100];

        this.addResourceInstance(config);
        this.addResourceInstance(pinballConfig);
        this.addResource(State);
        this.addResource(PinballState);
    }

    initEntities() {
        const pinballConfig = this.getResource(PinballConfig);

        this.addEntity(
            new Entity(
                new Line(Math.PI * 1.5, [...pinballConfig.shootPosition])
            )
        );

        this.initMonsters();
        this.initWalls();
    }

    initWalls() {
        const pinballConfig = this.getResource(PinballConfig);
        const config = this.getResource(Config);
        const step = pinballConfig.blockSize;

        const minX = 1;
        const maxX = Math.floor(config.width / step - 1);

        const minY = 1;
        const maxY = Math.floor(config.height / step - 1);

        // generate walls
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                if (x === minX || x === maxX || y === minY) {
                    this.addEntity(
                        new Entity(
                            new Wall(),
                            new Obstacle(),
                            new Position(x * step, y * step)
                        )
                    );
                }
            }
        }
    }

    initMonsters() {
        const config = this.getResource(Config);
        const pinballConfig = this.getResource(PinballConfig);
        const step = pinballConfig.blockSize;

        const minX = 2;
        const maxX = Math.floor(config.width / step - 2);

        const minY = 3;
        const maxY = Math.floor(pinballConfig.shootPosition[1] / step - 2);

        const generated = new Set<string>();
        // generate monster at random position
        for (let i = 0; i < pinballConfig.monsterCount; i++) {
            const x = Math.floor(Math.random() * (maxX - minX + 1) + minX);
            const y = Math.floor(Math.random() * (maxY - minY + 1) + minY);

            if (generated.has(`${x}-${y}`)) {
                i--;
                continue;
            }

            generated.add(`${x}-${y}`);
            this.addEntity(
                new Entity(
                    new Monster(),
                    new Obstacle(),
                    new Position(x * step, y * step),
                    new Health(
                        Math.floor(
                            Math.random() *
                                (pinballConfig.healthRange[1] -
                                    pinballConfig.healthRange[0] +
                                    1) +
                                pinballConfig.healthRange[0]
                        )
                    )
                )
            );
        }
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
