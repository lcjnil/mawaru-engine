import { describe, expect, it } from 'vitest';
import { Engine } from './engine';
import { BaseSystem } from './base/BaseSystem';
import { System, Resource, Component } from './decorators';
import { Entity } from './base/entity';

@Component
class Player {}

@Component
class Monster {}

@Component
class Health {
    constructor(public max: number, public current: number) {}
}

@Component
class Position {
    constructor(public x: number, public y: number) {}
}

class SomeResource {
    x = 1;
}

@System
class SomeSystem extends BaseSystem {
    run(@Resource(SomeResource) someResource: SomeResource) {
        console.error(someResource.x);
    }
}

describe('entity system', () => {
    class MyEngine extends Engine {
        constructor() {
            super();
            this.addResource(SomeResource);
            this.addSystem(SomeSystem);

            this.addEntity(
                new Entity(
                    new Player(),
                    new Health(100, 100),
                    new Position(0, 0)
                )
            );
            this.addEntity(
                new Entity(
                    new Monster(),
                    new Health(20, 20),
                    new Position(0, 0)
                )
            );
        }

        tick() {
            // do nothing
        }
    }

    it('should get resource by Resouce constructor', () => {
        const engine = new MyEngine();
        expect(engine.getResource(SomeResource)).toBeInstanceOf(SomeResource);
    });

    it('should get correct query', () => {
        const engine = new MyEngine();

        {
            const result = engine.queryEntities(Player);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(Entity);
            expect(result[0].getComponent(Player)).toBeInstanceOf(Player);
        }

        {
            const result = engine.queryEntities(Player, Health);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(Entity);
            expect(result[0].getComponent(Player)).toBeInstanceOf(Player);
            expect(result[0].getComponent(Health)).toBeInstanceOf(Health);
        }

        {
            const result = engine.queryEntities(Health, Position);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Entity);
            expect(result[0].getComponent(Health)).toBeInstanceOf(Health);
            expect(result[0].getComponent(Position)).toBeInstanceOf(Position);

            expect(result[1].getComponent(Health)).toBeInstanceOf(Health);
            expect(result[1].getComponent(Position)).toBeInstanceOf(Position);
        }
    });

    it('should inject resource to system', () => {
        @System
        class TestSystem {
            run(@Resource(SomeResource) resource: SomeResource) {
                expect(resource).toBeInstanceOf(SomeResource);
                expect(resource.x).toBe(1);
            }
        }

        const engine = new MyEngine();
        engine.addSystem(TestSystem);
        engine.doTick();

        expect.assertions(2);
    });
});
