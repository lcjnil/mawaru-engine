import { Component } from '../../../ecs';

/**
 * 坐标，这里是世界坐标
 */
@Component
export class Position {
    constructor(public x: number, public y: number) {}
}
