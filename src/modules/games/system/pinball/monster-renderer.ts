import { Engine, Resource, System } from '../../../ecs';
import { CanvasService } from '../../resource/canvasService';
import { Monster } from '../../component/pinball/monster';
import { Rect } from '../../component/pinball/rect';
import { ImageRender } from '../../component/pinball/imageRender';
import { Config } from '../../resource/config';
import { PinballConfig } from '../../resource/pinball/pinballConfig';
import { Health } from '../../component/pinball/health';
import { SpriteRenderer } from '../../component/pinball/spriteRenderer';
import { MonsterSpawnService } from '../../resource/pinball/monsterSpawn';

@System
export class MonsterRenderer {
    constructor(public engine: Engine) {}

    run(
        @Resource(CanvasService) canvasService: CanvasService,
        @Resource(Config) config: Config,
        @Resource(PinballConfig) pinballConfig: PinballConfig,
        @Resource(MonsterSpawnService) monsterSpawnService: MonsterSpawnService
    ) {
        const ctx = canvasService.defaultLayer;
        const monsters = this.engine.queryEntities(Monster, Rect);

        for (const monster of monsters) {
            const rect = monster.getComponentOrThrow(Rect);
            const imageRender = monster.getComponent(ImageRender);
            let spriteRender = monster.getComponent(SpriteRenderer);
            const health = monster.getComponent(Health);

            if (imageRender) {
                ctx.drawImage(
                    imageRender.img,
                    0,
                    0,
                    imageRender.img.width,
                    imageRender.img.height,
                    rect.x - (rect.width * imageRender.scale - rect.width) / 2,
                    rect.y -
                        (rect.height * imageRender.scale - rect.height) / 2,
                    rect.width * imageRender.scale,
                    rect.height * imageRender.scale
                );
            }

            if (spriteRender) {
                if (!spriteRender.startTime) {
                    spriteRender.startTime = this.engine.currentTickTime;
                }

                let frame = Math.floor(
                    (this.engine.currentTickTime - spriteRender.startTime) /
                        (1000 / spriteRender.config.fps)
                );

                if (
                    !spriteRender.config.loop &&
                    frame > spriteRender.config.totalCount
                ) {
                    // if (!monster.getComponent(Health)) {
                    //     this.engine.removeEntity(monster);
                    //     continue;
                    // }

                    monster.removeComponent(SpriteRenderer);
                    spriteRender = monsterSpawnService.getIdleComponent();
                    monster.addComponent(spriteRender);
                    frame = 0;
                }
                frame = frame % spriteRender.config.totalCount;

                const x = Math.floor(
                    frame / spriteRender.config.horizontalCount
                );
                const y = frame % spriteRender.config.horizontalCount;

                ctx.drawImage(
                    spriteRender.img,
                    x * spriteRender.config.width,
                    y * spriteRender.config.height,
                    spriteRender.config.width,
                    spriteRender.config.height,
                    rect.x -
                        (rect.width * spriteRender.config.scale - rect.width) /
                            2,
                    rect.y -
                        (rect.height * spriteRender.config.scale -
                            rect.height) /
                            2 +
                        (spriteRender.config.offset ?? 0),
                    rect.width * spriteRender.config.scale,
                    rect.height * spriteRender.config.scale
                );
            }

            if (health) {
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(
                    rect.x + rect.width,
                    rect.y + rect.height,
                    pinballConfig.healthArcRadius,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = `${pinballConfig.healthTextSize} Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    health.value.toString(),
                    rect.x + rect.width,
                    rect.y + rect.height
                );
            }

            if (config.enableDebug) {
                // 渲染边框
                ctx.strokeStyle = '#000';
                ctx.setLineDash([]);
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            }
        }
    }
}
