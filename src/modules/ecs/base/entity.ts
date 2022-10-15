import type { ComponentLike } from '../decorators';
import { componentMark } from '../decorators';

export class Entity {
    constructor(...components: any[]) {
        components.forEach((component) => {
            const isComponent = Reflect.getMetadata(
                componentMark,
                component.constructor
            );

            if (!isComponent) {
                throw new Error(
                    `${component.constructor.name} is not a Component`
                );
            }
        });

        this.components = components;
    }

    components: any[] = [];

    getComponent<T>(constructor: ComponentLike<T>): T | undefined {
        return this.components.find((item) => item instanceof constructor);
    }

    getComponentOrThrow<T>(constructor: ComponentLike<T>): T {
        const component = this.getComponent(constructor);
        if (!component) {
            throw new Error(`Component ${constructor.name} not found`);
        }

        return component;
    }

    hasComponent<T>(constructor: ComponentLike<T>): boolean {
        // TODO: 可以构造一个 map 优化性能
        return !!this.getComponent(constructor);
    }

    addComponent<T>(component: T) {
        this.components.push(component);
    }

    removeComponent<T>(constructor: ComponentLike<T>) {
        const index = this.components.findIndex(
            (item) => item instanceof constructor
        );
        if (index >= 0) {
            this.components.splice(index, 1);
        }
    }
}
