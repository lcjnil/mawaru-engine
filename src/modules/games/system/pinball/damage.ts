import { Engine, System } from '../../../ecs';
import { WillDamage } from '../../component/pinball/will-damage';
import { Health } from '../../component/pinball/health';

@System
export class DamageSystem {
    constructor(public engine: Engine) {}

    run() {
        const willDamageEntityList = this.engine.queryEntities(
            WillDamage,
            Health
        );

        for (const entity of willDamageEntityList) {
            const willDamage = entity.getComponentOrThrow(WillDamage);
            const health = entity.getComponentOrThrow(Health);

            health.value = Math.max(health.value - willDamage.value, 0);
            entity.removeComponent(WillDamage);

            if (health.value === 0) {
                this.engine.removeEntity(entity);
            }
        }
    }
}
