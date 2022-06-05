import { Engine } from ".";
import { BaseSystem } from "./base/BaseSystem";
import { System, Resource, Component } from "./decorators";

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
    // constructor(public engine: Engine) {

    // }

    x = 1;
}

@System
class SomeSystem extends BaseSystem {
    run(@Resource(SomeResource) someResource: SomeResource) {
        console.error(someResource.x);
    }
}

class MyEngine extends Engine {
    constructor() {
        super();

        this.addResource(SomeResource);
        this.addSystem(SomeSystem);

        this.addComponent(
            new Player(),
            new Health(100, 100),
            new Position(0, 0)
        );
        this.addComponent(
            new Monster(),
            new Health(20, 20),
            new Position(0, 0)
        );

        const result = this.queryComponent(Player);
        console.error(result);

        const result2 = this.queryComponent(Player, Health);
        console.error(result2);

        const result3 = this.queryComponent(Monster, Health, Position);
        console.error(result3);

        const result4 = this.queryComponent(Health, Position);
        console.error(result4);
    }

    tick() {
        // do nothing
    }
}

// @ts-expect-error
window.e = new MyEngine();
