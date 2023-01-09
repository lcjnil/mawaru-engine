import { Engine, Resource, System } from '../../../ecs';
import { MonsterMove } from '../../component/pinball/monsterMove';
import { Rect } from '../../component/pinball/rect';
import { Monster } from '../../component/pinball/monster';
import { MonsterSpawnService } from '../../resource/pinball/monsterSpawn';

@System
export class MonsterMoveSystem {
    constructor(public engine: Engine) {}

    run(
        @Resource(MonsterSpawnService) monsterSpawnService: MonsterSpawnService
    ) {
        const monsters = this.engine.queryEntities(Monster, Rect, MonsterMove);
        for (const monster of monsters) {
            const rect = monster.getComponentOrThrow(Rect);
            const move = monster.getComponentOrThrow(MonsterMove);

            if (rect.y <= move.targetY) {
                rect.y += (move.speed * this.engine.deltaTickTime) / 1000;
            } else {
                monster.removeComponent(MonsterMove);
                monster.addComponent(monsterSpawnService.getIdleComponent());
            }
        }
    }
}
