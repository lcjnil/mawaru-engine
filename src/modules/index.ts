import { Engine } from './ecs';
import { Camera } from './resource/camera';
import { CanvasService } from './resource/canvasService';
import { Config } from './resource/config';
import { Block } from './resource/block';
import { BlockRenderer } from './system/blockRenderer';
import { Mouse } from './resource/mouse';
import { BlockClicker } from './system/blockClicker';
import { State } from './resource/state';
import { HudRenderer } from './system/hudRenderer';

// TODO: add restart
export class WhiteBlockEngine extends Engine {
    constructor(public container: HTMLElement) {
        super();

        this.initConfig();
        this.initBlocks();
        this.initCanvas();

        this.addSystem(BlockRenderer);
        this.addSystem(HudRenderer);
        this.addSystem(BlockClicker);
    }

    initConfig() {
        const config = new Config();
        config.enableDebug = true;

        this.addResourceInstance(config);
        this.addResource(State);
    }

    initBlocks() {
        const block = new Block();
        block.generateBlockIndex();

        this.addResourceInstance(block);
    }

    initCanvas() {
        this.addResource(Camera);

        const canvasService = new CanvasService();
        this.addResourceInstance(canvasService);

        const block = this.getResource(Block);
        const canvas = canvasService.createCanvas({
            name: 'map',
            width: block.lane * block.blockWidth,
            height: block.blockHeight * block.verticalCount,
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
            layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        }
    }
}
