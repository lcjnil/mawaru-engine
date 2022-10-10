import { Component } from '../ecs';

@Component
export class Position {
    position = [0, 0, 0];

    originalPosition = [0, 0, 0];
    acceleration = [0, -10, -1];
    velocity = [0, 0, 0];
    startTime = 0;

    constructor(position: [number, number, number]) {
        this.position = position;
    }

    move(
        acceleration: [number, number, number],
        velocity: [number, number, number]
    ) {
        this.acceleration = acceleration;
        this.velocity = velocity;
        this.originalPosition = [...this.position];

        this.startTime = Date.now();
    }
}
