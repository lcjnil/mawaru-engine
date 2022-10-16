import { Component } from '../../../ecs';

@Component
export class Delay {
    constructor(public delay: number) {}
}
