/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    argsMark,
    systemMark,
    type ArgsMetaData,
    type ResourceLike,
    type SystemLike,
} from './decorators';
import type { Entity } from './base/entity';

export abstract class Engine {
    private resources = new Map<ResourceLike, any>();
    private systems: SystemLike[] = [];
    private entities: Entity[] = [];

    private running = false;

    constructor() {
        this.addResourceInstance(this);
    }

    addResource(resource: ResourceLike) {
        this.resources.set(resource, new resource());
    }

    addResourceInstance(resource: any) {
        this.resources.set(resource.constructor, resource);
    }

    getResource<T>(resource: ResourceLike<T>): T {
        return this.resources.get(resource);
    }

    addSystem(system: { new (engine: Engine): SystemLike }) {
        if (!Reflect.getMetadata(systemMark, system)) {
            throw new Error(`${system.name} is not a system`);
        }

        this.systems.push(new system(this));

        return this;
    }

    addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    // queryEntity<T1>(arg: ComponentLike<T1>): [T1][];
    //
    // queryEntity<T1, T2>(
    //     arg: ComponentLike<T1>,
    //     arg2: ComponentLike<T2>
    // ): [T1, T2][];
    //
    // queryEntity<T1, T2, T3>(
    //     arg: ComponentLike<T1>,
    //     arg2: ComponentLike<T2>,
    //     arg3: ComponentLike<T3>
    // ): [T1, T2, T3][];
    //
    // queryEntity<T1, T2, T3, T4>(
    //     arg: ComponentLike<T1>,
    //     arg2: ComponentLike<T2>,
    //     arg3: ComponentLike<T3>,
    //     arg4: ComponentLike<T4>
    // ): [T1, T2, T3, T4][];

    queryEntities(...args: any) {
        const result: Entity[] = [];

        for (const entity of this.entities) {
            let match = true;
            for (const constructor of args) {
                const component = entity.hasComponent(constructor);

                if (!component) {
                    match = false;
                    break;
                }
            }

            if (match) {
                result.push(entity);
            }
        }

        return result;
    }

    removeEntity(entity: Entity) {
        const index = this.entities.indexOf(entity);
        if (index === -1) {
            return;
        }

        this.entities.splice(index, 1);
    }

    private getResourcesFromArgsMeta(argsMeta: ArgsMetaData) {
        if (!argsMeta) {
            return [];
        }

        return Object.entries(argsMeta)
            .map(([index, Resource]) => [index, this.getResource(Resource)])
            .sort(([indexA], [indexB]) => indexA - indexB)
            .map(([, resource]) => resource);
    }

    private tickSystems() {
        this.systems.forEach((system) => {
            const argsMeta: ArgsMetaData = Reflect.getMetadata(
                argsMark,
                system,
                'run'
            );
            const args = this.getResourcesFromArgsMeta(argsMeta);

            system.run(...args);
        });
    }

    abstract tick(): void;

    start() {
        this.running = true;
        this.loop();
    }

    loop() {
        if (!this.running) {
            return;
        }

        this.doTick();
        requestAnimationFrame(() => {
            this.start();
        });
    }

    lastTickTime = 0;
    currentTickTime = 0;

    get deltaTickTime() {
        // return this.currentTickTime - this.lastTickTime;
        return 1000 / 60;
    }

    doTick() {
        this.lastTickTime = this.currentTickTime;
        this.currentTickTime = Date.now();

        if (this.lastTickTime === 0) {
            return;
        }

        this.tick();
        this.tickSystems();
    }

    stop() {
        this.running = false;
    }
}
