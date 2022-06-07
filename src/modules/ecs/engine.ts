/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    argsMark,
    componentMark,
    systemMark,
    type ArgsMetaData,
    type ComponentGroup,
    type ComponentLike,
    type ResourceLike,
    type SystemLike,
} from './decorators';

export abstract class Engine {
    private resources = new Map<ResourceLike, any>();
    private systems: SystemLike[] = [];
    private entities: ComponentGroup[] = [];

    addResource(resource: ResourceLike) {
        this.resources.set(resource, new resource());
    }

    addResourceInstance(resource: any) {
        this.resources.set(resource.constructor, resource);
    }

    getResource<T>(resource: ResourceLike<T>): T {
        return this.resources.get(resource);
    }

    addSystem(system: { new (): SystemLike }) {
        if (!Reflect.getMetadata(systemMark, system)) {
            throw new Error(`${system.name} is not a system`);
        }

        this.systems.push(new system());
    }

    addComponent<T extends any[]>(...args: ComponentGroup<T>) {
        args.forEach((arg) => {
            const isComponent = Reflect.getMetadata(
                componentMark,
                arg.constructor
            );
            if (!isComponent) {
                throw new Error(`${arg.constructor.name} is not a Component`);
            }
        });

        this.entities.push(args);
    }

    queryComponent<T1>(arg: ComponentLike<T1>): [T1][];

    queryComponent<T1, T2>(
        arg: ComponentLike<T1>,
        arg2: ComponentLike<T2>
    ): [T1, T2][];

    queryComponent<T1, T2, T3>(
        arg: ComponentLike<T1>,
        arg2: ComponentLike<T2>,
        arg3: ComponentLike<T3>
    ): [T1, T2, T3][];

    queryComponent<T1, T2, T3, T4>(
        arg: ComponentLike<T1>,
        arg2: ComponentLike<T2>,
        arg3: ComponentLike<T3>,
        arg4: ComponentLike<T4>
    ): [T1, T2, T3, T4][];

    queryComponent(...args: any) {
        const result: any[][] = [];

        for (const entity of this.entities) {
            const tempResult: any[] = [];

            for (const constructor of args) {
                const component = entity.find(
                    (arg) => arg instanceof constructor
                );

                if (component) {
                    tempResult.push(component);
                } else {
                    break;
                }
            }

            if (tempResult.length === args.length) {
                result.push(tempResult);
            }
        }

        return result;
    }

    private getResourcesFromArgsMeta(argsMeta: ArgsMetaData) {
        // TODO: 验证下顺序
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
        this.tickSystems();

        requestAnimationFrame(() => {
            this.doTick();
        });
    }

    doTick() {
        this.tickSystems();
        this.tick();
    }
}
