import { Engine, Resource, System } from '../../../ecs';
import { WillDamage } from '../../component/pinball/will-damage';
import { Health } from '../../component/pinball/health';
import { SpriteRenderer } from '../../component/pinball/spriteRenderer';
import { MonsterSpawnService } from '../../resource/pinball/monsterSpawn';

@System
export class DamageSystem {
    constructor(public engine: Engine) {}

    run(
        @Resource(MonsterSpawnService) monsterSpawnService: MonsterSpawnService
    ) {
        const willDamageEntityList = this.engine.queryEntities(
            WillDamage,
            Health
        );

        for (const entity of willDamageEntityList) {
            const willDamage = entity.getComponentOrThrow(WillDamage);
            const health = entity.getComponentOrThrow(Health);

            health.value = Math.max(health.value - willDamage.value, 0);
            entity.removeComponent(WillDamage);

            entity.addComponent(
                monsterSpawnService.getUnderAttackedComponent()
            );

            // if (health.value === 0) {
            //     entity.removeComponent(Health);
            // }
            if (health.value === 0) {
                this.engine.removeEntity(entity);
            }
        }
    }
}
