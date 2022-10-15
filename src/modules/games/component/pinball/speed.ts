import { Component } from '../../../ecs';
import type { Position } from './position';

/**
 * 具有速度，速度具有方向和大小
 */
@Component
export class Speed {
    constructor(public angle: number, public speed: number) {}

    hitComponent?: Position;
}
