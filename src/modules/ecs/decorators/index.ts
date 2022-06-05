/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
export const systemMark = Symbol("system");
export const componentMark = Symbol("component");
export const argsMark = Symbol("args");

export interface ResourceLike<T = any> {
    new (...args: any): T;
}

export interface ComponentLike<T = any> {
    new (...args: any): T;
}

export interface SystemLike {
    run(...args: any[]): void;
}

export type ComponentGroup<T extends any[] = any[]> = T;

/**
 * 标记一个 class 是否是 System
 * @param constructor System
 */
export function System(constructor: { new (...args: any): SystemLike }) {
    Reflect.defineMetadata(systemMark, true, constructor);
}

export type ArgsMetaData = Record<number, ResourceLike>;

/**
 * 标记一个 class 是否是 System
 * @param resource Resource
 * @returns
 */
export function Resource(resource: ResourceLike) {
    return (
        target: Object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) => {
        const oldArgsMeta: ArgsMetaData =
            Reflect.getMetadata(argsMark, target, propertyKey) || {};
        oldArgsMeta[parameterIndex] = resource;

        Reflect.defineMetadata(argsMark, oldArgsMeta, target, propertyKey);
    };
}

/**
 * 标记一个 class 是否是 Component
 * @param constructor Component
 */
export function Component(constructor: ComponentLike) {
    Reflect.defineMetadata(componentMark, true, constructor);
}
