import { Component } from '../../../ecs';

/**
 * 辅助线
 */
@Component
export class Line {
    constructor(public angle: number, public position: [number, number]) {}

    changed = false;

    reset() {
        this.changed = false;
        this.angle = Math.PI * 1.5;
    }
}
