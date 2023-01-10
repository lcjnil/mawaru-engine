import { Engine } from '../ecs';
import { Camera } from './resource/camera';
import { CanvasService } from './resource/canvasService';
import { Config } from './resource/config';
import { Mouse } from './resource/mouse';
import { PinballState } from './resource/pinball/pinballState';
import { MoveSystem } from './system/pinball/move';
import { DamageSystem } from './system/pinball/damage';
import { MonsterRenderer } from './system/pinball/monster-renderer';
import { PinballRenderer } from './system/pinball/pinball-renderer';
import { LineRenderer } from './system/pinball/line-renderer';
import { StageChecker } from './system/pinball/stage-checker';
import { PinballConfig } from './resource/pinball/pinballConfig';
import { Entity } from '../ecs/base/entity';
import { Line } from './component/pinball/line';
import { Obstacle } from './component/pinball/obstacle';
import { Wall } from './component/pinball/wall';
import { DelaySystem } from './system/pinball/delay';
import { BackgroundRenderer } from './system/pinball/backgrund-renderer';
import { Rect } from './component/pinball/rect';
import { MonsterSpawnService } from './resource/pinball/monsterSpawn';
import { MonsterMoveSystem } from './system/pinball/monster-move';

// TODO: monster spawn algorithm
export class PinBallEngine extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initCanvas();

        this.initEntities();

        // NOTE: 现在 system 比较多，可能需要根据 stage 来切换 活跃的 system
        this.addSystem(DelaySystem)
            .addSystem(BackgroundRenderer)
            .addSystem(MoveSystem)
            .addSystem(MonsterMoveSystem)
            .addSystem(DamageSystem)
            // .addSystem(WallRenderer)
            .addSystem(MonsterRenderer)
            .addSystem(PinballRenderer)
            .addSystem(LineRenderer)
            .addSystem(StageChecker);
    }

    initConfig() {
        const config = new Config();
        config.enableDebug = true;

        const pinballConfig = new PinballConfig();
        pinballConfig.shootPosition = [
            config.screenWidth / 2,
            pinballConfig.areaScreenHeight,
        ];

        const monsterSpawnService = new MonsterSpawnService(pinballConfig);

        this.addResourceInstance(config);
        this.addResourceInstance(pinballConfig);
        this.addResource(PinballState);
        this.addResourceInstance(monsterSpawnService);
    }

    initEntities() {
        const pinballConfig = this.getResource(PinballConfig);

        console.log(pinballConfig.shootPosition);
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

        this.addEntity(
            new Entity(
                new Wall(),
                new Obstacle(),
                new Rect(
                    pinballConfig.leftRightScreenPadding - config.screenHeight,
                    0,
                    config.screenHeight,
                    config.screenHeight
                )
            )
        );

        this.addEntity(
            new Entity(
                new Wall(),
                new Obstacle(),
                new Rect(
                    config.screenWidth - pinballConfig.leftRightScreenPadding,
                    0,
                    config.screenHeight,
                    config.screenHeight
                )
            )
        );

        this.addEntity(
            new Entity(
                new Wall(),
                new Obstacle(),
                new Rect(
                    0,
                    -config.screenWidth,
                    config.screenWidth,
                    config.screenWidth
                )
            )
        );
    }

    initMonsters() {
        const pinballConfig = this.getResource(PinballConfig);
        const monsterSpawnService = this.getResource(MonsterSpawnService);

        monsterSpawnService.spawnLineMonster().forEach((entity) => {
            this.addEntity(entity);
        });
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
        mouse.bindEvents(canvas, config.scaleRatio);

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
