import { Engine, Resource, System } from '../../../ecs';
import { CanvasService } from '../../resource/canvasService';
import { Monster } from '../../component/pinball/monster';
import { Rect } from '../../component/pinball/rect';
import { ImageRender } from '../../component/pinball/imageRender';
import { Config } from '../../resource/config';
import { PinballConfig } from '../../resource/pinball/pinballConfig';
import { Health } from '../../component/pinball/health';

@System
export class MonsterRenderer {
    constructor(public engine: Engine) {}

    run(
        @Resource(CanvasService) canvasService: CanvasService,
        @Resource(Config) config: Config,
        @Resource(PinballConfig) pinballConfig: PinballConfig
    ) {
        const ctx = canvasService.defaultLayer;
        const monsters = this.engine.queryEntities(Monster, Rect);

        for (const monster of monsters) {
            const rect = monster.getComponentOrThrow(Rect);
            const imageRender = monster.getComponent(ImageRender);
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

            if (health) {
                // 渲染一个血量的数字，在怪物的右下角，并且有红色圆背景
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
