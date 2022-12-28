import { random, shuffle } from 'lodash';
import type { PinballConfig } from './pinballConfig';
import { Rect } from '../../component/pinball/rect';
import { Entity } from '../../../ecs/base/entity';
import { Monster } from '../../component/pinball/monster';
import { Obstacle } from '../../component/pinball/obstacle';
import { Health } from '../../component/pinball/health';
import { ImageRender } from '../../component/pinball/imageRender';

import zodiacImage from '../../assets/zodiac.png';

export class MonsterSpawnService {
    idleImage: HTMLImageElement;

    constructor(public pinballConfig: PinballConfig) {
        this.idleImage = new Image();
        this.idleImage.src = zodiacImage;
    }

    private getMonsterRect(x: number, y: number) {
        return new Rect(
            this.pinballConfig.leftRightScreenPadding +
                (x - 1) * this.pinballConfig.monsterScreenSize,
            (y - 1) * this.pinballConfig.monsterScreenSize,
            this.pinballConfig.monsterScreenSize,
            this.pinballConfig.monsterScreenSize
        );
    }

    private spawn(x: number, y: number) {
        return new Entity(
            new Monster(),
            new Obstacle(),
            this.getMonsterRect(x, y),
            new Health(random(...this.pinballConfig.healthRange)),
            new ImageRender(this.idleImage, 1.3)
        );
    }

    /**
     */
    spawnLineMonster() {
        const spawnMonsterCount = random(1, 3);
        return shuffle([
            ...new Array(spawnMonsterCount).fill(true),
            ...new Array(
                this.pinballConfig.verticalCount - spawnMonsterCount
            ).fill(false),
        ])
            .map((isSpawn, index) => {
                if (isSpawn) {
                    return this.spawn(index + 1, 1);
                }
            })
            .filter((v): v is Entity => v);
    }
}
