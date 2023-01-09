import type { ComponentLike } from '../decorators';
import { componentMark } from '../decorators';

export class Entity {
    constructor(...components: any[]) {
        components.forEach((component) => {
            if (!component) {
                return;
            }

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

        // this.components = components.filter((v) => v);
        components.forEach((component) => {
            // @ts-ignore
            this.componentMap.set(component.constructor, component);
        });
    }

    componentMap: Map<ComponentLike<any>, any> = new Map();

    getComponent<T>(constructor: ComponentLike<T>): T | undefined {
        return this.componentMap.get(constructor);
    }

    getComponentOrThrow<T>(constructor: ComponentLike<T>): T {
        const component = this.getComponent(constructor);
        if (!component) {
            throw new Error(`Component ${constructor.name} not found`);
        }

        return component;
    }

    hasComponent<T>(constructor: ComponentLike<T>): boolean {
        return this.componentMap.has(constructor);
    }

    addComponent<T>(component: T) {
        this.removeComponent(component.constructor);
        // @ts-ignore
        this.componentMap.set(component.constructor, component);
    }

    removeComponent<T>(constructor: ComponentLike<T>) {
        this.componentMap.delete(constructor);
    }
}
