import { random, shuffle } from 'lodash';
import type { PinballConfig } from './pinballConfig';
import { Rect } from '../../component/pinball/rect';
import { Entity } from '../../../ecs/base/entity';
import { Monster } from '../../component/pinball/monster';
import { Obstacle } from '../../component/pinball/obstacle';
import { Health } from '../../component/pinball/health';

import { SpriteRenderer } from '../../component/pinball/spriteRenderer';

import underAttackSprite from '../../assets/sprite-under-attack.png';
import idleSprite from '../../assets/sprite-idle.png';
import walkSprite from '../../assets/sprite-walk.png';

// TODO: 换个位置
const scaleRatio = window.innerWidth / 414;

export class MonsterSpawnService {
    idleImage = new Image();
    underAttackImage = new Image();
    walkImage = new Image();

    constructor(public pinballConfig: PinballConfig) {
        this.underAttackImage.src = underAttackSprite;
        this.idleImage.src = idleSprite;
        this.walkImage.src = walkSprite;
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

    getUnderAttackedComponent() {
        return new SpriteRenderer(this.underAttackImage, {
            width: 414 * 2,
            height: 414 * 2,
            totalCount: 39,
            verticalCount: 7,
            horizontalCount: 7,
            scale: 2,
            loop: false,
            fps: 60,
            offset: 15 * scaleRatio,
        });
    }

    getIdleComponent() {
        return new SpriteRenderer(this.idleImage, {
            width: 414,
            height: 414,
            totalCount: 54,
            verticalCount: 8,
            horizontalCount: 7,
            scale: 2,
            loop: true,
            fps: 90,
            offset: 15 * scaleRatio,
        });
    }

    getWalkComponent() {
        return new SpriteRenderer(this.walkImage, {
            width: 414,
            height: 414,
            totalCount: 41,
            verticalCount: 8,
            horizontalCount: 7,
            scale: 2,
            loop: true,
            fps: 90,
            offset: 15 * scaleRatio,
        });
    }

    private spawn(x: number, y: number) {
        return new Entity(
            new Monster(),
            new Obstacle(),
            this.getMonsterRect(x, y),
            new Health(random(...this.pinballConfig.healthRange)),
            // new ImageRender(this.idleImage, 2)
            this.getIdleComponent()
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
