import { Component } from '../../../ecs';

@Component
export class Rect {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}
}
