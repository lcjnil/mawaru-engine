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
import { Monster } from './component/pinball/monster';
import { Obstacle } from './component/pinball/obstacle';
import { Health } from './component/pinball/health';
import { Wall } from './component/pinball/wall';
import { DelaySystem } from './system/pinball/delay';
import { BackgroundRenderer } from './system/pinball/backgrund-renderer';
import { Rect } from './component/pinball/rect';

import zodiacImage from './assets/zodiac.png';
import { ImageRender } from './component/pinball/imageRender';
import { MonsterSpawnService } from './resource/pinball/monsterSpawn';

// TODO: monster spawn
// TODO: sprite renderer
// TODO: modified collision detection
export class PinBallEngine extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initCanvas();

        this.initEntities();

        // NOTE: 现在 system 比较多，可能需要根据 stage 来切换 活跃的 system
        this.addSystem(DelaySystem)
            .addSystem(BackgroundRenderer)
            .addSystem(LineRenderer)
            .addSystem(MoveSystem)
            .addSystem(DamageSystem)
            // .addSystem(WallRenderer)
            .addSystem(MonsterRenderer)
            .addSystem(PinballRenderer)
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
        const image = new Image();
        image.src = zodiacImage;

        function getMonsterRect(x: number, y: number) {
            return new Rect(
                pinballConfig.leftRightScreenPadding +
                    (x - 1) * pinballConfig.monsterScreenSize,
                (y - 1) * pinballConfig.monsterScreenSize,
                pinballConfig.monsterScreenSize,
                pinballConfig.monsterScreenSize
            );
        }

        this.addEntity(
            new Entity(
                new Monster(),
                new Obstacle(),
                getMonsterRect(2, 2),
                new Health(1),
                new ImageRender(image, 1.3)
            )
        );
        this.addEntity(
            new Entity(
                new Monster(),
                new Obstacle(),
                getMonsterRect(3, 2),
                new Health(10),
                new ImageRender(image, 1.3)
            )
        );
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
